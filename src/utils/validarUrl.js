function validarUrl(url) {
    if (url === undefined || url === null) {
        return {
            valida: false,
            mensaje: 'El campo url es obligatorio'
        };
    }

    if (typeof url !== 'string') {
        return {
            valida: false,
            mensaje: 'El campo url debe ser un texto'
        };
    }

    const urlLimpia = url.trim();

    if (urlLimpia.length === 0) {
        return {
            valida: false,
            mensaje: 'El campo url no puede estar vacío'
        };
    }

    if (urlLimpia.length > 2048) {
        return {
            valida: false,
            mensaje: 'La URL supera la longitud máxima permitida'
        };
    }

    let urlParseada;

    try {
        urlParseada = new URL(urlLimpia);
    } catch (error) {
        return {
            valida: false,
            mensaje: 'La URL enviada no tiene un formato válido'
        };
    }

    if (!['http:', 'https:'].includes(urlParseada.protocol)) {
        return {
            valida: false,
            mensaje: 'La URL debe usar protocolo HTTP o HTTPS'
        };
    }

    if (!urlParseada.hostname) {
        return {
            valida: false,
            mensaje: 'La URL debe contener un dominio o host válido'
        };
    }

    return {
        valida: true,
        url: urlLimpia
    };
}

module.exports = validarUrl;