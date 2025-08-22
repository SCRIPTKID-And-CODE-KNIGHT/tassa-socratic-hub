import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VoiceGreeting = () => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playGreeting = () => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance("WELCOME TO TANZANIA ADVANCED SOCRATIC ASSOCIATION");
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      // Configure speech settings
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopGreeting = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Auto-play greeting when component mounts (with a small delay)
    const timer = setTimeout(() => {
      if (!hasPlayed && 'speechSynthesis' in window) {
        playGreeting();
        setHasPlayed(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hasPlayed]);

  if (!('speechSynthesis' in window)) {
    return null; // Don't render if speech synthesis is not supported
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={isPlaying ? stopGreeting : playGreeting}
        size="sm"
        variant="secondary"
        className="shadow-lg"
      >
        {isPlaying ? (
          <VolumeX className="h-4 w-4 mr-2" />
        ) : (
          <Volume2 className="h-4 w-4 mr-2" />
        )}
        {isPlaying ? 'Stop' : 'Play'} Greeting
      </Button>
    </div>
  );
};

export default VoiceGreeting;