import './Navigation.css';

function Navigation({ currentView, onNavigate }) {
    const navItems = [
        { id: 'dashboard', icon: '🏠', label: 'Home' },
        { id: 'workout', icon: '💪', label: 'Workout' },
        { id: 'history', icon: '📊', label: 'History' },
        { id: 'exercises', icon: '📋', label: 'Exercises' },
        { id: 'progress', icon: '📈', label: 'Progress' },
        { id: 'settings', icon: '⚙️', label: 'Settings' }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}

export default Navigation;
