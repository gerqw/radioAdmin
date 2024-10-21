const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

// Habilita CORS para todas las rutas
app.use(cors({
    origin: 'http://localhost:5173'
}));

const PORT = 3000;

const db = new sqlite3.Database('../../torres.db');

app.use(express.static('public'));

app.get('/estaciones', (req, res) => {
    db.all(`SELECT estacion, gps, ping FROM estaciones`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => ({
            estacion: row.estacion,
            gps: JSON.parse(row.gps), 
            ping: row.ping === 1 
        })));
    });
});


app.get('/equipos', (req, res) => {
    const query = `
        SELECT e.estacion, e.gps, e.ping, eq.nombre, eq.ip, eq.ping AS ping_equipo
        FROM estaciones e
        LEFT JOIN equipos eq ON e.id = eq.idEstacion
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const estaciones = {};
        rows.forEach(row => {
            if (!estaciones[row.estacion]) {
                estaciones[row.estacion] = {
                    estacion: row.estacion,
                    gps: JSON.parse(row.gps),
                    ping: row.ping === 1,
                    equipos: []
                };
            }

            if (row.nombre) {
                estaciones[row.estacion].equipos.push({
                    nombre: row.nombre,
                    ip: row.ip,
                    ping: row.ping_equipo === 1
                });
            }
        });

        res.json(Object.values(estaciones));
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
