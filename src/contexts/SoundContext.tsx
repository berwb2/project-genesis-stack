
import React, { createContext, useContext, useState, useCallback } from 'react';

type SoundType = 'wave' | 'bubble' | 'droplet';

interface SoundContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  playSound: (soundType: SoundType) => void;
  hasUserInteracted: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const playSound = useCallback((soundType: SoundType) => {
    if (!isEnabled) return;

    try {
      const soundMap = {
        wave: '/sounds/ocean-wave.mp3',
        bubble: '/sounds/soft-bubble.mp3',
        droplet: '/sounds/water-droplet.mp3'
      };

      const audio = new Audio(soundMap[soundType]);
      audio.volume = 0.3;
      
      // Only play if user has interacted with the page
      if (hasUserInteracted) {
        audio.play().catch(() => {
          // Silently fail if audio can't play
        });
      }
    } catch (error) {
      // Silently handle audio errors
    }
  }, [isEnabled, hasUserInteracted]);

  // Set up user interaction detection
  React.useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <SoundContext.Provider value={{
      isEnabled,
      setIsEnabled,
      playSound,
      hasUserInteracted
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
