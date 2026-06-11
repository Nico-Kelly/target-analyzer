// Capturamos los elementos principales de la pantalla
const landing = document.getElementById('viewport-landing');
const dashboard = document.getElementById('viewport-dashboard');
const startBtn = document.getElementById('start-attack');
const urlInput = document.getElementById('target-input');
const themeToggle = document.getElementById('theme-toggle');

// Función auxiliar para volver a la pantalla de inicio
function goToHome() {
    landing.style.display = 'flex'; 
    dashboard.style.display = 'none'; 
    if (urlInput) urlInput.value = '';
}

// Botón de logo vuelve a inicio
const logo = document.querySelector('.logo');
if (logo) logo.addEventListener('click', goToHome);

// Alternar Modo Oscuro / Claro
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i> Light' : '<i class="fas fa-moon"></i> Dark';
});

// ==========================================
// FUNCIÓN PRINCIPAL: INICIAR ANÁLISIS
// ==========================================
async function startAnalysis() {
    let target = urlInput.value.trim();
    if (!target) return alert("Ingrese un objetivo válido");
    
    if (!target.startsWith('http')) target = 'https://' + target;

    // 1. Cambio de Pantalla
    landing.style.display = 'none';
    dashboard.style.display = 'flex';

    // 2. Capturamos las 4 cajas vacías
    const vistaContent = document.getElementById('vista-content');
    const techContent = document.getElementById('tech-content');
    const linksContent = document.getElementById('links-content');
    const metricsContent = document.getElementById('metrics-content');
    
    // 3. Mostramos estado de "Loading"
    vistaContent.innerHTML = '<div class="info-line">Desplegando robot...</div>';
    techContent.innerHTML = '<div class="info-line">Escaneando huellas...</div>';
    linksContent.innerHTML = '<div class="info-line">Rastreando enlaces...</div>';
    metricsContent.innerHTML = '<div class="info-line">Procesando dom...</div>';

    startBtn.disabled = true;

    try {
        // --------------------------------------------------
        // CONEXIÓN CON EL BÚNKER CENTRAL (PUPPETEER)
        // --------------------------------------------------
        const urlDelBackend = 'http://localhost:3000/api/escanear'; 
        
        const response = await fetch(urlDelBackend, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: target })
        });

        const datosReales = await response.json();

        // Verificamos si el backend reportó que las defensas bloquearon el ataque
        if (datosReales.estado === 'FALLO') throw new Error(datosReales.mensaje);

        // --------------------------------------------------
        // REPARTIMOS LA DATA AL DOM DE TU COMPAÑERO
        // --------------------------------------------------

        // PANEL 1: CARRUSEL (Adaptado a tu imagen Base64)
        vistaContent.innerHTML = `
            <div class="info-line">Objetivo: ${target}</div>
            <div class="carousel-container" style="margin-top: 10px;">
                <img class="carousel-item" src="data:image/png;base64,${datosReales.vista}" alt="Screenshot satelital" style="width: 100%; border-radius: 5px;">
            </div>
        `;

        // PANEL 2: BADGES TECNOLÓGICOS (Separamos tu string en un array para sus badges)
        const tecnologias = datosReales.tecnologia.split(' | ');
        techContent.innerHTML = `
            <div class="info-line">Stack detectado:</div>
            <div style="margin-top: 10px;">${tecnologias.map(t => `<span class="tech-badge" style="display:inline-block; margin: 2px;">${t}</span>`).join('')}</div>
        `;

        // PANEL 3: ENLACES
        const enlaces = datosReales.enlaces || [];
        let linksHtml = `<div class="info-line">Total: ${enlaces.length} enlaces encontrados</div>`;
        enlaces.forEach(link => {
            linksHtml += `<div style="margin-top: 5px;"><a href="${link}" target="_blank" class="link-item">${link}</a></div>`;
        });
        linksContent.innerHTML = linksHtml;

        // PANEL 4: MÉTRICAS (Adaptado a tu Top Léxico en lugar de las barras CSS)
        const metricasLexicas = datosReales.metricas || [];
        let htmlMetricas = `<div class="info-line">Top Léxico (>5 letras):</div><ul style="margin-top: 10px; padding-left: 15px;">`;
        metricasLexicas.forEach(metrica => {
            htmlMetricas += `<li style="margin-bottom: 5px; opacity: 0.9;">🎯 ${metrica}</li>`;
        });
        htmlMetricas += `</ul>`;
        metricsContent.innerHTML = htmlMetricas;

    } catch (error) {
        console.error("Fallo:", error);
        const errHtml = `<div class="info-line" style="color: red; font-weight: bold;">[ERROR TÁCTICO]: ${error.message}</div>`;
        vistaContent.innerHTML = errHtml;
        techContent.innerHTML = errHtml;
        linksContent.innerHTML = errHtml;
        metricsContent.innerHTML = errHtml;
    } finally {
        startBtn.disabled = false;
    }
}

startBtn.addEventListener('click', startAnalysis);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startAnalysis();
});

// Iniciamos la app
landing.style.display = 'flex';
dashboard.style.display = 'none';