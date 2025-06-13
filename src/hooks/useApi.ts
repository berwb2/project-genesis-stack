
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobalStore } from '@/store';

// Generic hook for API calls with loading state
export function useApiCall<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    retry?: number;
    staleTime?: number;
  }
) {
  const { setLoading, setError, clearError } = useGlobalStore();

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    onError: (error: any) => {
      setError(error.message || 'An error occurred');
    },
    onSuccess: () => {
      clearError();
    },
  });

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
}

// Hook for mutations with optimistic updates
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: any, variables: TVariables) => void;
    invalidateQueries?: string[];
  }
) {
  const queryClient = useQueryClient();
  const { setLoading, setError, clearError, addNotification } = useGlobalStore();

  const mutation = useMutation({
    mutationFn,
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data, variables) => {
      setLoading(false);
      options?.onSuccess?.(data, variables);
      
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed successfully',
        read: false,
      });
    },
    onError: (error: any, variables) => {
      setLoading(false);
      setError(error.message || 'An error occurred');
      options?.onError?.(error, variables);
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'An error occurred',
        read: false,
      });
    },
  });

  return mutation;
}

// Hook for debounced search
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for local storage with type safety
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
