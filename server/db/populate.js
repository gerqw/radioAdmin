const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../torres.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a SQLite.');
});

fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const estaciones = JSON.parse(data);
    const insertPromises = [];

    db.serialize(() => {
        estaciones.forEach(estacion => {
            const nombreEstacion = estacion.estacion;
            const gps = JSON.stringify(estacion.gps);
            const ping = estacion.ping;

            // usa promesa para la estacion (si no las usa no abre la db)
            const promise = new Promise((resolve, reject) => {
                db.run(`INSERT INTO estaciones (estacion, gps, ping) VALUES (?, ?, ?)`, [nombreEstacion, gps, ping], function(err) {
                    if (err) {
                        return reject(err);
                    }
                    const currentIdEstacion = this.lastID;

                    // equipos
                    const equipoPromises = estacion.equipos.map(equipo => {
                        return new Promise((res, rej) => {
                            const nombreEquipo = equipo.nombre;
                            const ip = equipo.ip;
                            const equipoPing = equipo.ping;
                            db.run(`INSERT INTO equipos (idEstacion, nombre, ip, ping) VALUES (?, ?, ?, ?)`, [currentIdEstacion, nombreEquipo, ip, equipoPing], (err) => {
                                if (err) {
                                    return rej(err);
                                }
                                res();
                            });
                        });
                    });

                    // Esperar que todas las inserciones de equipos se completen
                    Promise.all(equipoPromises)
                        .then(resolve)
                        .catch(reject);
                });
            });

            insertPromises.push(promise);
        });

        // Esperar que todas las inserciones de estaciones y equipos se completen
        Promise.all(insertPromises)
            .then(() => {
                db.close();
            })
            .catch(err => {
                console.error(err);
                db.close();
            });
    });
});
