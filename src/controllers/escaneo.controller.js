const { escribirLog } = require('../utils/logger');
const servicioRobot = require('../services/robot');

const iniciarEscaneo = async (req, res) => {
    try {
        const urlRecibida = req.body.url;
        await escribirLog('INFO', 'PETICIÓN', `Golpeando endpoint con URL: ${urlRecibida}`);

        // 1. Llamamos al microservicio del G4
        const datosG4 = await servicioRobot.ejecutarExtraccion(urlRecibida);

        // 2. Si pasamos la extracción, lo dejamos asentado
        await escribirLog('SUCCESS', 'ROBOT', `El microservicio G4 respondió correctamente`);

        // 3. Despachamos al Front-End
        res.status(200).json({
            estado: "EXITO",
            mensaje: "[Enlace establecido]: Escaneo completado con éxito.",
            vista_objetivo: (datosG4.screenshots && datosG4.screenshots.length > 0)
                ? datosG4.screenshots[0]
                : "No disponible",

            identidad: {
                titulo: datosG4.identity?.title || "Sin título",
                descripcion: datosG4.identity?.description || "Sin descripción"
            },
            tecnologias: {
                servidor: datosG4.technologies?.server || "Oculto",
                lenguaje: datosG4.technologies?.language || "Desconocido",
                frameworkFront: datosG4.technologies?.frontendFramework || "Desconocido"
            },
            metricas: {
                tiempoRespuestaMs: datosG4.metrics?.responseTimeMs || 0,
                pesoDocumentoKb: datosG4.metrics?.documentSizeKb || 0,
                certSslVigente: datosG4.metrics?.sslValid || false
            },
            analisis_enlaces: {
                // Ellos mandan la cantidad total en metrics.linkCount
                total_links: datosG4.metrics?.linkCount || 0,
                links_internos: 0,
                links_externos: 0,
                alertas_links_inseguros_http: 0,
                enlaces_externos_inseguros: 0
            }
        });

        await escribirLog('INFO', 'RETORNO', `Despachando JSON hacia el Frontend. Estado: 200`);

    } catch (error) {
        await escribirLog('ERROR', 'SISTEMA', `Falla en escaneo: ${error.message}`);
        res.status(500).json({
            estado: 'ERROR',
            mensaje: 'Falla de comunicación con el escuadrón táctico',
            error: error.message
        });
    }
};

module.exports = { iniciarEscaneo };