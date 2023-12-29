import { useEffect } from 'react';
import { useMainStore, useToolbarStore, useUtilsStore } from 'store';

interface UseEventListener {
  createGroup: () => void;
  takeScreenshot: () => void;
}

export const useKeysListener = ({
  createGroup,
  takeScreenshot,
}: UseEventListener) => {
  const undoAction = useMainStore((state) => state.undoAction);

  const openPopup = useToolbarStore((state) => state.isPopupOpen());

  const setOpenConfig = useToolbarStore((state) => state.setOpenConfig);
  const setOpenSearch = useToolbarStore((state) => state.setOpenSearch);
  const setOpenShare = useToolbarStore((state) => state.setOpenShare);

  const points = useUtilsStore((state) => state.points);
  const selected = useUtilsStore((state) => state.selected);
  const setSelected = useUtilsStore((state) => state.setSelected);
  const hasMode = useUtilsStore((state) => state.hasMode());
  const editTitle = useUtilsStore((state) => state.editTitle);
  const setEditTitle = useUtilsStore((state) => state.setEditTitle);

  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);
  const lines = useMainStore((state) => state.lines);

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const removeLine = useMainStore((state) => state.removeLine);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoAction();
        e.preventDefault();
      } else if (e.key === 'n' && !openPopup && !hasMode) {
        if (covers.length > 0) {
          setSelected({
            id: covers[covers.length - 1].id,
            elem: 'cover',
            open: false,
          });
          e.preventDefault();
        } else if (groups.length > 0) {
          setSelected({
            id: groups[groups.length - 1].id,
            elem: 'group',
            open: false,
          });
          e.preventDefault();
        }
      } else if (!editTitle && !openPopup && selected) {
        if (e.key === 'n') {
          e.preventDefault();
          if (selected.elem === 'cover') {
            const currentIndex = covers.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && covers[currentIndex - 1]) {
              setSelected({
                id: covers[currentIndex - 1].id,
                elem: 'cover',
                open: false,
              });
              e.preventDefault();
            } else if (groups.length > 0) {
              setSelected({
                id: groups[groups.length - 1].id,
                elem: 'group',
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({
                id: covers[covers.length - 1].id,
                elem: 'cover',
                open: false,
              });
              e.preventDefault();
            }
          } else if (selected.elem === 'group') {
            const currentIndex = groups.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && groups[currentIndex - 1]) {
              setSelected({
                id: groups[currentIndex - 1].id,
                elem: 'group',
                open: false,
              });
              e.preventDefault();
            } else if (covers.length > 0) {
              setSelected({
                id: covers[covers.length - 1].id,
                elem: 'cover',
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({
                id: groups[groups.length - 1].id,
                elem: 'group',
                open: false,
              });
              e.preventDefault();
            }
          }
        } else if (e.key === 'p') {
          if (selected.elem === 'cover') {
            const currentIndex = covers.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && covers[currentIndex + 1]) {
              setSelected({
                id: covers[currentIndex + 1].id,
                elem: 'cover',
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({ id: covers[0].id, elem: 'cover', open: false });
              e.preventDefault();
            }
          } else if (selected.elem === 'group') {
            const currentIndex = groups.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && groups[currentIndex + 1]) {
              setSelected({
                id: groups[currentIndex + 1].id,
                elem: 'group',
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({ id: groups[0].id, elem: 'group', open: false });
              e.preventDefault();
            }
          }
        } else if (e.key === 'Delete') {
          if (selected.elem === 'group') {
            removeGroupAndRelatedLines(selected.id);
          } else if (selected.elem === 'cover') {
            removeCoverAndRelatedLines(selected.id);
          } else if (selected.elem === 'arrow') {
            removeLine(selected.id);
          }
          e.preventDefault();
        } else if (e.key === 'Escape') {
          setSelected(null);
          e.preventDefault();
        } else if (e.key === 'Enter') {
          setSelected({ id: selected.id, elem: selected.elem, open: true });
          e.preventDefault();
        }
      } else if (!hasMode && !openPopup) {
        if (e.key === 'a') {
          setOpenSearch(true);
          e.preventDefault();
        } else if (e.key === 'o') {
          setOpenConfig(true);
          e.preventDefault();
        } else if (e.key === 's') {
          setOpenShare(true);
          e.preventDefault();
        } else if (e.key === 'g') {
          createGroup();
          e.preventDefault();
        } else if (e.key === 'c') {
          takeScreenshot();
          e.preventDefault();
        } else if (e.key === 'u') {
          undoAction();
          e.preventDefault();
        } else if (e.key === 'e') {
          setEditTitle(true);
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [
    covers,
    createGroup,
    editTitle,
    groups,
    hasMode,
    lines,
    openPopup,
    points,
    removeCoverAndRelatedLines,
    removeGroupAndRelatedLines,
    removeLine,
    selected,
    setEditTitle,
    setOpenConfig,
    setOpenSearch,
    setOpenShare,
    setSelected,
    takeScreenshot,
    undoAction,
  ]);
};
