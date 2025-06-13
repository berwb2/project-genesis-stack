
import { useSound } from '@/contexts/SoundContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SoundToggle() {
  const { isEnabled, setIsEnabled } = useSound();

  const toggleSounds = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSounds} 
          aria-label={isEnabled ? "Disable sounds" : "Enable sounds"}
        >
          {isEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isEnabled ? "Disable sounds" : "Enable sounds"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
