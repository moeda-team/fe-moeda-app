import { useState, useEffect } from 'react';

function useCountdown(initialTime: string = '5:00') {
  const parseTime = (timeInput: string): number => {
    const [minStr, secStr] = timeInput.split(':');
    const minutes = parseInt(minStr, 10) || 0;
    const seconds = parseInt(secStr, 10) || 0;
    return minutes * 60 + seconds;
  };

  const [time, setTime] = useState<number>(parseTime(initialTime));
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (time <= 0) {
      setIsFinished(true);
      return;
    }

    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const minutes: number = Math.floor(time / 60);
  const seconds: string = time % 60 < 10 ? `0${time % 60}` : String(time % 60);

  const formatTime = (): string => {
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  return { minutes, seconds, isFinished, formatTime };
}

export default useCountdown;
