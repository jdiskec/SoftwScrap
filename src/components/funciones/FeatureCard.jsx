import React from 'react';

const FeatureCard = ({ title, description, icon }) => {
    return (
        <div className="glass" style={{
            padding: '30px',
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: 'left',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{
                fontSize: '2rem',
                background: 'rgba(0, 242, 254, 0.1)',
                width: '60px',
                height: '60px',
                borderRadius: '15px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{description}</p>
        </div>
    );
};

export default FeatureCard;
