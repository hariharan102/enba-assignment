export default function Header({ query, onQueryChange }) {
    return (
        <header className="header">
            {/* Logo */}
            <a href="/" className="logo">
                <img src="/logoFull.svg" alt="Eneba" className="logo-image" />
            </a>

            {/* Search */}
            <div className="search-bar">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    id="search-input"
                    className="search-input"
                    type="text"
                    placeholder="Search games..."
                    value={query}
                    onChange={e => onQueryChange(e.target.value)}
                    autoComplete="off"
                />
                {query && (
                    <button
                        className="search-clear"
                        onClick={() => onQueryChange('')}
                        aria-label="Clear search"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="header-spacer" />

            <div className="header-region">
                <span className="flag-icon">🇪🇺</span>
                <span className="region-text">English EU | EUR</span>
            </div>

            {/* Right icons */}
            <div className="header-icons">
                <a href="/admin" style={{ fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.18)', color: '#fff', textDecoration: 'none', letterSpacing: '0.5px', flexShrink: 0 }}>
                    ADMIN
                </a>
                <button className="header-icon-btn" aria-label="Wishlist">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
                <button className="header-icon-btn" aria-label="Cart">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                </button>
                <div className="avatar" aria-label="Profile">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
            </div>
        </header>
    );
}
