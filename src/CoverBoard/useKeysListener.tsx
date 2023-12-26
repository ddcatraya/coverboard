import { useEffect } from 'react';
import { useMainStore, useToolbarStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';

interface UseKeysListener {
  createGroup: () => void;
  takeScreenshot: () => void;
}

export const useKeysListener = ({
  createGroup,
  takeScreenshot,
}: UseKeysListener) => {
  const undoAction = useMainStore((state) => state.undoAction);

  const [openConfig, setOpenConfig] = useToolbarStore(
    (state) => [state.openConfig, state.setOpenConfig],
    shallow,
  );
  const [openSearch, setOpenSearch] = useToolbarStore(
    (state) => [state.openSearch, state.setOpenSearch],
    shallow,
  );
  const [openShare, setOpenShare] = useToolbarStore(
    (state) => [state.openShare, state.setOpenShare],
    shallow,
  );
  const openPopup = openConfig || openSearch || openShare;

  const selected = useUtilsStore((state) => state.selected);
  const editLines = useUtilsStore((state) => state.points);

  useEffect(() => {
    const keyFn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoAction();
        e.preventDefault();
      }

      if (!selected && !editLines && !openPopup) {
        if (e.key === 'a') {
          e.preventDefault();
          setOpenSearch(true);
        } else if (e.key === 'o') {
          e.preventDefault();
          setOpenConfig(true);
        } else if (e.key === 's') {
          e.preventDefault();
          setOpenShare(true);
        } else if (e.key === 'b') {
          e.preventDefault();
          createGroup();
        } else if (e.key === 'c') {
          e.preventDefault();
          takeScreenshot();
        } else if (e.key === 'u') {
          e.preventDefault();
          undoAction();
        }
        console.log(e.key);
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [
    undoAction,
    setOpenShare,
    setOpenSearch,
    setOpenConfig,
    selected,
    editLines,
    openSearch,
    openConfig,
    openShare,
    openPopup,
    createGroup,
    takeScreenshot,
  ]);
};
