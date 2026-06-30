// ====================================================================
// Importaciones básicas (Para todo el equipo)
// ====================================================================
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

/**
 * Función principal del Robot
 * @param {string} direccionObjetivo - URL que envía el grupo de Backend
 */
async function ejecutarExtraccion(direccionObjetivo) {
    let navegador;
    
    // --- [ZONA - TRABAJO PAREJA 4 (Inicio): Tomar tiempo inicial] ---
    const tiempoInicio = Date.now();
    
    try {
        // --- [ZONA - TRABAJO PAREJA 1: Iniciar Puppeteer y navegar] ---
        // Levantamos el navegador en segundo plano (modo invisible)
        navegador = await puppeteer.launch({ headless: 'shell' });
        
        // Abrimos una nueva pestaña en ese navegador virtual
        const pagina = await navegador.newPage();
        
        // Navegamos a la URL objetivo esperando que la red se estabilice
        const respuestaRed = await pagina.goto(direccionObjetivo, { waitUntil: 'networkidle2' });
        
        // Extraemos el código fuente HTML completamente renderizado
        const codigoHtml = await pagina.content();
        
        
        // --- [ZONA - TRABAJO PAREJA 2: Cargar Cheerio y extraer Identidad] ---
        // Cargamos el HTML obtenido en el motor rápido de Cheerio
        const $ = cheerio.load(codigoHtml);
        
        // Extraemos el título del sitio limpiando espacios vacíos
        const tituloPagina = $('title').text().trim() || 'Sin título';
        
        // Extraemos la descripción desde las meta-etiquetas
        const descripcionPagina = $('meta[name="description"]').attr('content') || 'Sin descripción';
        
        
        // --- [ZONA - TRABAJO PAREJA 3: Evaluar Frameworks con selectores] ---
        // Buscamos marcas estructurales en el DOM para identificar la tecnología Frontend
        const esReact = $('#root').length > 0 || $('[data-reactroot]').length > 0;
        const esVue = $('#app').length > 0 || $('[data-v-app]').length > 0;
        const esAngular = $('[ng-version]').length > 0;
        
        // Determinamos cuál framework se detectó
        let frameworkDetectado = 'Vanilla JS / Otro';
        if (esReact) frameworkDetectado = 'React';
        if (esVue) frameworkDetectado = 'Vue';
        if (esAngular) frameworkDetectado = 'Angular';
        
        
        // --- [ZONA - TRABAJO PAREJA 4 (Cierre): Métricas, Seguridad y Retorno] ---
        // Calculamos la latencia restando el tiempo actual menos el del inicio
        const latenciaMs = Date.now() - tiempoInicio;
        
        // Calculamos el peso aproximado del HTML convertido a Kilobytes (KB)
        const pesoKb = (Buffer.byteLength(codigoHtml, 'utf8') / 1024).toFixed(2);
        
        // Evaluamos si el sitio cuenta con un certificado SSL activo mediante la respuesta de red
        const detallesSeguridad = respuestaRed ? respuestaRed.securityDetails() : null;
        const tieneSsl = detallesSeguridad !== null;
        
        // RETORNO FINAL DEL MVP: Enviamos el JSON estructurado con la información ordenada
        return {
            identidad: {
                titulo: tituloPagina,
                descripcion: descripcionPagina
            },
            tecnologias: {
                framework: frameworkDetectado
            },
            metricas: {
                latencia: `${latenciaMs}ms`,
                tamanoHtml: `${pesoKb} KB`,
                sslActivo: tieneSsl
            }
        };
        
    } catch (error) {
        console.error("Error crítico en la ejecución del robot:", error);
        throw error;
    } finally {
        // --- [ZONA - TRABAJO PAREJA 1: Cerrar el navegador] ---
        // Nos aseguramos de apagar el navegador virtual pase lo que pase para liberar memoria RAM
        if (navegador) {
            await navegador.close();
        }
    }
}

// ====================================================================
// CIERRE: Exportación del módulo para el grupo de Backend
// ====================================================================
module.exports = { ejecutarExtraccion };


// // ====================================================================
// //  SIMULADOR DE BACKEND (Para probar nuestro MVP de forma autónoma)
// // ====================================================================
// // Este bloque simula los llamados del servidor para verificar que el robot funcione.

// async function probarNuestroMvp() {
//     console.log("\n [Simulador] Iniciando prueba autónoma del Robot...");
    
//     // Podés cambiar esta URL por la que quieras testear (ej: https://react.dev para ver si detecta React)
//     const urlPrueba = "https://unpilar.edu.ar"
//     console.log(` [Simulador] Escaneando el sitio: ${urlPrueba}\n`);
    
//     try {
//         const jsonResultado = await ejecutarExtraccion(urlPrueba);
        
//         console.log("=======================================================");
//         console.log("✅ ¡MVP COMPLETO TRABAJANDO! El robot devolvió este JSON:");
//         console.log("=======================================================");
//         console.log(JSON.stringify(jsonResultado, null, 2));
//         console.log("=======================================================\n");
//     } catch (error) {
//         console.error("\n❌ [Simulador] El MVP falló durante la prueba:", error.message);
//     }
// }

// probarNuestroMvp();