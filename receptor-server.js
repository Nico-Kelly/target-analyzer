const express = require('express');
const cors = require('cors');
const app = express();
const PUERTO = 3002;
const { ejecutarEscaneo } = require('./crawler-service');
/* configuracion de middlewares */
app.use(cors());
app.use(express.json());

/* receptor */

app.post('/api/escanear', async (req, res) => {
    const urlRecibida = req.body.url;
    console.log(`objetivo recibido en coordenadas: ${urlRecibida}`);


    const reporteInteligencia = await ejecutarEscaneo(urlRecibida);
    
    /* retorno al front */

    /* res.json({
        estado: 'EXITO',
        mensaje: '[Enlace establecido]: Servidor a la espera del robot',
        objetivo: urlRecibida
    });*/

    res.json(reporteInteligencia);
});

/* puesta en marcha del server  */

app.listen(PUERTO, () => {
    console.log(`[Búnker Central]: Escuchando comunicaciones en puerto ${PUERTO}`);
});




