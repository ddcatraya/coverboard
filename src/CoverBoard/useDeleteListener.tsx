import { useCallback, useEffect } from 'react';
import { useUtilsStore, useMainStore } from 'store';

export const useDeleteListener = () => {
  const [selected, setSelected] = useUtilsStore((state) => [
    state.selected,
    state.setSelected,
  ]);

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
      }
    },
    [setSelected],
  );

  useEffect(() => {
    if (!selected) return;

    const deleteFn = (e) => {
      if (e.key === 'Delete') {
        if (selected.elem === 'group') {
          removeGroupAndRelatedLines(selected.id);
        } else if (selected.elem === 'cover') {
          removeCoverAndRelatedLines(selected.id);
        } else if (selected.elem === 'arrow') {
          removeLine(selected.id);
        }
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