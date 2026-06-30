async function ejecutarExtraccion(urlObjetivo) {
    // 1. Instanciamos el controlador de aborto
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 segundos de límite

    try {
        console.log("[DEBUG] Disparando fetch a G4 con timeout de 20s...");
        
        const respuesta = await fetch('http://127.0.0.1:3001/api/v1/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url: urlObjetivo,
                options: {
                    topWordsLimit: 10,
                    linksLimit: 50
                }
            }),
            signal: controller.signal // 2. Le atamos el controlador al fetch
        });

        clearTimeout(timeoutId); // 3. Si respondió a tiempo, cancelamos la cuenta regresiva

        if (!respuesta.ok) {
            throw new Error(`El escuadrón G4 reportó un error HTTP: ${respuesta.status}`);
        }

        const datosCrudos = await respuesta.json();
        return datosCrudos;

    } catch (error) {
        clearTimeout(timeoutId); // Limpiamos por las dudas si explotó por otra cosa
        
        // 4. Atrapamos el error específico del timeout
        if (error.name === 'AbortError') {
            throw new Error('TIMEOUT: El robot táctico tardó demasiado en responder (límite de 20s excedido).');
        }
        
        throw new Error(`Falla de comunicación con G4: ${error.message}`);
    }
}

module.exports = { ejecutarExtraccion };