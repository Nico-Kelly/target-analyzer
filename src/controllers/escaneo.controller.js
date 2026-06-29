const { escribirLog } = require('../utils/logger');
const servicioRobot = require('../services/robot')
const { verificarContraespionaje } = require('../utils/contraespionaje');
const iniciarEscaneo = async (req, res) => {

    try {
        const urlRecibida = req.body.url;
        await escribirLog('INFO', 'PETICIÓN', `Ruta Táctica golpeada: POST 'api/escanear'`);
        await escribirLog('INFO', 'PROCESO', `Objetivo recibido: ${urlRecibida}`);

        const datosEscaneados = await servicioRobot.ejecutarExtraccion(urlRecibida);

        await escribirLog('SUCCESS', 'ROBOT', `El Robot escaneó la URL exitosamente`);

        // VERIFICACIÓN DE CONTRAESPIONAJE
        if (verificarContraespionaje()) {
            await escribirLog('ALERTA', 'SEGURIDAD', `Contraespionaje detectado en objetivo: ${urlRecibida}`);
            return res.json({
                estado: 'CONTRAESPIONAJE_DETECTADO',
                mensaje: 'Counterintelligence protocols triggered. Please retry your request in 30 seconds while we finalize internal security measures.',
                tiempoBloqueo: 30
            });
        }

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

module.exports = {
    iniciarEscaneo
}
