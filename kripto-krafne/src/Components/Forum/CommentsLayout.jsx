import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const CommentsLayout = ({ com }) => {
    const formatirajDatum = (datumString) => {
        return new Date(datumString).toLocaleDateString('hr-HR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            marginTop: 12
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <MessageSquare size={14} style={{ color: 'white' }} />
                </div>
                <div>
                    {com.user_numeric_id ? (
                        <Link
                            to={`/profile/${com.user_numeric_id}`}
                            style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        >
                            {com.user_name || com.user_id}
                        </Link>
                    ) : (
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{com.user_id || 'Anoniman'}</span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 8 }}>
                        {formatirajDatum(com.created_at)}
                    </span>
                </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                {com.content}
            </p>
        </div>
    );
};

export default CommentsLayout;
