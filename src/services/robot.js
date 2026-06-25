const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function ejecutarExtraccion(urlObjetivo) {
    let navegador;

    try {
        navegador = await puppeteer.launch({headless: 'shell'});
        const pagina = await navegador.newPage();
        const tiempoInicio = Date.now();
        const respuestaRed = await pagina.goto(urlObjetivo, {waitUntil: 'networkidle2'});
        const codigoHtml = await pagina.content();
        const tiempoRespuestaMs = Date.now() - tiempoInicio;
        const certSslVigente = respuestaRed.securityDetails() !== null;
        const pesoDocumentoKb = (Buffer.byteLength(codigoHtml, 'utf-8') / 1024).toFixed(2);
        const $ = cheerio.load(codigoHtml);
        const tituloPagina = $('title').text().trim() || 'Sin título';
        const descripcionPagina = $('meta[name="description"]').attr('content') || 'Sin descripción';
        let frameworkFront = 'Desconocido';
        if ($('[data-reactroot], #root').length > 0) frameworkFront = 'React';
        else if ($('[data-v-app], #root').length > 0) frameworkFront = 'Vue';
        else if ($('[ng-version], #root').length > 0) frameworkFront = 'Angular';
        let lenguaje = 'HTML Estático / Desconocido';
        if ($('meta[name="generator"]').attr('content')?.toLocaleLowerCase().includes('wordpress')){
            lenguaje = 'PHP (Wordpress)';
        }
        const servidor = respuestaRed.headers()['server'] || 'Oculto';
        await navegador.close();
        return {
            identidad: {
                titulo: tituloPagina,
                descripcion: descripcionPagina
            },
            tecnologias: {
                servidor: servidor,
                lenguaje: lenguaje,
                frameworkFront: frameworkFront
            },
            metricas: {
                tiempoRespuestaMs: tiempoRespuestaMs,
                pesoDocumentoKb: pesoDocumentoKb,
                certSslVigente: certSslVigente
            }
        };
    } catch(error) {
        if (navegador) {
            await navegador.close();
        }
        throw new Error('Falla en la intercepción de datos. Objetivo inalcanzable.');
    }
}

module.exports = { ejecutarExtraccion };