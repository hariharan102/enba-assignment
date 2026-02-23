const express = require('express');
const cors = require('cors');
const path = require('path');
const Fuse = require('fuse.js');
const { all, run, init } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve built frontend in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// GET /list  or  GET /list?search=<query>
app.get('/list', async (req, res) => {
    try {
        const { search } = req.query;
        let games = await all('SELECT * FROM games');

        if (search && search.trim() !== '') {
            const fuse = new Fuse(games, {
                keys: ['name'],
                threshold: 0.4,
                ignoreLocation: true,
            });
            games = fuse.search(search.trim()).map(r => r.item);
        }

        res.json({ total: games.length, games });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /list — Create a new game
app.post('/list', async (req, res) => {
    try {
        const { name, image_url, platform, platform_icon, region, original_price, price, discount_pct, cashback, likes, seller, badge } = req.body;
        if (!name || !price || !platform || !region) {
            return res.status(400).json({ error: 'name, price, platform and region are required' });
        }
        const result = await run(
            `INSERT INTO games (name, image_url, platform, platform_icon, region, original_price, price, discount_pct, cashback, likes, seller, badge)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, image_url || '', platform, platform_icon || null, region, original_price || null, price, discount_pct || null, cashback || null, likes || 0, seller || null, badge || null]
        );
        const newGame = await all('SELECT * FROM games WHERE id = ?', [result.lastID]);
        res.status(201).json(newGame[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /list/:id — Update a game
app.put('/list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image_url, platform, platform_icon, region, original_price, price, discount_pct, cashback, likes, seller, badge } = req.body;
        await run(
            `UPDATE games SET name=?, image_url=?, platform=?, platform_icon=?, region=?, original_price=?, price=?, discount_pct=?, cashback=?, likes=?, seller=?, badge=? WHERE id=?`,
            [name, image_url, platform, platform_icon, region, original_price, price, discount_pct, cashback, likes, seller, badge, id]
        );
        const updated = await all('SELECT * FROM games WHERE id = ?', [id]);
        if (!updated.length) return res.status(404).json({ error: 'Game not found' });
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /list/:id — Delete a game
app.delete('/list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await run('DELETE FROM games WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fallback to React app for all non-API routes
app.get('*', (req, res) => {
    const distPath = path.join(__dirname, '../frontend/dist/index.html');
    res.sendFile(distPath);
});

init().then(() => {
    app.listen(PORT, () => {
        console.log(`Enba backend running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
});
