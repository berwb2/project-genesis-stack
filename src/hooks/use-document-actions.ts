
import { useSound } from '@/contexts/SoundContext';
import { createDocument } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export function useDocumentActions() {
  const { playSound } = useSound();

  const createDocumentWithSound = async (documentData: {
    title: string;
    content: string;
    content_type: string;
    is_template?: boolean;
    metadata?: any;
  }) => {
    try {
      await supabase.auth.refreshSession();
      const result = await createDocument(documentData);
      playSound('bubble');
      toast.success('Document created successfully!');
      return result.id; // Return just the ID string
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document. Please try again.');
      throw error;
    }
  };

  return {
    createDocumentWithSound
  };
}
