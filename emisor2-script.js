const inputObjetivo = document.getElementById('target-url');
const botonEscaneo = document.getElementById('btn-scan');
const panelVista = document.querySelector('#panel-vista .contenido-panel');
const panelTech = document.querySelector('#panel-tech .contenido-panel');
const panelEnlaces = document.querySelector('#panel-enlaces .contenido-panel');

/* trigger */
botonEscaneo.addEventListener('click', iniciarOperacion);

/* lógica de comunicación asincrónica */

async function iniciarOperacion() {
    const urlIngresada = inputObjetivo.value;

    if (urlIngresada === '') {
        alert('[Error Táctico]: ingrese un dominio objectivo válido');
        return;
    }

    /* inyección dinámica (simulación de carga) */

    panelVista.innerHTML = '<span style="color: var(--color-alerta)">[CONECTANDO SONDAS]</span>';
    panelTech.innerHTML = '<span style="color: var(--color-alerta)">[Enviando Paquete al servidor...]</span>';
    inputObjetivo.value = '';

    /* disparo a la red, el famoso fetch. */

    try {
        const respuesta = await fetch('http://localhost:3000/api/escanear',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: urlIngresada})
        });

        const datos = await respuesta.json();

        /* impacto en el tablero */
        panelTech.innerHTML = `<span style="color: var(--color-terminal)">${datos.mensaje}</span>`;
        panelEnlaces.innerHTML = `<span style="color: var(--color-terminal)"> Objetivo en servidor:${datos.objetivo}</span>`;
    } catch (error) {
        panelTech.innerHTML = (`<span style="color: red">[Fallo de conexión con Búnker central] </span>`)
    }
}

