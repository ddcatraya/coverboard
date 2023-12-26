import { useEffect } from 'react';
import { useMainStore } from 'store';

export const useKeysListener = () => {
  const undoAction = useMainStore((state) => state.undoAction);

  useEffect(() => {
    const keyFn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoAction();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [undoAction]);
};
