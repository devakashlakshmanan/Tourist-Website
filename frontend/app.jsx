const { useState, useEffect, useRef } = React;

// --- App Entry ---
const App = () => {
    const [view, setView] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [initialAiMessage, setInitialAiMessage] = useState(null);
    const [mapTarget, setMapTarget] = useState(null);
    const [activeUser, setActiveUser] = useState('Traveler');

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            setIsLoggedIn(true);
            const savedUsr = localStorage.getItem('username');
            if (savedUsr) setActiveUser(savedUsr);
        }
    }, []);

    const login = (usernameParam) => {
        setIsLoggedIn(true);
        setActiveUser(usernameParam || 'Traveler');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', usernameParam || 'Traveler');
        setView('destinations');
    };
    const logout = () => { setIsLoggedIn(false); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('username'); setView('login'); };
    const askAi = (msg) => { setInitialAiMessage(msg); setView('ai'); };
    const openMap = (dest) => { setMapTarget(dest); setView('maps'); };

    if (!isLoggedIn || view === 'login') return <Login onLogin={login} />;

    return (
        <div className="app-layout">
            <Sidebar view={view} setView={setView} onLogout={logout} />
            <main className="main-content">
                <header className="top-header">
                    <h1>{view === 'ai' ? 'Tourist AI' : view.charAt(0).toUpperCase() + view.slice(1)}</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '20px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <span className="material-icons-round" style={{ fontSize: '1.2rem', color: '#10b981' }}>account_circle</span>
                            {activeUser}
                        </div>
                        <button className="btn-primary" style={{ background: 'var(--danger)' }} onClick={() => setView('safety')}><span className="material-icons-round">emergency</span> SOS</button>
                    </div>
                </header>
                <div className="page-content">
                    {view === 'destinations' && <Destinations onAskAi={askAi} onOpenMap={openMap} />}
                    {view === 'overview' && <Overview />}
                    {view === 'ai' && <AIGuide initMsg={initialAiMessage} clearMsg={() => setInitialAiMessage(null)} />}
                    {view === 'planner' && <TripPlanner />}
                    {view === 'visa' && <VisaInfo />}
                    {view === 'weather' && <Weather />}
                    {view === 'festivals' && <Festivals />}
                    {view === 'community' && <Community />}
                    {view === 'safety' && <Safety />}
                    {view === 'food' && <FoodGuide />}
                    {view === 'transport' && <TransportGuide />}
                    {view === 'currency' && <CurrencyConverter />}
                    {view === 'maps' && <TouristMap targetDest={mapTarget} />}
                </div>
            </main>
        </div>
    );
};

const GoogleAuthPopup = ({ onSelect, onClose }) => {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(2px)' }}>
            <div style={{ background: 'white', width: '400px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ padding: '2rem 2rem 1rem', textAlign: 'center' }}>
                    <svg viewBox="0 0 48 48" width="40px" height="40px" style={{ margin: '0 auto 1rem' }}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#202124', marginBottom: '0.5rem' }}>Sign in with Google</h2>
                    <p style={{ color: '#5f6368', fontSize: '0.9rem' }}>Choose an account to continue to Tourist Companion</p>
                </div>
                <div style={{ borderTop: '1px solid #dadce0', borderBottom: '1px solid #dadce0', padding: '0.5rem 0' }}>
                    <div style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => onSelect('Alex Traveler')}>
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1.2rem' }}>A</div>
                        <div style={{ textAlign: 'left' }}><div style={{ fontWeight: '500', color: '#3c4043', fontSize: '0.95rem' }}>Alex Traveler</div><div style={{ color: '#5f6368', fontSize: '0.8rem' }}>alex.explorer@gmail.com</div></div>
                    </div>
                    <div style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => onSelect('Jane Doe')}>
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#b91c1c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1.2rem' }}>J</div>
                        <div style={{ textAlign: 'left' }}><div style={{ fontWeight: '500', color: '#3c4043', fontSize: '0.95rem' }}>Jane Doe</div><div style={{ color: '#5f6368', fontSize: '0.8rem' }}>jane.doe@gmail.com</div></div>
                    </div>
                </div>
                <div style={{ padding: '1rem 2rem', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: '500', cursor: 'pointer', padding: '0.5rem 1rem' }} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Strict credential validation logic
        if (email === 'traveler@example.com' && password === '123456') {
            onLogin('Traveler');
        } else if (email === 'admin@example.com' && password === 'admin') {
            onLogin('Admin');
        } else {
            setError('Invalid credentials. Hint: Try traveler@example.com / 123456');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(79, 70, 229, 0.8)), url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80") center/cover no-repeat', alignItems: 'center', justifyContent: 'center' }}>
            {showGoogleAuth && <GoogleAuthPopup onSelect={(usr) => onLogin(usr)} onClose={() => setShowGoogleAuth(false)} />}
            <div style={{ background: 'white', padding: '3rem', borderRadius: '1.5rem', width: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--sidebar-bg) 0%, var(--primary) 100%)', color: 'white', width: '70px', height: '70px', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 15px -3px rgba(79,70,229,0.3)' }}>
                    <span className="material-icons-round" style={{ fontSize: '2.5rem' }}>flight_takeoff</span>
                </div>
                <h1 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: 'var(--text-primary)' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter your credentials to access the portal</p>

                {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.8rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '500' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email or Username</label>
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', outline: 'none' }} placeholder="traveler@example.com" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', outline: 'none' }} placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', fontSize: '1rem' }}>Secure Login</button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                </div>

                <button type="button" className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '0.9rem', fontSize: '0.95rem' }} onClick={() => setShowGoogleAuth(true)}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

const Sidebar = ({ view, setView, onLogout }) => {
    const sections = [
        { title: 'MAIN', links: [{ id: 'destinations', i: 'map', l: 'Explore' }, { id: 'overview', i: 'dashboard', l: 'Dashboard' }, { id: 'ai', i: 'smart_toy', l: 'AI Assistant' }, { id: 'planner', i: 'route', l: 'Trip Planner' }, { id: 'visa', i: 'fact_check', l: 'Visa Info' }, { id: 'maps', i: 'navigation', l: 'Live Maps' }] },
        { title: 'DISCOVER', links: [{ id: 'weather', i: 'cloud', l: 'Weather' }, { id: 'festivals', i: 'celebration', l: 'Festivals' }, { id: 'community', i: 'groups', l: 'Community Forum' }, { id: 'safety', i: 'health_and_safety', l: 'Safety & SOS' }] },
        { title: 'BONUS TOOLS', links: [{ id: 'food', i: 'restaurant', l: 'Food Guide' }, { id: 'transport', i: 'directions_bus', l: 'Transport' }, { id: 'currency', i: 'currency_exchange', l: 'Currency' }] }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header"><div className="sidebar-logo"><span className="material-icons-round">explore</span></div><div><h2 style={{ fontSize: '1.1rem' }}>TravelIndia</h2><p style={{ fontSize: '0.7rem', color: 'gray' }}>Professional Edition</p></div></div>
            {sections.map(s => (
                <div key={s.title} style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <div className="sidebar-section-title">{s.title}</div>
                    {s.links.map(l => <a key={l.id} className={`nav-link ${view === l.id ? 'active' : ''}`} onClick={() => setView(l.id)}><span className="material-icons-round">{l.i}</span> {l.l}</a>)}
                </div>
            ))}
            <a className="nav-link" onClick={onLogout} style={{ color: 'var(--danger)', marginTop: 'auto', padding: '2rem' }}><span className="material-icons-round">logout</span> Disconnect</a>
        </aside>
    );
};

// --- 1. DESTINATIONS ---
const Destinations = ({ onAskAi, onOpenMap }) => {
    const [dests, setDests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ q: '', b: 'All', s: 'All', t: 'All' });
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => { fetch('http://localhost:5000/api/destinations').then(r => r.json()).then(d => { setDests(d); setLoading(false); }); }, []);

    const filtered = dests.filter(d =>
        (filters.b === 'All' || d.budget_est === filters.b) &&
        (filters.s === 'All' || d.season === filters.s) &&
        (filters.t === 'All' || d.type === filters.t) &&
        (d.name.toLowerCase().includes(filters.q.toLowerCase()) || d.location.toLowerCase().includes(filters.q.toLowerCase()))
    );

    const paginated = filtered.slice((page - 1) * 12, page * 12);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading robust destination matrix...</div>;

    return (
        <div>
            <div className="filter-dashboard">
                <div className="search-wrapper">
                    <span className="material-icons-round">search</span>
                    <input type="text" placeholder="Search by Monument, City, or Category..." value={filters.q} onChange={e => { setFilters({ ...filters, q: e.target.value }); setPage(1); }} />
                </div>
                <div className="filter-controls">
                    <div className="filter-block"><h4>Category</h4><div className="chip-row">{['All', 'Heritage', 'Nature', 'Spiritual', 'Adventure'].map(t => <button key={t} className={`chip ${filters.t === t ? 'active' : ''}`} onClick={() => { setFilters({ ...filters, t }); setPage(1); }}>{t}</button>)}</div></div>
                    <div className="filter-block"><h4>Budget Level</h4><div className="chip-row">{['All', 'Budget', 'Mid-range', 'Luxury'].map(b => <button key={b} className={`chip ${filters.b === b ? 'active' : ''}`} onClick={() => { setFilters({ ...filters, b }); setPage(1); }}>{b}</button>)}</div></div>
                    <div className="filter-block"><h4>Season</h4><div className="chip-row">{['All', 'Summer', 'Winter', 'Monsoon', 'All-Year'].map(s => <button key={s} className={`chip ${filters.s === s ? 'active' : ''}`} onClick={() => { setFilters({ ...filters, s }); setPage(1); }}>{s}</button>)}</div></div>
                </div>
            </div>

            <div className="cards-grid">
                {paginated.map(d => (
                    <div key={d.id} className="destination-card" onClick={() => setSelected(d)}>
                        <div className="dest-image-placeholder" style={{ background: `linear-gradient(135deg, hsl(${(d.id * 137) % 360}, 85%, 60%), hsl(${(d.id * 137 + 45) % 360}, 90%, 50%))` }}>
                            {d.trending && <div className="dest-badge-top"><span className="material-icons-round" style={{ fontSize: '1rem', color: '#f97316' }}>local_fire_department</span> Trending</div>}
                            {d.hidden_gem && <div className="dest-badge-top" style={{ color: '#059669' }}><span className="material-icons-round" style={{ fontSize: '1rem' }}>diamond</span> Hidden Gem</div>}
                            <span className="material-icons-round" style={{ fontSize: '4rem', color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>{d.icon}</span>
                        </div>
                        <div className="dest-content">
                            <h3 className="dest-title">{d.name}</h3>
                            <p className="dest-desc">{d.description}</p>
                            <div className="dest-grid-info">
                                <div className="info-row"><span className="material-icons-round">location_on</span> {d.location}</div>
                                <div className="info-row"><span className="material-icons-round">calendar_month</span> {d.days} Days</div>
                                <div className="info-row"><span className="material-icons-round">payments</span> {d.budget_est}</div>
                                <div className="info-row"><span className="material-icons-round">star</span> {d.rating}</div>
                            </div>
                            <button className="btn-secondary" style={{ width: '100%' }}>View Comprehensive Intel</button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length > 0 && Math.ceil(filtered.length / 12) > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                    <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>&laquo; Previous</button>
                    <span style={{ fontWeight: 'bold', color: 'var(--sidebar-bg)' }}>Page {page} of {Math.ceil(filtered.length / 12)}</span>
                    <button className="btn-secondary" disabled={page === Math.ceil(filtered.length / 12)} onClick={() => setPage(page + 1)}>Next &raquo;</button>
                </div>
            )}

            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-window" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-hero">
                            <button className="modal-close" onClick={() => setSelected(null)}><span className="material-icons-round">close</span></button>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem', display: 'inline-block' }}>{selected.type} Experience</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>{selected.name}</h2>
                            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{selected.location}</p>
                        </div>
                        <div className="modal-body-scroll">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <section>
                                    <h3 className="modal-h3"><span className="material-icons-round" style={{ color: 'var(--primary)' }}>info</span> Overview</h3>
                                    <p>{selected.description}</p>
                                    <p style={{ marginTop: '1rem' }}><strong>📌 Google Maps Reference:</strong> {selected.gmaps}</p>
                                    <p><strong>🎯 Nearby Attractions:</strong> {selected.nearby.join(', ')}</p>
                                </section>
                                <section>
                                    <h3 className="modal-h3"><span className="material-icons-round" style={{ color: 'var(--danger)' }}>warning</span> Warning & Safety</h3>
                                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
                                        <strong>Tourist Safety Tip:</strong> {selected.safety_tips}<br /><br />
                                        <strong>Common Mistake:</strong> {selected.mistakes}
                                    </div>
                                </section>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="deep-stats-grid">
                                    <div className="deep-stat"><strong>Nearest Airport</strong><span>{selected.airport}</span></div>
                                    <div className="deep-stat"><strong>Nearest Station</strong><span>{selected.station}</span></div>
                                    <div className="deep-stat"><strong>Road Network</strong><span>{selected.connectivity}</span></div>
                                    <div className="deep-stat"><strong>Local Transport</strong><span>{selected.local_transport}</span></div>
                                    <div className="deep-stat"><strong>Entry Fees</strong><span>{selected.entry_fees}</span></div>
                                    <div className="deep-stat"><strong>Daily Budget</strong><span>{selected.budget_daily}</span></div>
                                    <div className="deep-stat"><strong>Timings</strong><span>{selected.opening_hours}</span></div>
                                </div>
                                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => { setSelected(null); onAskAi(`Help me plan a trip to ${selected.name}`); }}>
                                    Plan with AI Assistant
                                </button>
                                <button className="btn-secondary" style={{ marginTop: '0.5rem', background: '#ecfeff', borderColor: '#06b6d4', color: '#0891b2', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => { setSelected(null); onOpenMap(selected); }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.2rem' }}>navigation</span> Start Live Navigation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 2. OVERVIEW DASHBOARD ---
const Overview = () => {
    const pieRef = useRef(null);
    const lineRef = useRef(null);
    const barRef = useRef(null);
    
    const pieChart = useRef(null);
    const lineChart = useRef(null);
    const barChart = useRef(null);

    useEffect(() => {
        if (pieRef.current) {
            if (pieChart.current) pieChart.current.destroy();
            pieChart.current = new Chart(pieRef.current, {
                type: 'pie',
                data: {
                    labels: ['Heritage & Monuments', 'Nature & Wildlife', 'Spiritual Destinations', 'Adventure & Trekking'],
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: ['#f97316', '#10b981', '#a855f7', '#3b82f6'],
                        hoverOffset: 15,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { font: { family: 'Inter', size: 14 } } } }
                }
            });
        }
        if (lineRef.current) {
            if (lineChart.current) lineChart.current.destroy();
            lineChart.current = new Chart(lineRef.current, {
                type: 'line',
                data: {
                    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                    datasets: [{
                        label: 'Foreign Tourist Arrivals (Millions)',
                        data: [10.93, 2.74, 1.52, 6.19, 9.23, 11.50],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        if (barRef.current) {
            if (barChart.current) barChart.current.destroy();
            barChart.current = new Chart(barRef.current, {
                type: 'bar',
                data: {
                    labels: ['Delhi', 'Maharashtra', 'Tamil Nadu', 'UP', 'Rajasthan'],
                    datasets: [{
                        label: 'Top Visited States (Millions)',
                        data: [28, 25, 22, 19, 15],
                        backgroundColor: '#f59e0b',
                        borderRadius: 4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        return () => {
            if (pieChart.current) pieChart.current.destroy();
            if (lineChart.current) lineChart.current.destroy();
            if (barChart.current) barChart.current.destroy();
        };
    }, []);

    return (
        <div>
            <div className="hero-banner">
                <h2>India Travel Dashboard</h2>
                <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Macro-level insights for surviving and thriving in the subcontinent.</p>
            </div>
            <div className="snapshot-grid">
                <div className="snap-card">
                    <div className="snap-header"><div className="snap-icon"><span className="material-icons-round">language</span></div><h3>Country Snapshot</h3></div>
                    <ul className="snap-list">
                        <li><span className="material-icons-round">payments</span> Currency: Indian Rupee (INR). ≈83 INR to 1 USD.</li>
                        <li><span className="material-icons-round">translate</span> Languages: Hindi & English dominant. 22 regional official languages.</li>
                        <li><span className="material-icons-round">schedule</span> Time Zone: IST (UTC +5:30). No daylight saving.</li>
                    </ul>
                </div>
                <div className="snap-card">
                    <div className="snap-header"><div className="snap-icon" style={{ color: 'var(--accent)', background: 'var(--accent-light)' }}><span className="material-icons-round">sim_card</span></div><h3>Digital Essentials</h3></div>
                    <ul className="snap-list">
                        <li><span className="material-icons-round">power</span> Plugs: Type C, D, and M (230V @ 50Hz). Bring universal adapters.</li>
                        <li><span className="material-icons-round">cell_tower</span> SIM: Airtel/Jio. Requires passport and physical photo upon arrival at airport.</li>
                        <li><span className="material-icons-round">app_shortcut</span> Apps: Uber, Ola (Cabs), Zomato, Swiggy (Food).</li>
                    </ul>
                </div>
                <div className="snap-card">
                    <div className="snap-header"><div className="snap-icon" style={{ color: 'var(--danger)', background: '#fee2e2' }}><span className="material-icons-round">diversity_3</span></div><h3>Cultural Rules</h3></div>
                    <ul className="snap-list">
                        <li><span className="material-icons-round">do_not_step</span> DO: Remove shoes before entering ANY temple or home.</li>
                        <li><span className="material-icons-round">pan_tool</span> DON'T: Eat or pass objects with your left hand.</li>
                        <li><span className="material-icons-round">checkroom</span> DRESS: Modestly. Cover shoulders and knees outside urban centers.</li>
                    </ul>
                </div>
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--sidebar-bg)' }}>Indian Tourism Analytics</h3>
            <div className="cards-grid">
                <div className="snap-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Prime Tourist Attractions</h4>
                    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                        <canvas ref={pieRef}></canvas>
                    </div>
                </div>
                <div className="snap-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Key Inbound Demographics</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}><span>Europe & UK</span><span>45%</span></div>
                            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}><div style={{ width: '45%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div></div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}><span>North America</span><span>28%</span></div>
                            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}><div style={{ width: '28%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div></div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}><span>Asia Pacific</span><span>18%</span></div>
                            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}><div style={{ width: '18%', height: '100%', background: '#fbbf24', borderRadius: '4px' }}></div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cards-grid" style={{ marginTop: '2rem' }}>
                <div className="snap-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Foreign Tourist Arrivals Trend</h4>
                    <div style={{ height: '250px', width: '100%', position: 'relative' }}>
                        <canvas ref={lineRef}></canvas>
                    </div>
                </div>
                <div className="snap-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Top Visited States</h4>
                    <div style={{ height: '250px', width: '100%', position: 'relative' }}>
                        <canvas ref={barRef}></canvas>
                    </div>
                </div>
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--sidebar-bg)' }}>Budget Tier Estimator</h3>
            <table className="modern-table">
                <thead><tr><th>Travel Profile</th><th>Accommodation Type</th><th>Transport Method</th><th>Avg Local Cost / Day</th></tr></thead>
                <tbody>
                    <tr><td><strong>Backpacker</strong></td><td>Hostels / Guesthouses</td><td>Buses, General Train Class</td><td>₹1,000 - ₹2,000</td></tr>
                    <tr><td><strong>Mid-Range</strong></td><td>3-Star Hotels / AirBnB</td><td>AC Trains, Ola/Uber Cabs</td><td>₹3,500 - ₹6,000</td></tr>
                    <tr><td><strong>Luxury</strong></td><td>5-Star Resorts / Heritage Palaces</td><td>Private AC Car / Flights</td><td>₹10,000+</td></tr>
                </tbody>
            </table>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--sidebar-bg)' }}>Unique Aspects of Indian Tourism</h3>
            <div className="snapshot-grid">
                <div className="snap-card">
                    <div className="snap-header"><div className="snap-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><span className="material-icons-round">festival</span></div><h3>Land of Festivals</h3></div>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Experience unmatched vibrant celebrations like Diwali, Holi, and Durga Puja which transform entire cities across the nation with light, color, and music.</p>
                </div>
                <div className="snap-card">
                    <div className="snap-header"><div className="snap-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><span className="material-icons-round">forest</span></div><h3>Incredible Biodiversity</h3></div>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>From the majestic Royal Bengal Tiger in Ranthambore to the one-horned rhinoceros in Kaziranga, India boasts 106 national parks spreading across dramatic terrains.</p>
                </div>
                <div className="snap-card">
                    <div className="snap-header"><div className="snap-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><span className="material-icons-round">architecture</span></div><h3>Architectural Marvels</h3></div>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Home to 42 UNESCO World Heritage Sites, including the timeless Taj Mahal, ancient caves of Ajanta & Ellora, and the spectacular temples of Hampi.</p>
                </div>
            </div>
        </div>
    );
};

// --- 3. AI GUIDE ---
const AIGuide = ({ initMsg, clearMsg }) => {
    const [msgs, setMsgs] = useState([{ id: 1, type: 'ai', text: 'Hello! I am your AI Tourist Companion. What region of India are you exploring?' }]);
    const [inp, setInp] = useState('');
    const [loading, setLoading] = useState(false);
    const endR = useRef(null);

    useEffect(() => { if (endR.current) endR.current.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

    const send = async (msg) => {
        if (!msg.trim() || loading) return;
        setInp(''); setLoading(true);
        setMsgs(p => [...p, { id: Date.now(), type: 'usr', text: msg }]);
        try {
            const r = await fetch('http://localhost:5000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, history: msgs }) });
            const d = await r.json();
            setMsgs(p => [...p, { id: Date.now() + 1, type: 'ai', text: d.reply }]);
        } catch (e) { setMsgs(p => [...p, { id: Date.now() + 1, type: 'ai', text: 'Connection failed.' }]); }
        finally { setLoading(false); }
    }

    useEffect(() => { if (initMsg) { send(initMsg); clearMsg(); } }, [initMsg]);

    return (
        <div className="chat-ui">
            <div className="chat-prompts">
                <button className="chip" onClick={() => send('Plan 3 days in Goa')}>Plan 3 days in Goa</button>
                <button className="chip" onClick={() => send('Safe places for solo female travelers')}>Solo Female Travel Tips</button>
                <button className="chip" onClick={() => send('Cheap hotels in Chennai')}>Chennai Budget Help</button>
                <button className="chip" style={{ color: '#ef4444', borderColor: '#fca5a5', background: '#fef2f2' }} onClick={() => send('EMERGENCY: I lost my passport in India, what should I do?')}>Lost Passport Protocol</button>
            </div>
            <div className="chat-messages">
                {msgs.map(m => (
                    <div key={m.id} className={`msg-bubble ${m.type === 'ai' ? 'msg-ai' : 'msg-usr'}`}>{m.text}</div>
                ))}
                {loading && <div className="msg-bubble msg-ai" style={{ fontStyle: 'italic' }}>Generating response using India Tourism Matrix...</div>}
                <div ref={endR} />
            </div>
            <div className="chat-input-bar">
                <button className="btn-secondary" style={{ padding: '0.8rem', borderRadius: '50%', background: '#f8fafc', border: '1px solid #cbd5e1' }} onClick={() => alert("Voice input mockup triggered. Waiting for microphone permission...")}>
                    <span className="material-icons-round" style={{ color: 'var(--primary)' }}>mic</span>
                </button>
                <input type="text" value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(inp)} placeholder="Ask about safety, routes, or local food..." />
                <button className="btn-primary" onClick={() => send(inp)}><span className="material-icons-round">send</span></button>
            </div>
        </div>
    );
};

// --- 4. SMART TRIP PLANNER ---
const TripPlanner = () => {
    const [form, setForm] = useState({ state: 'Rajasthan', days: 3, budget: 'Mid-range', vibe: 'Culture' });
    const [itin, setItin] = useState(null);
    const pdfRef = useRef();

    const generate = () => {
        let plan = [];
        const times = ["Morning", "Afternoon", "Evening"];
        for (let i = 1; i <= form.days; i++) {
            plan.push({
                day: i,
                m: `Explore the top heritage forts in ${form.state}. Spend 3-4 hours avoiding peak heat.`,
                a: `Lunch at a verified ${form.budget} restaurant serving local thalis. Proceed to local markets.`,
                e: `Sunset viewing point or cultural show. Relax at your ${form.budget} accommodation.`
            });
        }
        setItin({ form, plan, cost: form.budget === 'Budget' ? form.days * 2000 : form.budget === 'Mid-range' ? form.days * 5000 : form.days * 15000 });
    }

    const exportPDF = async () => {
        const h2c = await html2canvas(pdfRef.current, { scale: 2 });
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        pdf.addImage(h2c.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), (h2c.height * pdf.internal.pageSize.getWidth()) / h2c.width);
        pdf.save(`${form.state}_Itinerary.pdf`);
    }

    return (
        <div className="planner-layout">
            <div className="planner-form-box">
                <h3 style={{ marginBottom: '2rem', color: 'var(--sidebar-bg)' }}>Plan Parameters</h3>
                <label className="form-label">Destination</label><input className="form-input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                <label className="form-label">Duration (Days)</label><input className="form-input" type="number" min="1" max="14" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} />
                <label className="form-label">Budget Tier</label>
                <select className="form-input" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                    <option>Budget</option><option>Mid-range</option><option>Luxury</option>
                </select>
                <button className="btn-primary" style={{ width: '100%' }} onClick={generate}>Generate Smart Itinerary</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {itin ? (
                    <div className="itinerary-canvas" ref={pdfRef}>
                        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '2rem' }}>
                            <h2 style={{ color: 'var(--primary)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>{itin.form.state} Expedition</h2>
                            <p style={{ color: 'gray', fontSize: '1.1rem' }}>{itin.form.days} Days • {itin.form.budget} Profile • Approx Cost: ₹{itin.cost}</p>
                        </div>
                        {itin.plan.map(d => (
                            <div className="itinerary-day" key={d.day}>
                                <div className="day-header"><div className="day-badge">DAY {d.day}</div></div>
                                <div className="timeline-item"><div className="time-bubble">AM</div><div style={{ paddingTop: '12px' }}>{d.m}</div></div>
                                <div className="timeline-item"><div className="time-bubble">PM</div><div style={{ paddingTop: '12px' }}>{d.a}</div></div>
                                <div className="timeline-item"><div className="time-bubble">EVE</div><div style={{ paddingTop: '12px' }}>{d.e}</div></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="itinerary-canvas" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'gray' }}>
                        <span className="material-icons-round" style={{ fontSize: '4rem', opacity: 0.3 }}>route</span>
                        <h3>No Itinerary Generated</h3>
                        <p>Fill in the parameters on the left to build a highly detailed day-by-day plan.</p>
                    </div>
                )}
                {itin && <button className="btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={exportPDF}>Download Official PDF Guide</button>}
            </div>
        </div>
    )
}

// --- 5. VISA INFO ---
const VisaInfo = () => (
    <div>
        <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
            <h2>Official Visa & Entry Gate</h2>
            <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>India processes electronic visas (e-Visa) for nationals of 165+ countries.</p>
        </div>
        <div className="snapshot-grid">
            <div className="snap-card" style={{ borderTop: '4px solid var(--primary)' }}>
                <h3>e-Tourist Visa</h3>
                <ul className="snap-list" style={{ marginTop: '1.5rem' }}>
                    <li><strong>Usage:</strong> Recreation, Sightseeing.</li>
                    <li><strong>Validity:</strong> 30 Days (Double Entry) or 1/5 Years (Multiple).</li>
                    <li><strong>Processing:</strong> 72 Hours max (usually 24h).</li>
                    <li><strong>Fees:</strong> USD $10 to $80 based on nationality.</li>
                </ul>
            </div>
            <div className="snap-card" style={{ borderTop: '4px solid var(--info)' }}>
                <h3>Required Protocol</h3>
                <ul className="snap-list" style={{ marginTop: '1.5rem' }}>
                    <li>Passport valid for at least 6 months.</li>
                    <li>Recent front-facing digital photo (white background).</li>
                    <li>Scan of passport bio page.</li>
                    <li>Return flight ticket proof required at immigration.</li>
                </ul>
            </div>
        </div>
        <div className="snapshot-grid" style={{ marginTop: '2rem' }}>
            <div className="snap-card">
                <h3>Strict Overstay Rules</h3><p style={{ fontSize: '0.9rem', color: '#991b1b', lineHeight: 1.6 }}>Overstaying your visa in India is a serious offense. Penalties include heavy fines (in USD), detention, and deportation. Visas CANNOT be extended from within India.</p>
            </div>
            <div className="snap-card">
                <h3>Foreigner Registration (FRRO)</h3><p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>If you enter on a 1 Year/5 Year visa and stay continuously for more than 180 days, you MUST register with FRRO within 14 days of crossing the 180-day mark.</p>
            </div>
        </div>
    </div>
);

// --- 6. WEATHER ---
const Weather = () => {
    const [destinations, setDestinations] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/destinations')
            .then(r => r.json())
            .then(d => setDestinations(d));
    }, []);

    const handleSelect = (e) => {
        const dest = destinations.find(d => d.id.toString() === e.target.value);
        if (dest) {
            const city = dest.location.split(',')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
            setSelectedCity(city);
        } else {
            setSelectedCity('');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', minHeight: '80vh' }}>
            <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', marginBottom: '0' }}>
                <h2>Live Weather Matrix</h2>
                <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Real-time meteorological readings for all 305+ destinations.</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <span className="material-icons-round" style={{ color: '#94a3b8' }}>cloud</span>
                <select
                    onChange={handleSelect}
                    style={{ flex: 1, padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-md)', background: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                >
                    <option value="">Overview (India) - Select a Destination</option>
                    {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.location})</option>
                    ))}
                </select>
            </div>
            <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <iframe 
                    src={`https://www.ventusky.com/${selectedCity ? selectedCity : '?p=22.5;79.6;5'}`} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: '600px' }} 
                    allowFullScreen="" 
                    loading="lazy">
                </iframe>
            </div>
        </div>
    );
};

// --- 7. FESTIVALS ---
const Festivals = () => (
    <div>
        <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)' }}><h2>India Calendar of Culture</h2><p>Plan your trips around these massive immersive celebrations.</p></div>
        <div className="snapshot-grid">
            <div className="snap-card" style={{ borderTop: '6px solid #fbbf24' }}><h3>Diwali (Nov)</h3><p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'gray' }}>Festival of Lights. Firecrackers everywhere. Air quality drops in North. Massive crowds.</p></div>
            <div className="snap-card" style={{ borderTop: '6px solid #ec4899' }}><h3>Holi (Mar)</h3><p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'gray' }}>Festival of Colors. Wear old clothes. Best experienced in Pushkar, Vrindavan, or Udaipur.</p></div>
            <div className="snap-card" style={{ borderTop: '6px solid #10b981' }}><h3>Eid & Christmas</h3><p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'gray' }}>Rich feasts globally in India. Goa is stunning during Christmas weeks. Old Delhi thrives during Eid.</p></div>
        </div>
    </div>
);

// --- 8. COMMUNITY ---
const Community = () => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><h2 style={{ color: 'var(--sidebar-bg)' }}>Verified Traveler Forum</h2><button className="btn-primary">Post Update</button></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="snap-card">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}><div className="time-bubble" style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white' }}>J</div><div><strong>Jane Austrian</strong> <span style={{ fontSize: '0.7rem', background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Verified Traveler</span></div></div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Just completed the Golden Triangle as a solo female! Tip: Use Uber for everything in Delhi/Jaipur to avoid auto haggling. Totally safe if you stick to daytime transits.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem' }}><span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>👍 142 Likes</span><span style={{ color: 'gray' }}>💬 15 Comments</span></div>
            </div>
            <div className="snap-card">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}><div className="time-bubble" style={{ width: '40px', height: '40px', background: '#8b5cf6', color: 'white' }}>M</div><div><strong>Mike Chen</strong> </div></div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Any recommendations for trustworthy filtered water brands when traveling rural Kerala?</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem' }}><span style={{ color: 'gray', cursor: 'pointer', fontWeight: '600' }}>👍 12 Likes</span><span style={{ color: 'var(--primary)' }}>💬 8 Answers</span></div>
            </div>
        </div>
    </div>
);

// --- 9. SAFETY ---
const Safety = () => (
    <div>
        <div className="sos-card">
            <h1 style={{ color: '#991b1b', fontSize: '3rem', marginBottom: '2rem' }}>DISPATCH EMERGENCY</h1>
            <button className="sos-btn-huge"><span className="material-icons-round" style={{ fontSize: '4rem' }}>sensors</span></button>
            <p style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '1.2rem' }}>Pressing this broadcasts your live GPS location to local Indian Authorities and your emergency contacts.</p>
        </div>
        <div className="snapshot-grid">
            <div className="snap-card" style={{ borderColor: 'var(--danger)' }}><h3 style={{ color: 'var(--danger)' }}>Direct Hotlines</h3><ul className="snap-list" style={{ marginTop: '1rem' }}><li><strong>112</strong> - National Emergency (Pan India)</li><li><strong>108</strong> - Ambulance Operations</li><li><strong>1091</strong> - Women Helpline</li></ul></div>
            <div className="snap-card"><h3>Health Defense</h3><ul className="snap-list" style={{ marginTop: '1rem' }}><li>Never consume open tap water. Buy sealed "Kinley" or "Aquafina".</li><li>Carry Mosquito Repellent (Odomos).</li><li>Street food MUST be served piping hot in front of you.</li></ul></div>
            <div className="snap-card"><h3>Scam Radar</h3><ul className="snap-list" style={{ marginTop: '1rem' }}><li>Ignore people telling you "Your hotel is closed/burned down".</li><li>Always enforce taximeters or pre-pay via apps.</li><li>Book trains ONLY on IRCTC or verified agents.</li></ul></div>
        </div>
    </div>
);

// --- BONUS SECTIONS ---
const FoodGuide = () => (
    <div>
        <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
            <h2>Ultimate Survival Food Guide</h2>
            <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Navigate the incredibly diverse and spicy world of Indian cuisine safely.</p>
        </div>
        <div className="snapshot-grid">
            <div className="snap-card" style={{ borderTop: '4px solid #ef4444' }}>
                <div className="snap-header"><div className="snap-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><span className="material-icons-round">local_fire_department</span></div><h3>Spice Protocols</h3></div>
                <ul className="snap-list">
                    <li>"Medium spicy" in India is often "Very Spicy" for tourists. Ask for "Non-spicy" intentionally.</li>
                    <li>Always keep cooling sides like Raita (yogurt) or Lassi handy while eating curries.</li>
                    <li>Carry basic antacids; adjusting to Indian spices takes around 3-4 days.</li>
                </ul>
            </div>
            <div className="snap-card" style={{ borderTop: '4px solid #10b981' }}>
                <div className="snap-header"><div className="snap-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><span className="material-icons-round">health_and_safety</span></div><h3>Hygiene Rules</h3></div>
                <ul className="snap-list">
                    <li><strong>Never</strong> consume tap water, salads, or cut fruits from street vendors.</li>
                    <li>Eat street food only where you see high crowds and food cooked piping hot in front of you.</li>
                    <li>Stick to packaged mineral water (look for unbroken seals on Kinley or Bisleri).</li>
                </ul>
            </div>
            <div className="snap-card" style={{ borderTop: '4px solid #f59e0b' }}>
                <div className="snap-header"><div className="snap-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><span className="material-icons-round">restaurant</span></div><h3>Regional Highlights</h3></div>
                <ul className="snap-list">
                    <li><strong>North:</strong> Butter Chicken, Chole Bhature, Tandoori Naan.</li>
                    <li><strong>South:</strong> Dosa, Idli, Coconut Chutney, Malabar Seafood.</li>
                    <li><strong>West:</strong> Vada Pav, Dhokla, Goan Fish Curry.</li>
                </ul>
            </div>
        </div>
    </div>
);

const TransportGuide = () => (
    <div>
        <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
            <h2>Subcontinent Transit System</h2>
            <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>How to traverse 3.2 million sq km via Trains, Flights, and Rickshaws.</p>
        </div>
        <div className="snapshot-grid">
            <div className="snap-card" style={{ borderTop: '4px solid #3b82f6' }}>
                <div className="snap-header"><div className="snap-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><span className="material-icons-round">train</span></div><h3>Train Network (IRCTC)</h3></div>
                <ul className="snap-list">
                    <li>Book AC 2-Tier or AC 3-Tier for comfortable overnight long-distance journeys.</li>
                    <li>To book as a tourist, use the official IRCTC app or authorized agents like 12Go Asia.</li>
                    <li>Book 30-90 days in advance; routes like Delhi to Agra sell out quickly.</li>
                </ul>
            </div>
            <div className="snap-card" style={{ borderTop: '4px solid #8b5cf6' }}>
                <div className="snap-header"><div className="snap-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><span className="material-icons-round">electric_rickshaw</span></div><h3>Local Navigation</h3></div>
                <ul className="snap-list">
                    <li><strong>Cabs:</strong> Download Uber and Ola. Never hail an unmetered street cab.</li>
                    <li><strong>Auto-Rickshaws:</strong> Always negotiate the price BEFORE getting in, or ask for the meter.</li>
                    <li><strong>Metro:</strong> Delhi and Mumbai have world-class metro networks. Highly recommended over road traffic.</li>
                </ul>
            </div>
            <div className="snap-card" style={{ borderTop: '4px solid #06b6d4' }}>
                <div className="snap-header"><div className="snap-icon" style={{ background: '#ecfeff', color: '#06b6d4' }}><span className="material-icons-round">flight</span></div><h3>Domestic Flights</h3></div>
                <ul className="snap-list">
                    <li>Best for jumping between regions (North to South). India is the size of Europe.</li>
                    <li>Top reliable budget airlines: IndiGo, Air India Express, and Akasa Air.</li>
                    <li>Arrive 2 hours early for domestic; security requires printed/digital tickets at the door.</li>
                </ul>
            </div>
        </div>
    </div>
);

const CurrencyConverter = () => (
    <div>
        <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
            <h2>Currency & Tipping Dynamics</h2>
            <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Financial strategies, exchange rates, and the Digital India ecosystem.</p>
        </div>
        <div className="cards-grid">
            <div className="snap-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '2px solid #e2e8f0' }}>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>General Conversion Rate</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)' }}>$1 USD</div>
                <div style={{ fontSize: '1.5rem', color: '#94a3b8', margin: '0.5rem 0' }}>≈</div>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#10b981' }}>₹84 INR</div>
                <p style={{ color: 'gray', fontSize: '0.8rem', marginTop: '1rem' }}>(Subject to macro fluctuations)</p>
            </div>
            <div className="snap-card">
                <div className="snap-header"><div className="snap-icon" style={{ background: '#fef3c7', color: '#d97706' }}><span className="material-icons-round">qr_code_scanner</span></div><h3>The UPI Revolution</h3></div>
                <ul className="snap-list">
                    <li>India runs almost entirely on massive digital payments (UPI via QR codes).</li>
                    <li>Tourists can now get temporary UPI access via "Cheq" app or prepaid cards at major airports.</li>
                    <li>Even small fruit vendors accept UPI; having it saves you from carrying exact change.</li>
                </ul>
            </div>
            <div className="snap-card">
                <div className="snap-header"><div className="snap-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}><span className="material-icons-round">local_atm</span></div><h3>Cash & Tipping</h3></div>
                <ul className="snap-list">
                    <li><strong>ATMs:</strong> Carry a mix of ₹500 and ₹100 notes. Break large notes at hotels.</li>
                    <li><strong>Restaurants:</strong> 10% is standard if a "Service Charge" isn't already included in the bill.</li>
                    <li><strong>Drivers/Guides:</strong> Tip ₹200-500 per day for drivers, more for extended private guides.</li>
                </ul>
            </div>
        </div>
    </div>
);

// --- 10. LIVE MAPS ---
const TouristMap = ({ targetDest }) => {
    const defaultStart = "New Delhi, India";
    const [start, setStart] = useState(defaultStart);
    const destinationName = targetDest ? `${targetDest.name}, ${targetDest.location}` : "Taj Mahal, Agra, India";

    // Using a more robust, standard search query format that Google easily permits in iframes.
    const visualMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(destinationName)}&output=embed`;
    const nativeRoutingUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destinationName)}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', minHeight: '80vh' }}>
            <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d9488 100%)', marginBottom: '0' }}>
                <h2>Live Navigation Matrix</h2>
                <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Dynamic route planning utilizing global spatial coordinates.</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <span className="material-icons-round" style={{ color: '#94a3b8' }}>my_location</span>
                <input value={start} onChange={e => setStart(e.target.value)} placeholder="Start Location (e.g. Current Hotel)" style={{ flex: 1, padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-md)' }} />
                <span className="material-icons-round" style={{ color: '#94a3b8' }}>arrow_forward</span>
                <input value={destinationName} readOnly style={{ flex: 1, padding: '0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', color: 'gray' }} />
                <button className="btn-primary" style={{ background: '#0d9488' }} onClick={() => window.open(nativeRoutingUrl, '_blank')}>
                    <span className="material-icons-round">directions</span> Plan Route
                </button>
            </div>
            <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <iframe src={visualMapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
