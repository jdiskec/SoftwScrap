import React from 'react';

const PortadaIni = () => {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
        .press-container {
          position: relative;
          width: 400px;
          height: 400px;
          display: flex;
          justify-content: center;
          alignItems: center;
          background: rgba(255,255,255,0.02);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
        }

        /* Hydraulic Pistons */
        .piston {
          position: absolute;
          background: linear-gradient(90deg, #334155, #475569, #334155);
          border: 1px solid #1e293b;
          z-index: 10;
        }

        .piston-main {
          top: 0;
          width: 80px;
          height: 120px;
          animation: hydraulic-down 3s infinite cubic-bezier(0.7, 0, 0.3, 1);
        }

        .piston-head {
          position: absolute;
          bottom: -20px;
          left: -10px;
          width: 100px;
          height: 30px;
          background: #1e293b;
          border: 2px solid var(--primary);
          box-shadow: 0 5px 15px rgba(0, 242, 254, 0.3);
        }

        .side-press {
          position: absolute;
          width: 30px;
          height: 150px;
          background: #334155;
          top: 120px;
        }

        .press-left {
          left: 0;
          animation: hydraulic-right 3s infinite cubic-bezier(0.7, 0, 0.3, 1);
        }

        .press-right {
          right: 0;
          animation: hydraulic-left 3s infinite cubic-bezier(0.7, 0, 0.3, 1);
        }

        .base {
          position: absolute;
          bottom: 20px;
          width: 300px;
          height: 40px;
          background: #0f172a;
          border-top: 4px solid var(--secondary);
        }

        /* The Scrap Cube */
        .metal-cube {
          position: relative;
          width: 140px;
          height: 140px;
          background: #475569;
          display: flex;
          flex-wrap: wrap;
          padding: 8px;
          gap: 4px;
          transition: all 0.2s;
          animation: crush-cube 3s infinite cubic-bezier(0.7, 0, 0.3, 1);
          z-index: 5;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .scrap-shard {
          width: 30%;
          height: 30%;
          background: #94a3b8;
          border-radius: 2px;
          transform: rotate(var(--r));
          box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
        }

        @keyframes hydraulic-down {
          0%, 10% { transform: translateY(0); }
          40%, 60% { transform: translateY(180px); }
          90%, 100% { transform: translateY(0); }
        }

        @keyframes hydraulic-right {
          0%, 10% { transform: translateX(0); }
          40%, 60% { transform: translateX(110px); }
          90%, 100% { transform: translateX(0); }
        }

        @keyframes hydraulic-left {
          0%, 10% { transform: translateX(0); }
          40%, 60% { transform: translateX(-110px); }
          90%, 100% { transform: translateX(0); }
        }

        @keyframes crush-cube {
          0%, 10% { 
            width: 140px; height: 140px; 
            background: #475569;
            transform: scale(1);
          }
          40%, 60% { 
            width: 60px; height: 60px; 
            background: var(--primary);
            box-shadow: 0 0 40px var(--primary);
            transform: scale(0.9) translateY(40px);
          }
          90%, 100% { 
            width: 140px; height: 140px; 
            background: #475569;
            transform: scale(1);
          }
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #fbbf24;
          border-radius: 50%;
          opacity: 0;
          animation: fly 3s infinite;
        }

        @keyframes fly {
          0%, 35% { opacity: 0; transform: translate(0, 0); }
          40% { opacity: 1; transform: translate(var(--mx), var(--my)); }
          45%, 100% { opacity: 0; }
        }
      `}</style>

            <div className="press-container">
                <div className="piston piston-main">
                    <div className="piston-head"></div>
                </div>
                <div className="side-press press-left"></div>
                <div className="side-press press-right"></div>
                <div className="base"></div>

                <div className="metal-cube">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="scrap-shard" style={{ '--r': `${Math.random() * 360}deg` }}></div>
                    ))}
                </div>

                {/* Impact Particles */}
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        '--mx': `${(Math.random() - 0.5) * 300}px`,
                        '--my': `${(Math.random() - 0.5) * 200 - 50}px`,
                        left: '50%',
                        top: '60%',
                        animationDelay: `${Math.random() * 0.1}s`
                    }}></div>
                ))}
            </div>

            <div style={{ marginTop: '40px', zIndex: 20, textAlign: 'center' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', textTransform: 'uppercase' }}>
                    Precision <br /> Compaction
                </h1>
                <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', marginBottom: '40px' }}>MAXIMIZING EFFICIENCY • MINIMIZING VOLUME</p>

                {/* Animated Text Resource */}
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '20px 0',
                    borderTop: '1px solid var(--glass-border)',
                    borderBottom: '1px solid var(--glass-border)',
                    position: 'relative'
                }}>
                    <style>{`
                        @keyframes marquee {
                            0% { transform: translateX(100%); }
                            100% { transform: translateX(-100%); }
                        }
                        .marquee-text {
                            display: inline-block;
                            white-space: nowrap;
                            animation: marquee 20s linear infinite;
                            font-size: 1.1rem;
                            font-weight: 500;
                            color: var(--primary);
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .text-sep {
                            margin: 0 40px;
                            color: var(--text-dim);
                        }
                    `}</style>
                    <div className="marquee-text">
                        <span>Reciclaje de Cobre: Ahorra 85% de energía</span>
                        <span className="text-sep">⚡</span>
                        <span>Transformación de Acero: Infinitamente reciclable</span>
                        <span className="text-sep">♻️</span>
                        <span>Aluminio: Del desecho a la industria en 60 días</span>
                        <span className="text-sep">🏗️</span>
                        <span>Economía Circular: Minería urbana sostenible</span>
                        <span className="text-sep">🌍</span>
                        <span>Recuperación de Fundición: Reduciendo huella de carbono</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortadaIni;
