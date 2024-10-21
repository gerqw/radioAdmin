const sqlite3 = require('sqlite3').verbose();
const ping = require('ping');

const db = new sqlite3.Database('../../torres.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos SQLite.');
});

async function hacerPing(ip) {
    try {
        const res = await ping.promise.probe(ip);
        return res.alive; 
    } catch (error) {
        console.error(`Error haciendo ping a ${ip}:`, error);
        return false; 
    }
}

db.all("SELECT idEstacion, ip FROM equipos", async (err, filas) => {
    if (err) {
        console.error(err.message);
        return;
    }

    const promesas = filas.map(async (fila) => {
        const resultadoPing = await hacerPing(fila.ip);
        const nuevoEstado = resultadoPing ? 1 : 0; 

        db.run(`UPDATE equipos SET ping = ? WHERE ip = ?`, [nuevoEstado, fila.ip], (err) => {
            if (err) {
                console.error(`Error actualizando el ping de ${fila.ip}:`, err.message);
            } else {
                console.log(`Ping a ${fila.ip} actualizado a ${nuevoEstado ? 'true' : 'false'}`);
            }
        });
    });

    await Promise.all(promesas);
    
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Cerrada la conexión a la base de datos.');
    });
});
