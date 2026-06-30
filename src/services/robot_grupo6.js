// Importamos la librería de parseo rápido para estructurar el HTML estático en memoria
const cheerio = require('cheerio');
// Importamos el motor de automatización para controlar el navegador en segundo plano
const puppeteer = require('puppeteer');
// Definimos la función principal asincrónica que recibe la URL a escanear
async function ejecutarExtraccion(urlObjetivo) {
  // Inicializamos la variable del navegador fuera del bloque try para cerrarla en el catch
  let navegador;
  try {
    // Lanzamos el binario aislado de Chrome suprimiendo la interfaz gráfica por rendimiento
    navegador = await puppeteer.launch({ headless: 'shell' });
    // Abrimos una pestaña limpia en el motor de renderizado
    const pagina = await navegador.newPage();
    // Registramos la marca de tiempo inicial para calcular la latencia posterior
    const tiempoInicio = Date.now();
    // Ejecutamos la navegación esperando a que el tráfico de red se estabilice
    const respuestaRed = await pagina.goto(urlObjetivo, { waitUntil: 'networkidle2' });
    // Extraemos la fotografía estática del DOM ya renderizado por el motor V8
    const codigoHtml = await pagina.content();
    // Calculamos el tiempo total del proceso de carga en milisegundos
    const tiempoRespuestaMs = Date.now() - tiempoInicio;
    // Verificamos criptográficamente si la conexión HTTPS es válida interceptando la red
    const certSslVigente = respuestaRed.securityDetails() != null;
    // Medimos el peso del documento HTML capturado en kilobytes
    const pesoDocumentoKb = (Buffer.byteLength(codigoHtml, 'utf8') / 1024).toFixed(2);
    // Montamos el código HTML plano en la memoria del servidor usando la función de consulta
    const $ = cheerio.load(codigoHtml);
    // Rastreamos y limpiamos la etiqueta de título directamente de la cabecera
    const tituloPagina = $('title').text().trim() || 'Sin título';
    // Buscamos y aislamos el atributo de contenido dentro del metadato de descripción
    const descripcionPagina = $('meta[name="description"]').attr('content') || 'Sin descripción';
    // Inicializamos la variable del framework asumiendo que no hay coincidencia
    let frameworkFront = 'Desconocido';
    // Evaluamos la existencia estructural de nodos típicos para identificar la tecnología de renderizado
    if ($('#data-reactroot, #root').length > 0) frameworkFront = 'React';
    else if ($('[data-v-app], #app').length > 0) frameworkFront = 'Vue';
    else if ($('[ng-version], ng-app').length > 0) frameworkFront = 'Angular';
    // Asumimos un documento estático por defecto para la variable del lenguaje
    let lenguaje = 'HTML Estático / Desconocido';
    // Normalizamos y leemos el metadato generador para confirmar la presencia de un CMS como WordPress
    if ($('meta[name="generator"]').attr('content')?.toLowerCase().includes('wordpress')) {
      lenguaje = 'PHP (WordPress)';
    }
    // Interceptamos las cabeceras de red puras para identificar el servidor que aloja el sitio
    const servidor = respuestaRed.headers()['server'] || 'Oculto';

    // MÓDULO: EXTRACCIÓN DE SEO Y ACCESIBILIDAD
    // -------------------------------------------
    const conteoH1 = $('h1').length;
    const conteoH2 = $('h2').length;
    const conteoH3 = $('h3').length;
    const conteoH4 = $('h4').length;
    const conteoH5 = $('h5').length;
    const conteoH6 = $('h6').length;
    const tieneOgImage = $('meta[property="og:image"]').length > 0;
    const tieneTwitterCard = $('meta[name="twitter:card"]').length > 0;
    const totalImagenes = $('img').length;
    const imagenesSinAlt = $('img:not([alt])').length;
    // Extraemos el atributo 'lang' de la etiqueta <html> (por defecto 'Desconocido' si no está)
    const idiomaDeclarado = $('html').attr('lang') || 'Desconocido';
    // Verificamos si existe alguna etiqueta de favicon válida
    const tieneFavicon = $('link[rel*="icon"]').length > 0;
    // -------------------------------------------

    // === MÓDULO: ANÁLISIS DE ENLACES ===
const todosLosEnlaces = $('a');
const totalLinks = todosLosEnlaces.length;

let linksInternos = 0;
let linksExternos = 0;
let alertasLinksInsegurosHttp = 0;
let enlacesExternosInseguros = 0; // Declarada globalmente en el módulo

// Recorremos cada enlace encontrado para clasificarlo
todosLosEnlaces.each((index, elemento) => {
    const href = $(elemento).attr('href');
    
    if (href) {
        // Alerta si el enlace usa el protocolo inseguro HTTP en lugar de HTTPS
        if (href.startsWith('http://')) {
            alertasLinksInsegurosHttp++;
        }
        
        // Si empieza con http o https es un enlace absoluto externo
        if (href.startsWith('http://') || href.startsWith('https://')) {
            linksExternos++; 
            
            // CON CUIDADO ACÁ: Evaluamos la seguridad del enlace externo antes de cerrar este bloque
            const rel = $(elemento).attr('rel');
            if (!rel || (!rel.includes('noopener') && !rel.includes('noreferrer'))) {
                enlacesExternosInseguros++;
            }
            
        } else if (href.startsWith('/') || href.startsWith('#') || !href.includes(':')) {
            linksInternos++;
        }
    }
});
    // -------------------------------------------

    // Apagamos la instancia de Chrome para liberar la memoria RAM del equipo
    await navegador.close();
    // Ensamblamos y retornamos el objeto JSON con las tres capas de datos tácticos extraídos
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
      },
      analisis_enlaces: {
        total_links: totalLinks,
        links_internos: linksInternos,
        links_externos: linksExternos,
        alertas_links_inseguros_http: alertasLinksInsegurosHttp,
        enlaces_externos_inseguros: enlacesExternosInseguros
      },
      seo_y_accesibilidad: {
        idioma_declarado: idiomaDeclarado,
        tiene_favicon: tieneFavicon,
        conteo_h1: conteoH1,
        conteo_h2: conteoH2,
        conteo_h3: conteoH3,
        conteo_h4: conteoH4,
        conteo_h5: conteoH5,
        conteo_h6: conteoH6,
        tiene_og_image: tieneOgImage,
        tiene_twitter_card: tieneTwitterCard,
        total_imagenes: totalImagenes,
        imagenes_sin_alt: imagenesSinAlt
      }
    };
  } catch (error) {
    // En caso de falla general, garantizamos que el proceso de Chrome no quede huérfano consumiendo RAM
    if (navegador) {
      await navegador.close();
    }
    // Disparamos la alerta de fallo hacia el servidor receptor deteniendo la ejecución
    throw new Error('Falla en la intercepción de datos. Objetivo inalcanzable.');
  }
}
// Exponemos la función de manera modular para que el archivo de backend principal pueda requerirla
module.exports = {ejecutarExtraccion};