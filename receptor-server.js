const express = require('express');
const cors = require('cors');
const app = express();
const PUERTO = 3000;

/* configuracion de middlewares */
app.use(cors());
app.use(express.json());

/* receptor */

app.post('/api/escanear', (req, res) => {
    const urlRecibida = req.body.url;
    console.log(`objetivo recibido en coordenadas: ${urlRecibida}`);

    /* retorno al front */

    res.json({
        estado: 'EXITO',
        mensaje: '[Enlace establecido]: Servidor a la espera del robot',
        objetivo: urlRecibida
    });
});

/* puesta en marcha del server  */

app.listen(PUERTO, () => {
    console.log(`[Búnker Central]: Escuchando comunicaciones en puerto ${PUERTO}`);
});




