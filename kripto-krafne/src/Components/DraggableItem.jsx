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
            style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isDragging ? 'var(--accent)' : 'var(--glass-border)',
                background: isDragging ? 'var(--accent-soft)' : 'var(--glass-bg)',
                color: isDragging ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'grab',
                transform: isDragging ? 'scale(0.96) rotate(-1deg)' : 'scale(1)',
                opacity: isDragging ? 0.7 : 1,
                transition: 'all 0.15s ease',
                boxShadow: isDragging ? 'var(--shadow-glow-soft)' : 'none',
                userSelect: 'none',
                backdropFilter: 'var(--blur-sm)'
            }}
        >
            {item.term}
        </div>
    );
};

export default DraggableItem;
