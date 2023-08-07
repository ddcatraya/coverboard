import { useCoverContext } from 'contexts';
import { KonvaEventObject } from 'konva/lib/Node';

export const useDragAndDrop = () => {
  const { setCover } = useCoverContext();

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    setCover((currentCover) =>
      currentCover.map((star) => {
        return {
          ...star,
          isDragging: star.id === e.target.id(),
        };
      }),
    );
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setCover((currentCover) =>
      currentCover.map((star) => {
        return star.isDragging
          ? {
              ...star,
              isDragging: false,
              x: e.target.x(),
              y: e.target.y(),
            }
          : star;
      }),
    );
  };

  return { handleDragStart, handleDragEnd };
};
