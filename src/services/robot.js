async function ejecutarExtraccion(urlObjetivo) {
    try {
        console.log("[DEBUG] Disparando fetch a G4...");
        
        const respuesta = await fetch('http://127.0.0.1:3001/api/v1/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url: urlObjetivo,
                options: {
                    topWordsLimit: 10,
                    linksLimit: 50
                }
            }) 
        });

        if (!respuesta.ok) {
            throw new Error(`El escuadrón G4 reportó un error HTTP: ${respuesta.status}`);
        }

        const datosCrudos = await respuesta.json();
        return datosCrudos;

    } catch (error) {
        throw new Error(`Falla de comunicación con G4: ${error.message}`);
    }
}

module.exports = { ejecutarExtraccion };