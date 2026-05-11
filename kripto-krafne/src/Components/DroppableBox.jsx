import { useDrop } from "react-dnd";
import { CheckCircle } from "lucide-react";

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
            style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isMatched
                    ? 'var(--success)'
                    : isOver
                        ? 'var(--accent)'
                        : 'var(--glass-border)',
                background: isMatched
                    ? 'rgba(100,220,150,0.1)'
                    : isOver
                        ? 'var(--accent-soft)'
                        : 'var(--glass-bg)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                backdropFilter: 'var(--blur-sm)',
                borderStyle: isOver && !isMatched ? 'dashed' : 'solid'
            }}
        >
            <p style={{
                fontSize: '0.875rem',
                color: isMatched ? 'var(--success)' : 'var(--text-secondary)',
                fontWeight: isMatched ? 600 : 400,
                lineHeight: 1.5,
                margin: 0,
                flex: 1
            }}>
                {box.text}
            </p>
            {isMatched && (
                <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
            )}
        </div>
    );
};

export default DroppableBox;
