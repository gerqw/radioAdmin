const sqlite3 = require('sqlite3').verbose();
const ping = require('ping');

const db = new sqlite3.Database('../../torres.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos SQLite.');
});

//ping IP
async function hacerPing(ip) {
    try {
        const res = await ping.promise.probe(ip);
        return res.alive; 
    } catch (error) {
        console.error(`Error haciendo ping a ${ip}:`, error);
        return false; 
    }
}

async function actualizarEstaciones() {
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

        db.all("SELECT DISTINCT idEstacion FROM equipos", async (err, filasEstaciones) => {
            if (err) {
                console.error(err.message);
                return;
            }

            for (const filaEstacion of filasEstaciones) {
                const idEstacion = filaEstacion.idEstacion;

                db.all("SELECT ping FROM equipos WHERE idEstacion = ?", [idEstacion], async (err, filas) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }

                    const estados = filas.map(row => row.ping);
                    const todosTrue = estados.every(state => state === 1);

                    const nuevoEstado = todosTrue ? 1 : 0; 
                    db.run(`UPDATE estaciones SET ping = ? WHERE id = ?`, [nuevoEstado, idEstacion], (err) => {
                        if (err) {
                            console.error(`Error actualizando el estado de la estación ${idEstacion}:`, err.message);
                        } else {
                            console.log(`Estado de la estación ${idEstacion} actualizado a ${nuevoEstado ? 'true' : 'false'}`);
                        }
                    });
                });
            }          
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Cerrada la conexión a la base de datos.');
            });
        });
    });
}

actualizarEstaciones();
