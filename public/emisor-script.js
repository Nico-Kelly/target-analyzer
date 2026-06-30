const inputObjetivo = document.getElementById('target-url');
const botonEscaneo = document.getElementById('btn-scan');
const panelVista = document.querySelector('#panel-vista .contenido-panel');
const panelTech = document.querySelector('#panel-tech .contenido-panel');
const panelEnlaces = document.querySelector('#panel-enlaces .contenido-panel');
const panelMetricas = document.querySelector('#panel-metricas .contenido-panel'); 

/* trigger */
botonEscaneo.addEventListener('click', iniciarOperacion);

/* lógica de comunicación asincrónica */
async function iniciarOperacion() {
    const urlIngresada = inputObjetivo.value;

    if (urlIngresada === '') {
        alert('[Error Táctico]: ingrese un dominio objetivo válido');
        return;
    }

    /* inyección dinámica (simulación de carga) */
    panelVista.innerHTML = '<span style="color: var(--color-alerta)">[CONECTANDO SONDAS...]</span>';
    panelTech.innerHTML = '<span style="color: var(--color-alerta)">[Analizando arquitectura...]</span>';
    panelEnlaces.innerHTML = '<span style="color: var(--color-alerta)">[Rastreando objetivo...]</span>';
    if (panelMetricas) panelMetricas.innerHTML = '<span style="color: var(--color-alerta)">[Calculando latencia...]</span>';
    
    /* disparo a la red, el famoso fetch. */
    try {
        const respuesta = await fetch('http://localhost:3000/api/escanear',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: urlIngresada})
        });

        const datos = await respuesta.json();

        // Si la aduana tira un 500 (falla del robot)
        if (datos.estado === 'ERROR') {
            panelVista.innerHTML = `<span style="color: red">[FALLO]: ${datos.mensaje}</span>`;
            return;
        }

        // ==========================================
        // actualización para poder mostrar imagenes en el panelvistas
        // ==========================================
        if (datos.vista_objetivo && datos.vista_objetivo !== "No disponible") {
            panelVista.innerHTML = `
                <div style="text-align: center;">
                    <span style="color: var(--color-terminal)">TÍTULO: ${datos.identidad.titulo}</span><br><br>
                    <img 
                        src="${datos.vista_objetivo}" 
                        alt="Captura del objetivo" 
                        style="max-width: 100%; border: 1px solid var(--color-terminal); border-radius: 4px;"
                    >
                </div>
            `;
        } else {

            panelVista.innerHTML = `
                <span style="color: var(--color-terminal)">TÍTULO:<br>${datos.identidad.titulo}</span><br><br>
                <span style="color: red;">[ALERTA]: Captura de pantalla no disponible.</span>
            `;
        }
        // ==========================================

        panelTech.innerHTML = `
            <span style="color: var(--color-terminal)">
                SERVIDOR: ${datos.tecnologias.servidor} <br>
                LENGUAJE: ${datos.tecnologias.lenguaje} <br>
                FRONTEND: ${datos.tecnologias.frameworkFront}
            </span>`;

        // 
        panelEnlaces.innerHTML = `
            <span style="color: var(--color-terminal)">
                OBJETIVO FIJADO: <br>${urlIngresada}<br><br>
                TOTAL ENLACES: ${datos.analisis_enlaces?.total_links || 0}<br>
                LINKS INTERNOS: ${datos.analisis_enlaces?.links_internos || 0}<br>
                HTTP INSEGUROS: ${datos.analisis_enlaces?.alertas_links_inseguros_http || 0}
            </span>`;

        if (panelMetricas) {
            panelMetricas.innerHTML = `
                <span style="color: var(--color-terminal)">
                    LATENCIA: ${datos.metricas.tiempoRespuestaMs}ms <br>
                    PESO: ${datos.metricas.pesoDocumentoKb} KB <br>
                    SSL: ${datos.metricas.certSslVigente ? 'SEGURO' : 'VULNERABLE'}
                </span>`;
        }

    } catch (error) {
        panelTech.innerHTML = `<span style="color: red">[Fallo crítico de conexión con Búnker central]</span>`;
        console.error(error); 
    }
}