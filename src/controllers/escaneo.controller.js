const iniciarEscaneo = (req, res) => {
    const urlRecibida = req.body.url;
    console.log(`[ADUANA]: Objetivo recibido en coordenadas: ${urlRecibida}`);


    /*retorno al front*/

    res.json({
        estado: '200',
        mensaje: '[Enlace establecido: Servidor a la espera del robot',
        objetivo: urlRecibida
    });
};

module.exports = {
    iniciarEscaneo
}
