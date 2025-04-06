import { useDrop } from "react-dnd";

const DroppableBox = ({ box, onDrop, isMatched }) => {
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
            className={`
                p-4 rounded-lg transition-all duration-150
                ${isMatched ? 
                    'bg-green-200 border-2 border-green-500' : 
                    isOver ? 
                        'bg-pink-200 border-2 border-dashed border-pink-500' : 
                        'bg-white border-2 border-pink-400'}
            `}
        >
            <p className={`font-medium ${isMatched ? 'text-green-800 font-bold' : 'text-gray-800'}`}>
                {box.text}
            </p>
            {isMatched && (
                <div className="text-green-600 font-bold text-right mt-1">✓ TOČNO!</div>
            )}
        </div>
    );
};

export default DroppableBox;