import { useEffect, useState } from "react";
import Accordion from "./Accordion";
import useData from "./useData";
import { useParams } from "react-router-dom";
import { Lightbulb } from "lucide-react";

const AccordionSection = () => {
    const { id } = useParams();
    const { getLevelById } = useData();
    const [level, setLevel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        (async () => {
            try {
                const lvl = await getLevelById(id);
                if (mounted) setLevel(lvl);
            } catch (err) {
                console.error("Error loading level in AccordionSection:", err);
                if (mounted) setLevel(null);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id, getLevelById]);

    if (loading) {
        return (
            <div style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Učitavanje zanimljivosti…</p>
            </div>
        );
    }

    if (!level || !level.fun_facts || level.fun_facts.length === 0) return null;

    return (
        <section style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <Lightbulb size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                }}>
                    Zanimljivosti
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {level.fun_facts.map((fact, index) => (
                    <Accordion key={index} title={fact.question} content={fact.answer} />
                ))}
            </div>
        </section>
    );
};

export default AccordionSection;
