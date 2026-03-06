import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente FunctionLupa
 * Despliega una lista de clientes o proveedores registrados para autocompletar la factura.
 * 
 * @param {string} tipo - 'venta' (clientes) o 'compra' (proveedores).
 * @param {function} onSelect - Callback que recibe el objeto seleccionado.
 */
const FunctionLupa = ({ tipo, onSelect, icon = "🔍" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const dropdownRef = useRef(null);

    // Cargar datos desde localStorage según el tipo
    useEffect(() => {
        const key = tipo === 'venta' ? 'clientes' : 'proveedores';
        const savedData = JSON.parse(localStorage.getItem(key) || '[]');
        setData(savedData);
    }, [tipo, isOpen]);

    // Cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredData = data.filter(item =>
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.ci || item.ruc || '').includes(searchTerm)
    );

    const handleSelect = (item) => {
        onSelect(item);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="lupa-container" style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="lupa-button glass"
                title="Buscar registrado"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 242, 254, 0.1)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                {icon}
            </button>

            {isOpen && (
                <div
                    className="lupa-dropdown glass"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        width: '350px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        background: 'rgba(15, 20, 30, 0.95)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        zIndex: 1000,
                        marginTop: '10px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Buscar por nombre o CI/RUC..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: '#fff',
                            marginBottom: '15px',
                            outline: 'none'
                        }}
                    />

                    <div className="lupa-list">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    style={{
                                        padding: '12px',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 242, 254, 0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '10px', marginTop: '4px' }}>
                                        <span>🆔 {item.ci || item.ruc}</span>
                                        {item.phone && <span>📞 {item.phone}</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '10px' }}>
                                No se encontraron registros
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FunctionLupa;
