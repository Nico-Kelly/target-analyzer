const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function ejecutarEscaneo(urlObjetivo) {
    console.log(`\n[ROBOT]: Desplegando unidad hacia -> ${urlObjetivo}`);
    let navegador;
    
    try {
        // Configuramos la ventana del robot a 1080p para buenas capturas
        navegador = await puppeteer.launch({ headless: true });
        const pagina = await navegador.newPage();
        await pagina.setViewport({ width: 1920, height: 1080 });
        await pagina.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
        
        // networkidle2 espera a que termine de cargar la mayoría de las imágenes
        await pagina.goto(urlObjetivo, { waitUntil: 'networkidle2', timeout: 30000 });
        
        /* -- MISIÓN PANEL 1: FOTOGRAFÍA SATELITAL -- */
        console.log(`[ROBOT]: Tomando captura visual...`);
        // Extraemos la imagen directo en texto Base64
        const fotoBase64 = await pagina.screenshot({ encoding: 'base64' });

        const htmlCrudo = await pagina.content();
        await navegador.close();

        console.log(`[ANALISTA]: Procesando DOM extraído...`);
        const $ = cheerio.load(htmlCrudo);

        /* -- MISIÓN PANEL 2: HUELLAS TECNOLÓGICAS -- */
        const tecsDetectadas = [];
        // Buscamos rastros clásicos en el DOM de los frameworks más famosos
        if ($('script[src*="react"]').length || $('[data-reactroot]').length) tecsDetectadas.push('React');
        if ($('script[src*="vue"]').length || $('[data-v-]').length) tecsDetectadas.push('Vue.js');
        if ($('script[src*="next"]').length || $('#__next').length) tecsDetectadas.push('Next.js');
        if ($('link[href*="wp-content"]').length) tecsDetectadas.push('WordPress');
        if ($('meta[name="generator"]').length) tecsDetectadas.push($('meta[name="generator"]').attr('content'));
        
        // Limpiamos duplicados y armamos el string
        const stackFinal = tecsDetectadas.length > 0 ? [...new Set(tecsDetectadas)].join(' | ') : 'Arquitectura Custom o Blindada';

        /* -- MISIÓN PANEL 3: MAPA DE ENLACES ABSOLUTOS -- */
        const enlacesUnicos = new Set();
        $('a').each((_, el) => {
            const link = $(el).attr('href');
            // Solo agarramos enlaces reales que arranquen con http
            if (link && link.startsWith('http')) enlacesUnicos.add(link);
        });
        const mapaEnlaces = Array.from(enlacesUnicos).slice(0, 15); // Top 15 para la UI

        /* -- MISIÓN PANEL 4: ANÁLISIS DE FRECUENCIA LÉXICA -- */
        // Extraemos todo el texto visible, lo pasamos a minúsculas
        const textoPlano = $('body').text().toLowerCase();
        // Recortamos solo palabras de 5 letras o más (para ignorar conectores como "el", "de", "con")
        const palabras = textoPlano.match(/[a-záéíóúñ]{5,}/g) || [];
        
        const contadorLexico = {};
        palabras.forEach(palabra => {
            contadorLexico[palabra] = (contadorLexico[palabra] || 0) + 1;
        });

        // Ordenamos por las más repetidas y sacamos el Top 5
        const topPalabras = Object.entries(contadorLexico)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(item => `[${item[0].toUpperCase()}]: ${item[1]} usos`);

        // Devolvemos el reporte completo
        return {
            estado: 'EXITO',
            vista: fotoBase64,
            tecnologia: stackFinal,
            enlaces: mapaEnlaces,
            metricas: topPalabras,
            objetivo: urlObjetivo
        };

    } catch (error) {
        if (navegador) await navegador.close();
        console.error(`[CRÍTICO]: Fallo en la extracción.`, error.message);
        return { estado: 'FALLO', mensaje: 'Escudo detectado o Timeout. El objetivo repelió el ataque.' };
    }
}

module.exports = { ejecutarEscaneo };