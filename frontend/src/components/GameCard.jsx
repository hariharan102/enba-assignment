import { useState } from 'react';

const PLATFORM_LABELS = {
    ea: 'EA App',
    xbox: 'Xbox Live',
    playstation: 'PlayStation',
    nintendo: 'Nintendo',
    rockstar: 'Rockstar',
};

export default function GameCard({ game }) {
    const [imgError, setImgError] = useState(false);
    const dotClass = `platform-dot ${game.platform_icon || 'default'}`;

    return (
        <div className="game-card">
            {/* Image section */}
            <div className="card-image-wrapper">
                {!imgError ? (
                    <img
                        className="card-image"
                        src={game.image_url}
                        alt={game.name}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="card-image-fallback">
                        {game.name}
                    </div>
                )}

                {/* Platform banner (e.g. SWITCH badge) */}
                {game.badge && (
                    <div className="badge-top-right">{game.badge}</div>
                )}

                {/* Cashback badge */}
                {game.cashback && (
                    <div className="cashback-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18c0-.55-.45-1-1-1s-1 .45-1 1v1.93C7.06 19.44 4.56 16.94 4.07 14H6c.55 0 1-.45 1-1s-.45-1-1-1H4.07C4.56 8.06 7.06 5.56 10 5.07V7c0 .55.45 1 1 1s1-.45 1-1V5.07C16.94 5.56 19.44 8.06 19.93 11H18c-.55 0-1 .45-1 1s.45 1 1 1h1.93c-.49 2.94-2.99 5.44-5.93 5.93z" />
                        </svg>
                        CASHBACK
                    </div>
                )}

                {/* Platform strip at bottom of image */}
                <div className="platform-strip">
                    <span className={dotClass} />
                    <span className="platform-strip-text">
                        {PLATFORM_LABELS[game.platform_icon] || game.platform}
                    </span>
                </div>
            </div>

            {/* Card body */}
            <div className="card-body">
                <div className="card-title">{game.name}</div>
                <div className="card-region">{game.region}</div>

                <div className="card-pricing">
                    {game.original_price && (
                        <div className="card-original-price">
                            <span className="price-strikethrough">
                                From €{game.original_price.toFixed(2)}
                            </span>
                            {game.discount_pct && (
                                <span className="discount-badge">-{game.discount_pct}%</span>
                            )}
                        </div>
                    )}

                    <div className="card-price">
                        €{game.price.toFixed(2)}
                        <span className="card-price-info">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </span>
                    </div>

                    {game.cashback && (
                        <div className="card-cashback">
                            Cashback: €{game.cashback.toFixed(2)}
                        </div>
                    )}
                </div>

                <div className="card-footer">
                    <svg className="likes-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span className="likes-count">{game.likes?.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
