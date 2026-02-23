const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'games.db'));

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function init() {
    await run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_url TEXT NOT NULL,
      platform TEXT NOT NULL,
      platform_icon TEXT,
      region TEXT NOT NULL,
      original_price REAL,
      price REAL NOT NULL,
      discount_pct INTEGER,
      cashback REAL,
      likes INTEGER DEFAULT 0,
      seller TEXT,
      badge TEXT
    )
  `);

    const rows = await all('SELECT COUNT(*) as c FROM games');
    if (rows[0].c === 0) {
        const games = [
            // Split Fiction
            ['Split Fiction EA App Key (PC) GLOBAL', 'https://gaming-cdn.com/images/products/14243/616x353/split-fiction-pc-game-ea-app-cover.jpg', 'EA App', 'ea', 'GLOBAL', 49.99, 40.93, 18, 4.50, 626, 'Gamivo', null],
            ['Split Fiction (Xbox Series X|S) XBOX LIVE Key EUROPE', 'https://gaming-cdn.com/images/products/14243/616x353/split-fiction-pc-game-ea-app-cover.jpg', 'Xbox Live', 'xbox', 'EUROPE', 49.99, 34.14, 32, 3.76, 500, 'Kinguin', null],
            ['Split Fiction (Xbox Series X|S) XBOX LIVE Key GLOBAL', 'https://gaming-cdn.com/images/products/14243/616x353/split-fiction-pc-game-ea-app-cover.jpg', 'Xbox Live', 'xbox', 'GLOBAL', 49.99, 35.15, 30, 3.87, 1039, 'CDKeys', null],
            ['Split Fiction (Nintendo Switch 2) eShop Key EUROPE', 'https://gaming-cdn.com/images/products/14243/616x353/split-fiction-pc-game-ea-app-cover.jpg', 'Nintendo', 'nintendo', 'EUROPE', null, 36.25, null, 3.99, 288, 'Eneba', 'SWITCH'],
            ['Split Fiction PS5 Key EUROPE', 'https://gaming-cdn.com/images/products/14243/616x353/split-fiction-pc-game-ea-app-cover.jpg', 'PlayStation', 'playstation', 'EUROPE', 49.99, 38.50, 22, 4.20, 412, 'G2A', null],
            ['Split Fiction PS5 Key GLOBAL', 'https://gaming-cdn.com/images/products/14243/616x353/split-fiction-pc-game-ea-app-cover.jpg', 'PlayStation', 'playstation', 'GLOBAL', 49.99, 37.80, 24, 4.00, 189, 'Eneba', null],
            // FIFA 23
            ['EA SPORTS FIFA 23 PC Origin Key GLOBAL', 'https://gaming-cdn.com/images/products/8468/616x353/ea-sports-fifa-23-pc-game-origin-cover.jpg', 'EA App', 'ea', 'GLOBAL', 59.99, 12.50, 79, 1.37, 4821, 'Eneba', null],
            ['EA SPORTS FIFA 23 PS5 Key EUROPE', 'https://gaming-cdn.com/images/products/8468/616x353/ea-sports-fifa-23-pc-game-origin-cover.jpg', 'PlayStation', 'playstation', 'EUROPE', 79.99, 19.99, 75, 2.20, 3102, 'Gamivo', null],
            ['EA SPORTS FIFA 23 Xbox One/Series X|S Key EUROPE', 'https://gaming-cdn.com/images/products/8468/616x353/ea-sports-fifa-23-pc-game-origin-cover.jpg', 'Xbox Live', 'xbox', 'EUROPE', 69.99, 14.75, 78, 1.62, 2210, 'CDKeys', null],
            // Red Dead Redemption 2
            ['Red Dead Redemption 2 PC Rockstar Key GLOBAL', 'https://gaming-cdn.com/images/products/876/616x353/red-dead-redemption-2-pc-game-rockstar-games-launcher-cover.jpg', 'Rockstar', 'rockstar', 'GLOBAL', 59.99, 14.99, 75, 1.65, 7834, 'Eneba', null],
            ['Red Dead Redemption 2 PS4 Key EUROPE', 'https://gaming-cdn.com/images/products/876/616x353/red-dead-redemption-2-pc-game-rockstar-games-launcher-cover.jpg', 'PlayStation', 'playstation', 'EUROPE', 39.99, 11.50, 71, 1.26, 5610, 'G2A', null],
            ['Red Dead Redemption 2 Xbox One Key GLOBAL', 'https://gaming-cdn.com/images/products/876/616x353/red-dead-redemption-2-pc-game-rockstar-games-launcher-cover.jpg', 'Xbox Live', 'xbox', 'GLOBAL', 39.99, 12.99, 67, 1.43, 3977, 'Kinguin', null],
        ];

        for (const g of games) {
            await run(
                `INSERT INTO games (name, image_url, platform, platform_icon, region, original_price, price, discount_pct, cashback, likes, seller, badge)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                g
            );
        }
        console.log('Database seeded with', games.length, 'games.');
    }
}

module.exports = { db, run, all, init };
