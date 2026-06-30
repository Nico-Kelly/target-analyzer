const { escribirLog } = require('../utils/logger');
// const servicioRobot = require('../services/robot_grupo6')
const servicioRobot = require('../services/robot')
// const servicioRobot = require('../services/tp-robot')

const iniciarEscaneo = async (req, res) => {

    try {
        const urlRecibida = req.body.url;
        await escribirLog('INFO', 'PETICIÓN', `Ruta Táctica golpeada: POST 'api/escanear'`);
        await escribirLog('INFO', 'PROCESO', `Objetivo recibido: ${urlRecibida}`);

        const datosEscaneados = await servicioRobot.ejecutarExtraccion(urlRecibida);

        await escribirLog('SUCCESS', 'ROBOT', `El Robot escaneó la URL exitosamente`);

        /*retorno al front*/

        res.json({
            estado: '200',
            mensaje: '[Enlace establecido]: Escaneo completado',
            identidad: datosEscaneados.identidad,
            tecnologias: datosEscaneados.tecnologias,
            metricas: datosEscaneados.metricas
        });

        await escribirLog('INFO', 'RETORNO', `Despachando JSON hacia el Frontend. Estado: 200`)

    } catch (error) {

        await escribirLog('ERROR', 'SISTEMA', `Falla crítica en el escaneo ${error.message}`);

        res.status(500).json({
            estado: 'ERROR',
            mensaje: 'Falla de comunicación con el escuadrón táctico',
            error: error.message
        });

    }



};

const avisarEstadoOK = async (req, res) => {
    await escribirLog('INFO', 'PETICIÓN', 'Estado de API');
    await escribirLog('SUCCESS', 'API Endpoint', `El endpoint respondio exitosamente`);

    res.json({
        estado: '200',
        mensaje: 'API funcionando',
        servicio: 'robot-scanner',
        fecha: new Date().toISOString()
    });
}

module.exports = {
    iniciarEscaneo,
    avisarEstadoOK
}