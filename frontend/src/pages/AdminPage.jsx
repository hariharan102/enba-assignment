import { useState, useEffect } from 'react';

const EMPTY_FORM = {
    name: '', image_url: '', platform: '', platform_icon: '', region: '',
    original_price: '', price: '', discount_pct: '', cashback: '', likes: '', seller: '', badge: ''
};

const PLATFORM_OPTIONS = [
    { value: 'ea', label: 'EA App' },
    { value: 'xbox', label: 'Xbox Live' },
    { value: 'playstation', label: 'PlayStation' },
    { value: 'nintendo', label: 'Nintendo' },
    { value: 'rockstar', label: 'Rockstar' },
];

export default function AdminPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);   // null | 'add' | game-object
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const loadGames = async () => {
        setLoading(true);
        const res = await fetch('/list');
        const data = await res.json();
        setGames(data.games || []);
        setLoading(false);
    };

    useEffect(() => { loadGames(); }, []);

    const openAdd = () => {
        setForm(EMPTY_FORM);
        setModal('add');
    };

    const openEdit = (game) => {
        setForm({
            name: game.name || '',
            image_url: game.image_url || '',
            platform: game.platform || '',
            platform_icon: game.platform_icon || '',
            region: game.region || '',
            original_price: game.original_price ?? '',
            price: game.price ?? '',
            discount_pct: game.discount_pct ?? '',
            cashback: game.cashback ?? '',
            likes: game.likes ?? '',
            seller: game.seller || '',
            badge: game.badge || '',
        });
        setModal(game);
    };

    const closeModal = () => setModal(null);

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handlePlatformChange = (e) => {
        const icon = e.target.value;
        const label = PLATFORM_OPTIONS.find(p => p.value === icon)?.label || '';
        setForm(f => ({ ...f, platform_icon: icon, platform: label }));
    };

    const handleSave = async () => {
        if (!form.name || !form.price || !form.platform || !form.region) {
            alert('Name, Price, Platform and Region are required.');
            return;
        }
        setSaving(true);
        const payload = {
            ...form,
            original_price: form.original_price !== '' ? Number(form.original_price) : null,
            price: Number(form.price),
            discount_pct: form.discount_pct !== '' ? Number(form.discount_pct) : null,
            cashback: form.cashback !== '' ? Number(form.cashback) : null,
            likes: form.likes !== '' ? Number(form.likes) : 0,
            badge: form.badge || null,
        };

        const isEdit = modal !== 'add';
        const url = isEdit ? `/list/${modal.id}` : '/list';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await loadGames();
                closeModal();
                showToast(isEdit ? '✅ Game updated!' : '✅ Game added!');
            } else {
                let errText = await res.text();
                try {
                    const err = JSON.parse(errText);
                    alert('Error: ' + err.error);
                } catch (e) {
                    alert('Server Error: ' + errText.substring(0, 100));
                }
            }
        } catch (error) {
            console.error("Save error:", error);
            alert('Network or syntax error: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (game) => {
        if (!window.confirm(`Delete "${game.name}"?`)) return;
        await fetch(`/list/${game.id}`, { method: 'DELETE' });
        await loadGames();
        showToast('🗑️ Game deleted.');
    };

    return (
        <div className="admin-page">
            {toast && <div className="admin-toast">{toast}</div>}

            <div className="admin-header">
                <h1 className="admin-title">🎮 Admin Panel</h1>
                <a href="/" className="admin-back-btn">← Back to Store</a>
                <button className="admin-add-btn" onClick={openAdd}>+ Add Game</button>
            </div>

            {loading ? (
                <p className="admin-loading">Loading...</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Platform</th>
                                <th>Region</th>
                                <th>Price (€)</th>
                                <th>Disc %</th>
                                <th>Cashback (€)</th>
                                <th>Likes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map(g => (
                                <tr key={g.id}>
                                    <td>{g.id}</td>
                                    <td className="admin-td-name">{g.name}</td>
                                    <td>{g.platform}</td>
                                    <td><span className="region-pill">{g.region}</span></td>
                                    <td>€{Number(g.price).toFixed(2)}</td>
                                    <td>{g.discount_pct != null ? `-${g.discount_pct}%` : '—'}</td>
                                    <td>{g.cashback != null ? `€${Number(g.cashback).toFixed(2)}` : '—'}</td>
                                    <td>{g.likes?.toLocaleString()}</td>
                                    <td className="admin-td-actions">
                                        <button className="btn-edit" onClick={() => openEdit(g)}>✏️ Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(g)}>🗑️ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">{modal === 'add' ? 'Add New Game' : 'Edit Game'}</h2>

                        <div className="form-grid">
                            <label>Name *
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Game title + key type" />
                            </label>

                            <label>Platform *
                                <select name="platform_icon" value={form.platform_icon} onChange={handlePlatformChange}>
                                    <option value="">Select platform</option>
                                    {PLATFORM_OPTIONS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </label>

                            <label>Region *
                                <select name="region" value={form.region} onChange={handleChange}>
                                    <option value="">Select region</option>
                                    <option value="GLOBAL">GLOBAL</option>
                                    <option value="EUROPE">EUROPE</option>
                                    <option value="US">US</option>
                                    <option value="UK">UK</option>
                                </select>
                            </label>

                            <label>Price (€) *
                                <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} placeholder="e.g. 39.99" />
                            </label>

                            <label>Original Price (€)
                                <input name="original_price" type="number" step="0.01" min="0" value={form.original_price} onChange={handleChange} placeholder="e.g. 59.99" />
                            </label>

                            <label>Discount %
                                <input name="discount_pct" type="number" min="0" max="100" value={form.discount_pct} onChange={handleChange} placeholder="e.g. 30" />
                            </label>

                            <label>Cashback (€)
                                <input name="cashback" type="number" step="0.01" min="0" value={form.cashback} onChange={handleChange} placeholder="e.g. 3.99" />
                            </label>

                            <label>Likes
                                <input name="likes" type="number" min="0" value={form.likes} onChange={handleChange} placeholder="e.g. 500" />
                            </label>

                            <label>Seller
                                <input name="seller" value={form.seller} onChange={handleChange} placeholder="e.g. Eneba, G2A" />
                            </label>

                            <label>Badge (optional)
                                <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. SWITCH" />
                            </label>

                            <label className="form-full">Image URL
                                <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="btn-save" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : modal === 'add' ? 'Add Game' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
