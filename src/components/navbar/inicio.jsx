import React from 'react';
import Navbar from './Navbar';
import Background from '../background/background';
import PortadaIni from '../background/portadaini';
import InventoryPanel from '../funciones/InventoryPanel';
import FeatureCard from '../funciones/FeatureCard';
import videoBackground from '../../assets/PixVerse_V5.6_Image_Text_360P_una_procesadora_.mp4';
import '../background/filtrovideoini.css';
import medusawareLogo from '../../assets/medusaware.png';
import medusacontaLogo from '../../assets/medusaconta.png';

// Import Financial Logos
import alipayLogo from '../../assets/alipay.png';
import bancoAustroLogo from '../../assets/bancoaustro .png';
import bancoGuayaquilLogo from '../../assets/bancoguaya.png';
import bancoPacificoLogo from '../../assets/bancopacifico.png';
import bancoPichinchaLogo from '../../assets/bancopichincha.png';
import deunaLogo from '../../assets/deuna.png';
import imagesLogo from '../../assets/images.png';
import peigoLogo from '../../assets/peigo.png';
import visaLogo from '../../assets/VISA.png';



const Inicio = () => {
    return (
        <div className="inicio-page">
            <Background>
                <Navbar />
                <main>
                    {/* Cover Section with Video Background */}
                    <section id="hero-cover" className="hero-video-section">
                        <div className="video-background-container">
                            <video autoPlay loop muted playsInline>
                                <source src={videoBackground} type="video/mp4" />
                            </video>
                            <div className="video-overlay"></div>
                        </div>

                        <div className="hero-video-content">
                            <h1 className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1' }}>
                                Industrial <br /> Recycling
                            </h1>
                            <p style={{ color: 'var(--text-dim)', letterSpacing: '4px', marginBottom: '40px', fontSize: '1.2rem' }}>
                                PRECISION PROCESSING • SUSTAINABLE FUTURE
                            </p>

                            <div style={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)',
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
                                        animation: marquee 25s linear infinite;
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
                                    <span className="text-sep">🌍</span>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Environmental Awareness Section */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '100px 20px',
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)'
                    }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                                <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px' }}>
                                    Conciencia <span className="gradient-text">Ambiental</span>
                                </h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                                    El reciclaje industrial no es solo un negocio, es el pilar fundamental para detener la sobreexplotación de recursos naturales y reducir la huella de carbono global.
                                </p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                gap: '40px'
                            }}>
                                <div className="glass" style={{ padding: '40px', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌿</div>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Preservación de Ecosistemas</h3>
                                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>
                                        Cada tonelada de metal reciclado evita la extracción de varias toneladas de mineral virgen. Esto significa menos deforestación, menos erosión del suelo y la protección de hábitats críticos en todo el mundo.
                                    </p>
                                </div>

                                <div className="glass" style={{ padding: '40px', borderLeft: '4px solid var(--secondary)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡</div>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Eficiencia Energética</h3>
                                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>
                                        Refinar metales a partir de chatarra consume hasta un <strong>95% menos de energía</strong> que producirlos desde cero. Esta reducción masiva impacta directamente en la demanda global de combustibles fósiles.
                                    </p>
                                </div>

                                <div className="glass" style={{ padding: '40px', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌎</div>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Reducción de CO2</h3>
                                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>
                                        La industria del reciclaje es clave para alcanzar las metas del Acuerdo de París. Al reciclar con EcoScrap, estás participando activamente en la descarbonización de la cadena de suministro industrial.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Synoptic Chart Section */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '80px 20px',
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '2.8rem', fontWeight: '800' }}>
                                    Estructura de <span className="gradient-text">Clasificación</span>
                                </h2>
                                <p style={{ color: 'var(--text-dim)' }}>Jerarquía industrial del procesamiento de metales</p>
                            </div>

                            <div className="synoptic-container" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '40px',
                                position: 'relative'
                            }}>
                                <style>{`
                                    .synoptic-node {
                                        padding: 20px 40px;
                                        background: rgba(255,255,255,0.05);
                                        border: 1px solid var(--glass-border);
                                        border-radius: 12px;
                                        font-weight: 700;
                                        text-transform: uppercase;
                                        letter-spacing: 1px;
                                        position: relative;
                                        z-index: 2;
                                        text-align: center;
                                        min-width: 200px;
                                    }
                                    .synoptic-node.root {
                                        background: var(--primary);
                                        color: #000;
                                        box-shadow: 0 0 30px rgba(0, 242, 254, 0.4);
                                    }
                                    .synoptic-branch {
                                        display: flex;
                                        justify-content: center;
                                        gap: 150px;
                                        width: 100%;
                                        position: relative;
                                    }
                                    .synoptic-branch::before {
                                        content: '';
                                        position: absolute;
                                        top: -20px;
                                        left: 50%;
                                        width: 2px;
                                        height: 20px;
                                        background: var(--glass-border);
                                    }
                                    .line-horizontal {
                                        position: absolute;
                                        top: -20px;
                                        left: calc(50% - 175px);
                                        width: 350px;
                                        height: 2px;
                                        background: var(--glass-border);
                                    }
                                    .sub-branch {
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                        gap: 20px;
                                    }
                                    .leaf-container {
                                        display: grid;
                                        grid-template-columns: repeat(2, 1fr);
                                        gap: 15px;
                                        margin-top: 15px;
                                    }
                                    .leaf-node {
                                        padding: 10px 20px;
                                        font-size: 0.85rem;
                                        background: rgba(255,255,255,0.03);
                                        border: 1px dashed var(--glass-border);
                                        border-radius: 8px;
                                        color: var(--text-dim);
                                    }
                                `}</style>

                                {/* Nivel 1: Root */}
                                <div className="synoptic-node root">Reciclaje de Metales</div>

                                <div style={{ width: '2px', background: 'var(--glass-border)', height: '40px' }}></div>

                                {/* Nivel 2 & 3 */}
                                <div className="synoptic-branch">
                                    <div className="line-horizontal"></div>

                                    {/* Rama Metales Ferrosos */}
                                    <div className="sub-branch">
                                        <div className="synoptic-node">Metales Ferrosos</div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '5px' }}>Contienen Hierro</p>
                                        <div className="leaf-container">
                                            <div className="leaf-node">Acero Estructural</div>
                                            <div className="leaf-node">Hierro Fundido</div>
                                            <div className="leaf-node">Chatarra de Autos</div>
                                            <div className="leaf-node">Vigas y Varillas</div>
                                        </div>
                                    </div>

                                    {/* Rama Metales No Ferrosos */}
                                    <div className="sub-branch">
                                        <div className="synoptic-node">Metales No Ferrosos</div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '5px' }}>Sin contenido de Hierro</p>
                                        <div className="leaf-container">
                                            <div className="leaf-node">Cobre Milberry</div>
                                            <div className="leaf-node">Aluminio de Perfil</div>
                                            <div className="leaf-node">Bronce y Latón</div>
                                            <div className="leaf-node">Acero Inoxidable</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Business Content */}
                    <section style={{ position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
                        <InventoryPanel />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '30px',
                            flexWrap: 'wrap',
                            padding: '40px 20px'
                        }}>
                            <FeatureCard
                                title="Industrial Compaction"
                                description="High-density metal baling for efficient logistics and better pricing."
                                icon="🏗️"
                            />
                            <FeatureCard
                                title="Material Analysis"
                                description="Expert grading of ferrous and non-ferrous alloys using XRF technology."
                                icon="🔬"
                            />
                            <FeatureCard
                                title="Bulk Trading"
                                description="Global shipping capabilities for multi-ton metal exports."
                                icon="🚢"
                            />
                        </div>
                    </section>

                    {/* Cuenca Recycling Information Section */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '60px 20px',
                        marginTop: '40px',
                        borderTop: '1px solid var(--glass-border)'
                    }}>
                        <div className="glass" style={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <h2 style={{ fontSize: '2.5rem' }}>Cuenca: <span className="gradient-text">Líder en Reciclaje</span></h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
                                <div style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                    <p>
                                        La ciudad de <strong>Cuenca</strong> se ha consolidado como el referente máximo de gestión de residuos en Ecuador.
                                        A través de la Empresa Pública Municipal de Aseo de Cuenca (<strong>EMAC EP</strong>), la ciudad procesa
                                        toneladas de materiales diariamente, integrando a recicladores de base y tecnología de punta.
                                    </p>
                                    <p style={{ marginTop: '15px' }}>
                                        En el sector de los metales, Cuenca aporta significativamente a la economía circular del país,
                                        siendo un punto estratégico para la recolección y transformación de chatarra industrial y doméstica.
                                    </p>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '20px'
                                }}>
                                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>+500t</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Residuos diarios</div>
                                    </div>
                                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>95%</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Cobertura urbana</div>
                                    </div>
                                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>#1</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Ranking Nacional</div>
                                    </div>
                                    <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>20+</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Centros Acopio</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Metals Brochure Section */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '80px 20px',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>Guía de <span className="gradient-text">Metales Reciclables</span></h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Información esencial para una recolección inteligente y sostenible.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                                {/* Cobre */}
                                <div className="glass" style={{ padding: '40px', borderTop: '4px solid #b87333' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧱</div>
                                    <h3 style={{ fontSize: '1.8rem', color: '#b87333', marginBottom: '15px' }}>Cobre (Copper)</h3>
                                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                        El "oro rojo" del reciclaje. Es uno de los metales más valiosos.
                                        Se encuentra en cables eléctricos, tuberías y motores.
                                        <br /><br />
                                        <strong>Beneficio:</strong> Reciclarlo ahorra el 85% de la energía comparado con la minería tradicional.
                                    </p>
                                </div>

                                {/* Aluminio */}
                                <div className="glass" style={{ padding: '40px', borderTop: '4px solid #c0c0c0' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🥫</div>
                                    <h3 style={{ fontSize: '1.8rem', color: '#c0c0c0', marginBottom: '15px' }}>Aluminio</h3>
                                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                        Ligero y 100% reciclable sin perder calidad. Abundante en latas de bebidas,
                                        marcos de ventadas y piezas de motores.
                                        <br /><br />
                                        <strong>Dato:</strong> Una lata reciclada puede volver a los estantes en menos de 60 días.
                                    </p>
                                </div>

                                {/* Bronce/Latón */}
                                <div className="glass" style={{ padding: '40px', borderTop: '4px solid #e1c16e' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎺</div>
                                    <h3 style={{ fontSize: '1.8rem', color: '#e1c16e', marginBottom: '15px' }}>Bronce y Latón</h3>
                                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                        Aleaciones de gran valor estético e industrial. Se encuentran en
                                        grifos, válvulas industriales y ornamentos.
                                        <br /><br />
                                        <strong>Valor:</strong> Son muy cotizados por su resistencia a la corrosión y conductividad.
                                    </p>
                                </div>

                                {/* Acero/Hierro */}
                                <div className="glass" style={{ padding: '40px', borderTop: '4px solid #71797e' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏗️</div>
                                    <h3 style={{ fontSize: '1.8rem', color: '#71797e', marginBottom: '15px' }}>Acero y Hierro</h3>
                                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                        Los metales más reciclados del planeta. Pilares de la industria
                                        automotriz y de la construcción.
                                        <br /><br />
                                        <strong>Impacto:</strong> El reciclaje de acero es el motor que mantiene viva la minería urbana global.
                                    </p>
                                </div>
                            </div>

                            <div className="glass" style={{ marginTop: '50px', padding: '40px', textAlign: 'center', background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,242,254,0.05))' }}>
                                <h4 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>¿Sabías que los metales se pueden reciclar infinitamente?</h4>
                                <p style={{ color: 'var(--text-dim)', maxWidth: '800px', margin: '0 auto' }}>
                                    A diferencia del plástico o el papel, los metales no pierden sus propiedades químicas durante el proceso de fundición.
                                    Esto los convierte en el recurso más valioso para la economía circular. En <strong>EcoScrap</strong>, aseguramos
                                    que cada gramo de metal sea reintegrado a la cadena de valor con la máxima eficiencia.
                                </p>
                            </div>
                        </div>
                    </section>
                    {/* Our Process Section */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '100px 20px',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '60px' }}>Nuestro <span className="gradient-text">Proceso Industrial</span></h2>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px',
                            flexWrap: 'wrap',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {[
                                { step: '01', title: 'Recepción', desc: 'Recibimos materiales de industrias y recolectores locales en nuestros centros de acopio.' },
                                { step: '02', title: 'Clasificación', desc: 'Análisis preciso de aleaciones mediante tecnología XRF para asegurar la máxima pureza.' },
                                { step: '03', title: 'Compactación', desc: 'Procesamiento hidráulico de alta densidad para optimizar el transporte y fundición.' },
                                { step: '04', title: 'Distribución', desc: 'Envío directo a fundidoras globales para su reintegración en el ciclo productivo.' }
                            ].map((item, idx) => (
                                <div key={idx} className="glass" style={{
                                    padding: '40px',
                                    width: '240px',
                                    textAlign: 'left',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        fontSize: '4rem',
                                        fontWeight: '900',
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        opacity: '0.05',
                                        color: 'var(--primary)'
                                    }}>{item.step}</div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--primary)' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Final Sustainable Impact Section */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '80px 20px',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,242,254,0.05))',
                        textAlign: 'center'
                    }}>
                        <div className="glass" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Impacto Ambiental <span className="gradient-text">Real</span></h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 50px' }}>
                                Al elegir el reciclaje industrial de EcoScrap, contribuyes directamente a metas globales de sostenibilidad.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📉</div>
                                    <h4 style={{ fontSize: '1.8rem', fontWeight: '700' }}>-95%</h4>
                                    <p style={{ color: 'var(--text-dim)' }}>Emisiones de CO2 en aluminio</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💧</div>
                                    <h4 style={{ fontSize: '1.8rem', fontWeight: '700' }}>-80%</h4>
                                    <p style={{ color: 'var(--text-dim)' }}>Ahorro de agua en acero</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌲</div>
                                    <h4 style={{ fontSize: '1.8rem', fontWeight: '700' }}>+1M</h4>
                                    <p style={{ color: 'var(--text-dim)' }}>Toneladas desviadas de vertederos</p>
                                </div>
                            </div>

                            <button className="btn-primary" style={{ marginTop: '60px', padding: '15px 40px', fontSize: '1.1rem' }}>
                                Comienza a Reciclar Hoy
                            </button>
                        </div>
                    </section>

                    {/* Financial Entities Section */}
                    <section style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '60px 20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderTop: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                fontWeight: '700',
                                marginBottom: '40px',
                                color: 'var(--text-dim)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}>
                                Entidades Financieras <span className="gradient-text">Aliadas</span>
                            </h3>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '50px',
                                opacity: '0.7',
                                filter: 'grayscale(1) brightness(1.5)',
                                transition: 'all 0.5s ease'
                            }} className="financial-logos">
                                <style>{`
                                    .financial-logos img {
                                        height: 35px;
                                        width: auto;
                                        transition: all 0.3s ease;
                                    }
                                    .financial-logos img:hover {
                                        filter: grayscale(0) brightness(1);
                                        transform: scale(1.1);
                                        opacity: 1;
                                    }
                                `}</style>
                                <img src={visaLogo} alt="Visa" style={{ height: '25px' }} />
                                <img src={bancoPichinchaLogo} alt="Banco Pichincha" />
                                <img src={bancoPacificoLogo} alt="Banco Pacifico" />
                                <img src={bancoGuayaquilLogo} alt="Banco Guayaquil" />
                                <img src={bancoAustroLogo} alt="Banco del Austro" />
                                <img src={deunaLogo} alt="De Una" />
                                <img src={peigoLogo} alt="Peigo" />
                                <img src={alipayLogo} alt="Alipay" />
                                <img src={imagesLogo} alt="Interdin" />
                            </div>
                        </div>
                    </section>

                    {/* Footer Completo */}
                    <footer style={{
                        padding: '80px 20px 40px',
                        background: 'rgba(0,0,0,0.3)',
                        borderTop: '1px solid var(--glass-border)',
                        marginTop: '100px',
                        color: 'var(--text-dim)'
                    }}>
                        <div style={{
                            maxWidth: '1200px',
                            margin: '0 auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '40px',
                            marginBottom: '60px'
                        }}>
                            {/* Social Media Column */}
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '20px', fontWeight: '700' }}>Social</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>X</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>YouTube</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
                                </div>
                            </div>

                            {/* Company Column */}
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '20px', fontWeight: '700' }}>Company</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Jobs</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Legal</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie settings</a>
                                </div>
                            </div>

                            {/* Compare Column */}
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '20px', fontWeight: '700' }}>Compare</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Prismic vs Storyblok</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Prismic vs Contentful</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Prismic vs Webflow</a>
                                </div>
                            </div>

                            {/* Product Column */}
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '20px', fontWeight: '700' }}>Product</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Slice Machine</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Page Builder</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Showcase</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Reviews</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Updates</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Status</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Join our research panel</a>
                                </div>
                            </div>

                            {/* Frameworks Column */}
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '20px', fontWeight: '700' }}>Frameworks</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Next.js CMS</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Nuxt CMS</a>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>SvelteKit CMS</a>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            paddingTop: '40px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '30px',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Made By</span>
                                    <img src={medusawareLogo} alt="MEDUSAWARE" style={{ height: '80px', filter: 'brightness(1.2)' }} />
                                </div>
                                <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tecnología</span>
                                    <img src={medusacontaLogo} alt="Medusaconta" style={{ height: '80px', filter: 'brightness(1.2)' }} />
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>© 2026 EcoScrap Industrial. All rights reserved.</p>
                        </div>

                    </footer>
                </main>
            </Background>
        </div>
    );
};

export default Inicio;
