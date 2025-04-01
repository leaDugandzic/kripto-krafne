import { useDrop } from "react-dnd";

const DroppableBox = ({ box, onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "ITEM",
        drop: (item) => onDrop(item, box),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            className={`p-4 border-2 rounded-md m-2 ${isOver ? "bg-purple-300" : "bg-pink-400"}`}
        >
            <p>{box.text}</p>
        </div>
    );
};

export default DroppableBox;
