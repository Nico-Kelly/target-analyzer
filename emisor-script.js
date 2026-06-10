const inputObjetivo = document.getElementById('target-url');
const botonEscaneo = document.getElementById('btn-scan');
const panelVista = document.querySelector('#panel-vista .contenido-panel');
const panelTech = document.querySelector('#panel-tech .contenido-panel');
const panelEnlaces = document.querySelector('#panel-enlaces .contenido-panel');
const panelMetricas = document.querySelector('#panel-metricas .contenido-panel');

botonEscaneo.addEventListener('click', iniciarOperacion);

async function iniciarOperacion(evento) {
    if(evento) evento.preventDefault(); 
    const urlIngresada = inputObjetivo.value;

    if (urlIngresada === '') {
        alert('[ERROR TÁCTICO]: Ingrese un dominio objetivo válido.');
        return;
    }

    const mensajeCarga = '<span style="color: var(--color-alerta)">[CONECTANDO SONDAS...]</span>';
    panelVista.innerHTML = mensajeCarga;
    panelTech.innerHTML = mensajeCarga;
    panelEnlaces.innerHTML = mensajeCarga;
    panelMetricas.innerHTML = mensajeCarga;
    inputObjetivo.value = '';

    try {
        const respuesta = await fetch('http://localhost:3000/api/escanear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlIngresada })
        });

        const datos = await respuesta.json();

        if (datos.estado === 'EXITO') {
            // PANEL 1: Dibujamos la imagen Base64
            panelVista.innerHTML = `<img src="data:image/png;base64,${datos.vista}" alt="Captura del objetivo" style="width: 100%; height: auto; border-radius: 4px; box-shadow: 0 0 10px rgba(0,255,0,0.2);">`;
            
            // PANEL 2: Tecnología
            panelTech.innerHTML = `<span style="color: var(--color-terminal)">> Analizando stack...<br><br>[DETECTADO]: ${datos.tecnologia}</span>`;
            
            // PANEL 3: Enlaces (Iteramos la lista)
            let htmlEnlaces = '<ul>';
            datos.enlaces.forEach(link => {
                htmlEnlaces += `<li style="margin-bottom: 8px;"><a href="${link}" target="_blank" style="color: var(--color-terminal); text-decoration: none;">🔗 ${link}</a></li>`;
            });
            htmlEnlaces += '</ul>';
            panelEnlaces.innerHTML = datos.enlaces.length > 0 ? htmlEnlaces : `<span style="color: var(--color-terminal)">No se extrajeron enlaces externos.</span>`;
            
            // PANEL 4: Métricas Léxicas (Iteramos el top 5)
            let htmlMetricas = '<span style="color: var(--color-terminal)">> Frecuencia Léxica (Palabras 5+ letras):<br><br></span><ul>';
            datos.metricas.forEach(metrica => {
                htmlMetricas += `<li style="color: var(--color-terminal); margin-bottom: 4px;">🎯 ${metrica}</li>`;
            });
            htmlMetricas += '</ul>';
            panelMetricas.innerHTML = htmlMetricas;

        } else {
            throw new Error(datos.mensaje);
        }

    } catch (error) {
        const errorHtml = `<span style="color: red">[FALLO DE CONEXIÓN]: ${error.message}</span>`;
        panelVista.innerHTML = errorHtml;
        panelTech.innerHTML = errorHtml;
        panelEnlaces.innerHTML = errorHtml;
        panelMetricas.innerHTML = errorHtml;
    }
}