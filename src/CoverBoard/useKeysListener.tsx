import { useEffect } from 'react';
import { useMainStore, useToolbarStore, useUtilsStore } from 'store';

export const useKeysListener = () => {
  const undoAction = useMainStore((state) => state.undoAction);

  const openPopup = useToolbarStore((state) => state.isPopupOpen());

  const selected = useUtilsStore((state) => state.selected);
  const setSelected = useUtilsStore((state) => state.setSelected);
  const editLines = useUtilsStore((state) => state.points);
  const hasMode = useUtilsStore((state) => state.hasMode());
  const editTitle = useUtilsStore((state) => state.editTitle);

  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoAction();
        e.preventDefault();
      } else if (e.key === 'q' && !hasMode && !openPopup) {
        if (covers[0]) {
          setSelected({ id: covers[0].id, elem: 'cover' });
        } else if (groups[0]) {
          setSelected({ id: groups[0].id, elem: 'group' });
        }

        e.preventDefault();
      } else if (
        e.key === 'q' &&
        selected &&
        !editLines &&
        !editTitle &&
        !openPopup
      ) {
        if (selected.elem === 'cover') {
          const currentIndex = covers.findIndex(
            (cov) => cov.id === selected.id,
          );

          if (currentIndex > -1 && covers[currentIndex + 1]) {
            setSelected({ id: covers[currentIndex + 1].id, elem: 'cover' });
          } else if (groups.length > 0) {
            setSelected({ id: groups[0].id, elem: 'group' });
          }
        } else if (selected.elem === 'group') {
          const currentIndex = groups.findIndex(
            (cov) => cov.id === selected.id,
          );

          if (currentIndex > -1 && groups[currentIndex + 1]) {
            setSelected({ id: groups[currentIndex + 1].id, elem: 'group' });
          } else {
            setSelected(null);
          }
        }
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [
    covers,
    editLines,
    editTitle,
    groups,
    hasMode,
    openPopup,
    selected,
    setSelected,
    undoAction,
  ]);
};
