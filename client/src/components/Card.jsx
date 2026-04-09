import React from 'react';

const Card = ({ title, subtitle, icon: Icon, image, children, actions, className = '', style = {} }) => {
    return (
        <div className={`card ${className}`} style={style}>
            {image && (
                <div style={{ margin: '-1.5rem -1.5rem 1.5rem -1.5rem', height: '200px', overflow: 'hidden', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
                    <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                {Icon && <div style={{ padding: '0.75rem', background: 'var(--primary)', borderRadius: 'var(--radius-md)', color: 'white' }}><Icon size={24} /></div>}
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
                    {subtitle && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ flex: 1, marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                {children}
            </div>
            {actions && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    {actions}
                </div>
            )}
        </div>
    );
};

export default Card;
