const { escribirLog } = require('../utils/logger');
const servicioRobot = require('../services/robot');
const { verificarContraespionaje } = require('../utils/contraespionaje'); // Integración manual de seguridad
const validarUrl = require('../utils/validarUrl');

const iniciarEscaneo = async (req, res) => {
    try {
        const urlRecibida = req.body.url;

        const validacion = validarUrl(urlRecibida);

        if (!validacion.valida) {
            await escribirLog('WARN', 'VALIDACIÓN', `URL rechazada: ${validacion.mensaje}`);

            return res.status(400).json({
                estado: 'ERROR',
                codigo: 400,
                mensaje: validacion.mensaje,
                error: {
                    tipo: 'VALIDATION_ERROR',
                    detalle: validacion.mensaje
                }
            });
        }

        const urlValidada = validacion.url;

        await escribirLog('INFO', 'PETICIÓN', `Golpeando endpoint con URL: ${urlValidada}`);

        // --- INICIO PROTOCOLO DE CONTRAESPIONAJE ---
        // --- PROTOCOLO DE CONTRAESPIONAJE ---
       if (verificarContraespionaje()) {
            await escribirLog('ALERTA', 'SEGURIDAD', `Contraespionaje detectado en objetivo: ${urlValidada}`);

            // Engañamos al Front-End con un Status 200 y el Contrato Sagrado estructurado para asustar
            return res.status(200).json({
                estado: "EXITO",
                mensaje: "[ALERTA MÁXIMA]: Protocolo de seguridad del objetivo comprometido.",
                
                // Panel 1: Mandamos el GIF de la calavera/radar parpadeante
                vista_objetivo: "https://i.gifer.com/Q4P6.gif", 
                
                identidad: {
                    titulo: "⚠️ AMENAZA DETECTADA ⚠️",
                    descripcion: "Triangulando coordenadas de origen del atacante..."
                },
                tecnologias: {
                    servidor: "SISTEMA COMPROMETIDO",
                    lenguaje: "ESTAS SIENDO INVESTIGADO POR: CERN / FBI / GHOST_CORP",
                    frameworkFront: "RASTREO ACTIVO: 100% COMPLETO TÚ IP ES 197.8.8.9"
                },
                metricas: {
                    tiempoRespuestaMs: 666, // Un guiño clásico
                    pesoDocumentoKb: "999.9",
                    certSslVigente: false // El panel va a mostrar "VULNERABLE" en rojo
                },
                analisis_enlaces: {
                    // Inyectamos números de enlaces falsos o códigos binarios rotos en el Panel 3
                    total_links: "403",
                    links_internos: "10101",
                    links_externos: "00000",
                    alertas_links_inseguros_http: "99",
                    enlaces_externos_inseguros: "1337"
                }
            });
        }
        // --- FIN PROTOCOLO DE CONTRAESPIONAJE ---

        // 1. Llamamos al microservicio del G4
        const datosG4 = await servicioRobot.ejecutarExtraccion(urlValidada);

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