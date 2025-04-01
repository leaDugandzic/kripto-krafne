import { useDrag } from "react-dnd";

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="p-2 border bg-pink-400 cursor-pointer rounded-md m-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {item.term}
    </div>
  );
};

export default DraggableItem;
