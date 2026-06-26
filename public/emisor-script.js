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

    

        panelVista.innerHTML = `<span style="color: var(--color-terminal)">TÍTULO:<br>${datos.identidad.titulo}</span>`;

        panelTech.innerHTML = `
            <span style="color: var(--color-terminal)">
                SERVIDOR: ${datos.tecnologias.servidor} <br>
                LENGUAJE: ${datos.tecnologias.lenguaje} <br>
                FRONTEND: ${datos.tecnologias.frameworkFront}
            </span>`;

        panelEnlaces.innerHTML = `
            <span style="color: var(--color-terminal)">
                OBJETIVO FIJADO:<br>${urlIngresada}
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
        console.error(error); // Clave dejarlo para espiar errores con F12
    }
}