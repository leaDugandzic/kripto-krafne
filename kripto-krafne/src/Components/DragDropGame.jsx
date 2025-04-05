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
            setBoxes(gameData.map(item => ({ 
                id: item.id, 
                text: item.description,
                matched: false
            })));
        }
    }, [gameData]);

    useEffect(() => {
        if (items.length > 0 && matchedItems.length === items.length) {
            setTimeout(() => navigate(`/donut-level/${currentLevelId}`), 800);
        }
    }, [matchedItems]);

    const handleDrop = (item, box) => {
        if (item.description === box.text) {
            setMatchedItems((prev) => [...prev, item.id]);
            setBoxes(prev => prev.map(b => 
                b.id === box.id ? {...b, matched: true} : b
            ));
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-pink-600 text-center">
                        Povuci pojmove do ispravnih tvrdnji
                        <div className="w-32 h-1 bg-pink-500 mx-auto mt-3"></div>
                    </h2>
                    
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Draggable Items */}
                        <div className="lg:w-2/5 p-5 rounded-xl bg-pink-50 border-2 border-pink-200">
                            <h3 className="text-xl font-bold text-pink-600 mb-4">POJMOVI</h3>
                            <div className="grid grid-cols-1 gap-3 min-h-[300px]">
                                {items.map(item => !matchedItems.includes(item.id) && (
                                    <DraggableItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                        
                        {/* Droppable Boxes */}
                        <div className="lg:w-3/5 p-5 rounded-xl bg-pink-50 border-2 border-pink-200">
                            <h3 className="text-xl font-bold text-pink-600 mb-4">TVRDNJE</h3>
                            <div className="grid grid-cols-1 gap-4 min-h-[300px]">
                                {boxes.map(box => (
                                    <DroppableBox 
                                        key={box.id} 
                                        box={box} 
                                        onDrop={handleDrop}
                                        isMatched={box.matched}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {matchedItems.length === items.length && items.length > 0 && (
                        <div className="mt-6 p-4 bg-green-200 border-2 border-green-400 rounded-lg text-center">
                            <p className="text-green-800 font-bold">✓ BRAVO! SVE TOČNO!</p>
                        </div>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default DragDropGame;