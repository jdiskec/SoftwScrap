import React, { useState, useEffect } from 'react';

const Ventas = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        // En una app real, esto vendría de una DB. Aquí simulamos con localStorage
        const savedSales = localStorage.getItem('facturas_emitidas'); // Supongamos que Facturacion las guarda aqui
        if (savedSales) {
            setSales(JSON.parse(savedSales));
        } else {
            setSales([]);
        }
    }, []);

    const exportToExcel = () => {
        const headers = "ID,Cliente,Fecha,Total,Estado\n";
        const rows = sales.map(s => `${s.id},${s.client},${s.date},${s.total},${s.status}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "ventas_ecosrcap.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToXML = () => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<ventas>\n';
        sales.forEach(s => {
            xml += `  <venta>\n    <id>${s.id}</id>\n    <cliente>${s.client}</cliente>\n    <fecha>${s.date}</fecha>\n    <total>${s.total}</total>\n    <estado>${s.status}</estado>\n  </venta>\n`;
        });
        xml += '</ventas>';
        const blob = new Blob([xml], { type: 'text/xml;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "ventas_ecosrcap.xml");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Registro de <span className="gradient-text">Ventas</span></h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={exportToExcel} className="glass" style={{ padding: '10px 15px', border: '1px solid #4ade80', color: '#4ade80' }}>📊 Descargar Excel</button>
                    <button onClick={exportToXML} className="glass" style={{ padding: '10px 15px', border: '1px solid var(--primary)', color: 'var(--primary)' }}>📄 Descargar XML</button>
                </div>
            </div>

            <div className="glass" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
                            <th style={{ padding: '15px' }}>ID Factura</th>
                            <th style={{ padding: '15px' }}>Cliente</th>
                            <th style={{ padding: '15px' }}>Fecha</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>Estado</th>
                            <th style={{ padding: '15px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>#{s.id}</td>
                                <td style={{ padding: '15px' }}>{s.client}</td>
                                <td style={{ padding: '15px' }}>{s.date}</td>
                                <td style={{ padding: '15px', color: '#4ade80' }}>${parseFloat(s.total).toFixed(2)}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '10px', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>{s.status}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Imprimir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ventas;
