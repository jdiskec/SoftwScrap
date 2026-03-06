import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const Reportes = () => {
    const [stats, setStats] = useState({
        totalVentas: 0,
        totalCompras: 0,
        numVentas: 0,
        numCompras: 0,
        balance: 0,
        stockTotal: 0,
        profitByMetal: {}
    });

    const [monthlyData, setMonthlyData] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [recentPurchases, setRecentPurchases] = useState([]);

    useEffect(() => {
        try {
            const sales = JSON.parse(localStorage.getItem('facturas_emitidas') || '[]');
            const purchases = JSON.parse(localStorage.getItem('compras_realizadas') || '[]');
            const inventory = JSON.parse(localStorage.getItem('inventory_products') || '[]');

            // 1. Estadísticas Generales
            const totalV = sales.reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
            const totalC = purchases.reduce((acc, c) => acc + (parseFloat(c.total) || 0), 0);
            const totalS = inventory.reduce((acc, i) => acc + (parseFloat(i.stock) || 0), 0);

            // 2. Ganancia por Metal
            const metalProfit = {};
            sales.forEach(s => {
                if (s.items) {
                    s.items.forEach(item => {
                        const material = item.material || 'Otro';
                        metalProfit[material] = (metalProfit[material] || 0) + (parseFloat(item.total) || 0);
                    });
                }
            });

            setStats({
                totalVentas: totalV,
                totalCompras: totalC,
                numVentas: sales.length,
                numCompras: purchases.length,
                balance: totalV - totalC,
                stockTotal: totalS,
                profitByMetal: metalProfit
            });

            // 3. Datos para el Gráfico de Líneas (12 meses)
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const chartData = months.map(m => ({ name: m, ventas: 0, compras: 0 }));

            sales.forEach(s => {
                const dateVal = s.fecha || s.date;
                if (dateVal) {
                    const date = new Date(dateVal);
                    if (!isNaN(date.getTime())) chartData[date.getMonth()].ventas += (parseFloat(s.total) || 0);
                }
            });
            purchases.forEach(p => {
                const dateVal = p.fecha || p.date;
                if (dateVal) {
                    const date = new Date(dateVal);
                    if (!isNaN(date.getTime())) chartData[date.getMonth()].compras += (parseFloat(p.total) || 0);
                }
            });
            setMonthlyData(chartData);

            // 4. Datos para el Gráfico Circular
            const sData = inventory.map(item => ({
                name: item.name,
                value: parseFloat(item.stock) || 0
            })).filter(d => d.value > 0);
            setStockData(sData);

            // 5. Últimas Compras y Ventas
            setRecentSales(sales.slice(0, 5));
            setRecentPurchases(purchases.slice(0, 5));
        } catch (e) {
            console.error("Error cargando reportes:", e);
        }
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <h3 style={{ fontSize: '1.8rem' }}>Reporte Avanzado de <span className="gradient-text">Resultados</span></h3>

            {/* Indicadores Principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <StatCard label="Cant. Compras" value={stats.numCompras} icon="📥" color="var(--primary)" />
                <StatCard label="Cant. Ventas" value={stats.numVentas} icon="📤" color="#4ade80" />
                <StatCard label="Stock Total (kg)" value={stats.stockTotal.toFixed(2)} icon="⚖️" color="#fbbf24" />
                <StatCard label="Ganancia Neta" value={`$${stats.balance.toFixed(2)}`} icon="💵" color="#22d3ee" />
            </div>

            {/* Ganancia Detallada por Material */}
            <div className="glass" style={{ padding: '25px' }}>
                <h4 style={{ marginBottom: '20px' }}>📊 Ganancia Detallada por Material</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {Object.entries(stats.profitByMetal).map(([metal, val], idx) => (
                        <div key={idx} className="glass" style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{metal}</div>
                            <div style={{ fontWeight: 'bold', color: COLORS[idx % COLORS.length] }}>${val.toFixed(2)}</div>
                        </div>
                    ))}
                    {Object.keys(stats.profitByMetal).length === 0 && <p style={{ color: 'var(--text-dim)' }}>No hay datos de ventas registrados.</p>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                {/* Gráfico de Líneas - Rendimiento 12 Meses */}
                <div className="glass" style={{ padding: '25px', height: '400px' }}>
                    <h4 style={{ marginBottom: '25px' }}>📈 Rendimiento Anual (Ventas vs Compras)</h4>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                            <Legend />
                            <Line type="monotone" dataKey="ventas" stroke="#4ade80" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Ventas ($)" />
                            <Line type="monotone" dataKey="compras" stroke="#f87171" strokeWidth={3} dot={{ r: 4 }} name="Compras ($)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico Circular - Stock por Material */}
                <div className="glass" style={{ padding: '25px', height: '400px' }}>
                    <h4 style={{ marginBottom: '25px' }}> Distribución de Stock (Peso)</h4>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={stockData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {stockData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tablas de Últimos Movimientos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
                {/* Tabla Últimas Compras */}
                <div className="glass" style={{ padding: '25px' }}>
                    <h4 style={{ marginBottom: '20px', color: '#f87171' }}>📥 Últimas Compras</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                    <th style={{ padding: '12px' }}>Fecha</th>
                                    <th style={{ padding: '12px' }}>Proveedor</th>
                                    <th style={{ padding: '12px' }}>Peso</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPurchases.map((p, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{p.date}</td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{p.supplier}</td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                            {p.items?.reduce((acc, it) => acc + parseFloat(it.quantity || 0), 0).toFixed(2) || '0.00'} kg
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>${parseFloat(p.total).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabla Últimas Ventas */}
                <div className="glass" style={{ padding: '25px' }}>
                    <h4 style={{ marginBottom: '20px', color: '#4ade80' }}>📤 Últimas Ventas</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                    <th style={{ padding: '12px' }}>Fecha</th>
                                    <th style={{ padding: '12px' }}>Cliente</th>
                                    <th style={{ padding: '12px' }}>Material</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.map((s, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{s.date}</td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{s.cliente}</td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                            {s.items?.map(it => it.material).join(', ') || 'Varios'}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4ade80' }}>${parseFloat(s.total).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: `4px solid ${color}` }}>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</div>
        </div>
    </div>
);

export default Reportes;
