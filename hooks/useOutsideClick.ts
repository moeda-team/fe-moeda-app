import { useEffect, useRef } from 'react';

type UseOutsideClickProps = {
  callback: () => void;
};

const useOutsideClick = <T extends HTMLElement = HTMLElement>({
  callback,
}: UseOutsideClickProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useOutsideClick;