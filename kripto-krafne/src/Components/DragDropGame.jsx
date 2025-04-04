import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableItem from "./DraggableItem";
import DroppableBox from "./DroppableBox";
import { useNavigate } from "react-router-dom";

const DragDropGame = ({ gameData, currentLevelId }) => {
    const [items, setItems] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [matchedItems, setMatchedItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (gameData) {
            setItems(gameData);
            setBoxes(gameData.map(item => ({ id: item.id, text: item.description })));
        } else {
            console.error("gameData is undefined or empty");
        }
    }, [gameData]);

    useEffect(() => {
        if (items.length > 0 && matchedItems.length === items.length) {
            navigate(`/donut-level/${currentLevelId}`);
        }
    }, [matchedItems, items.length, navigate, currentLevelId]);

    const handleDrop = (item, box) => {
        if (item.description === box.text) {
            setMatchedItems((prev) => [...prev, item.id]);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col items-center p-4">
                <h2 className="text-xl font-bold mb-4 text-pink-600">Povuci pojmove do ispravnih tvrdnji</h2>
                <div className="flex gap-6">
                    <div className="w-1/3 bg-pink-100 p-4 rounded-md">
                        {items.map(
                            (item) =>
                                !matchedItems.includes(item.id) && (
                                    <DraggableItem key={item.id} item={item} />
                                )
                        )}
                    </div>
                    <div className="w-2/3 bg-pink-200 p-4 rounded-md">
                        {boxes.map((box) => (
                            <DroppableBox key={box.id} box={box} onDrop={handleDrop} />
                        ))}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default DragDropGame;
