import logo from '../../assets/logoecoscrap.png';
import DiaNoche from '../background/dianoche';

const Navbar = () => {
    return (
        <nav className="glass" style={{
            margin: '20px auto',
            padding: '20px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            position: 'sticky',
            top: '20px',
            zIndex: 1000,
            maxWidth: '1200px'
        }}>
            {/* Logo Centrado y Grande */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
            }}>
                <img
                    src={logo}
                    alt="EcoScrap Logo"
                    style={{
                        height: '200px', // Aumentado significativamente
                        width: 'auto',
                        filter: 'drop-shadow(0 0 15px rgba(0,242,254,0.4))'
                    }}
                />
                <div style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '3px' }}>
                    METAL<span className="gradient-text">CONTROL</span>
                </div>
            </div>

            {/* Enlaces y botones por debajo */}
            <div style={{
                display: 'flex',
                gap: '40px',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px solid var(--glass-border)',
                width: '100%',
                justifyContent: 'center'
            }}>
                <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', fontSize: '1.1rem' }}>Casa</a>
                <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', fontSize: '1.1rem' }}>Mercado</a>
                <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', fontSize: '1.1rem' }}>Sobre</a>
                <div style={{ display: 'flex', gap: '15px', marginLeft: '20px', alignItems: 'center' }}>
                    <DiaNoche />
                    <button className="glass" style={{ padding: '10px 25px', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }} onClick={() => window.dispatchEvent(new CustomEvent('nav-login'))}>Ingresar</button>
                    <button className="glass" style={{ padding: '10px 25px', border: '1px solid var(--secondary)', color: 'var(--secondary)' }} onClick={() => window.dispatchEvent(new CustomEvent('nav-admin-direct'))}>⚙️ Admin</button>
                    <button className="btn-primary" style={{ padding: '10px 25px' }}>Conectar Billetera</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
