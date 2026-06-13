const express = require('express');
const cors = require('cors');
const rutasEscaneo = require('./src/routes/escaneo.routes');

const app = express();
const PUERTO = 3000;

//middlewares

app.use(cors());
app.use(express.json());

//conexión con el Front-End
app.use(express.static('public'));

app.use('/api', rutasEscaneo);


app.listen(PUERTO, () => {
    console.log(`[Búnker Central]: Escuchando comunicaciones en el puerto ${PUERTO}`);
})