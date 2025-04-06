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
            className={`
                p-4 font-bold rounded-lg cursor-grab active:cursor-grabbing
                transition-all duration-150
                ${isDragging ? 
                    'bg-pink-500 text-white shadow-xl scale-95' : 
                    'bg-white text-pink-600 border-2 border-pink-400 hover:bg-pink-500 hover:text-white shadow-md'}
            `}
        >
            {item.term}
        </div>
    );
};

export default DraggableItem;