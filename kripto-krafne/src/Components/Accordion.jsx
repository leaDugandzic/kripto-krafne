import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid',
            borderColor: isOpen ? 'var(--accent)' : 'var(--glass-border)',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease',
            background: 'var(--glass-bg)'
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: isOpen ? 'var(--accent-soft)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s ease',
                    gap: 12
                }}
            >
                <span style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: isOpen ? 'var(--accent)' : 'var(--text-primary)',
                    lineHeight: 1.4,
                    transition: 'color 0.2s ease'
                }}>
                    {title}
                </span>
                <ChevronDown
                    size={18}
                    style={{
                        color: isOpen ? 'var(--accent)' : 'var(--text-muted)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease, color 0.2s ease',
                        flexShrink: 0
                    }}
                />
            </button>

            <div style={{
                maxHeight: isOpen ? 500 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
            }}>
                <div style={{
                    padding: '0 20px 16px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <div style={{ paddingTop: 14 }}>{content}</div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
