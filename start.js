const { exec } = require('child_process');

const commands = [
    'npm install',
    'node ./server/db/crear_base.js',
    'node ./server/db/populate.js',
    'node ./server/db/ping_equipos.js',
    'node ./server/db/actualizar_estaciones.js',
    'node ./server/db/ver_data.js',
    // Iniciar el servidor en segundo plano
    'node ./server/db/server.js',
    'npm run dev' // Comando para levantar el frontend
];

console.log("Script de base de datos: \n");

function runCommand(command, background = false) {
    return new Promise((resolve, reject) => {
        console.log(`Iniciando: ${command}`);
        const child = exec(command, { detached: background });

        if (background) {
            child.unref(); // Permitir que el proceso principal continúe sin esperar a que termine el hijo
            console.log(`Servidor en segundo plano: ${command}`);
            resolve(); // Resolvemos inmediatamente ya que es un proceso en segundo plano
        } else {
            child.stdout.on('data', (data) => {
                console.log(data);
            });
            child.stderr.on('data', (data) => {
                console.error(`Error: ${data}`);
            });
            child.on('close', (code) => {
                console.log(`Terminó: ${command} con código ${code}`);
                resolve();
            });
        }
    });
}

async function setupProject() {
    for (const command of commands) {
        try {
            // Si el comando es el del servidor, lo ejecutamos en segundo plano
            if (command.includes('server.js')) {
                await runCommand(command, true);
            } else {
                await runCommand(command);
            }
        } catch (error) {
            console.error(error);
            break;
        }
    }
}

setupProject();
