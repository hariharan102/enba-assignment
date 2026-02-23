import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GameCard from './components/GameCard';
import AdminPage from './pages/AdminPage';
import './admin.css';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function StorePage() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchGames = useCallback(
    debounce(async (searchTerm) => {
      setLoading(true);
      try {
        const url = searchTerm.trim()
          ? `/list?search=${encodeURIComponent(searchTerm.trim())}`
          : '/list';
        const res = await fetch(url);
        const data = await res.json();
        setGames(data.games || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => { fetchGames(query); }, [query, fetchGames]);

  return (
    <>
      <Header query={query} onQueryChange={setQuery} />
      <main className="main-content">
        {!loading && (
          <p className="results-count">
            Results found: <strong>{total}</strong>
          </p>
        )}
        {loading ? (
          <div className="loading">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="no-results">No games found for "{query}"</div>
        ) : (
          <div className="game-grid">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function App() {
  // Simple client-side routing: /admin → AdminPage, otherwise → StorePage
  const isAdmin = window.location.pathname === '/admin';
  return isAdmin ? <AdminPage /> : <StorePage />;
}
