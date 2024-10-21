const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/db/torres.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a SQLite.');
});

db.all(`SELECT * FROM estaciones`, [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log('Datos de estaciones:');
    rows.forEach((row) => {
        console.log(row);
    });
});

db.all(`SELECT * FROM equipos`, [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log('Datos de equipos:');
    rows.forEach((row) => {
        console.log(row);
    });
});

db.close();
