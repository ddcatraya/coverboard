import { useCallback, useEffect } from 'react';
import { useUtilsStore, useMainStore } from 'store';

export const useDeleteListener = () => {
  const [selected, setSelected] = useUtilsStore((state) => [
    state.selected,
    state.setSelected,
  ]);
  const setPoints = useUtilsStore((state) => state.setPoints);

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const removeLine = useMainStore((state) => state.removeLine);

  const checkDeselect = useCallback(
    (e) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelected(null);
        setPoints(null);
      }
    },
    [setPoints, setSelected],
  );

  useEffect(() => {
    if (!selected) return;

    const deleteFn = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        if (selected.elem === 'group') {
          removeGroupAndRelatedLines(selected.id);
        } else if (selected.elem === 'cover') {
          removeCoverAndRelatedLines(selected.id);
        } else if (selected.elem === 'arrow') {
          removeLine(selected.id);
        }
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', deleteFn);

    return () => document.removeEventListener('keydown', deleteFn);
  }, [
    removeCoverAndRelatedLines,
    removeGroupAndRelatedLines,
    removeLine,
    selected,
  ]);

  return { checkDeselect };
};
