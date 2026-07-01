const fs = require('fs').promises;
const path = require('path');

//ruta donde guardar el .txt
// const logFilePath = path.join(__dirname, '../../registro_bunker.txt');


const formatearFechaHoraLocal = (fecha) => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

const escribirLog = async (tipoEvento, modulo, mensaje) => {

    try {
        //generamos el timestamp
        const ahora = new Date();

        //formato de la fecha en YYYY-MM-DD HH:MM (después discutimos en grupo como lo dejamos finalmente)
        const fechaArchivo = ahora.toLocaleDateString('sv-SE');
        const fechaHora = formatearFechaHoraLocal(ahora);

        //ruta donde guardar el .txt
        const logsDir = path.join(__dirname, '../logs');
        await fs.mkdir(logsDir, { recursive: true });

        const logFilePath = path.join(logsDir, `registro_bunker_${fechaArchivo}.txt`);

        //armado de estructura
        const lineaLog = `[${fechaHora}] [${tipoEvento}] [${modulo}] ${mensaje}\n`

        //escribimos en el disco duro agregando al final del archivo para no borrar logs anteriores.
        await fs.appendFile(logFilePath, lineaLog, 'utf8');

        console.log(lineaLog.trim());

    } catch (error) {
        console.error('fallo crítico al intentar escribir en la bitácora', error)
    }
};


module.exports = { escribirLog };