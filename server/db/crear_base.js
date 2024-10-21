const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbPath = './server/db/torres.db';

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Base de datos anterior eliminada.');
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la nueva base de datos SQLite.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS estaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estacion TEXT NOT NULL,
        gps TEXT NOT NULL,
        ping BOOLEAN NOT NULL
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS equipos (
        idEstacion INTEGER,
        nombre TEXT NOT NULL,
        ip TEXT NOT NULL,
        ping BOOLEAN NOT NULL,
        FOREIGN KEY (idEstacion) REFERENCES estaciones (id)
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Cerrada la conexión a la base de datos.');
});
