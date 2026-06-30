const request = require('supertest');
const app = require('../../receptor-server'); 
const servicioRobot = require('../services/robot');
const contraespionaje = require('../utils/contraespionaje');

// 1. "Mockeamos" los servicios externos para no depender de ellos en los tests
jest.mock('../services/robot');
jest.mock('../utils/contraespionaje');
jest.mock('../utils/logger', () => ({
    escribirLog: jest.fn()
}));


describe('Suite de Pruebas: Controlador de Escaneo', () => {

    // Antes de cada test, nos aseguramos de que el contraespionaje esté APAGADO
    beforeEach(() => {
        contraespionaje.verificarContraespionaje.mockReturnValue(false);
    });

    test('1. Debería rechazar una petición sin URL válida (HTTP 400)', async () => {
        // ejecutamos la petición con Supertest enviando un string vacío
        const respuesta = await request(app)
            .post('/api/escanear')
            .send({ url: '' }); // Simula que el usuario no escribió nada

        // qué esperamos? Que el validarUrl.js haga su trabajo
        expect(respuesta.status).toBe(400);
        expect(respuesta.body.estado).toBe('ERROR');
        expect(respuesta.body.error.tipo).toBe('VALIDATION_ERROR');
    });

    test('2. Debería devolver HTTP 500 si el microservicio del G4 falla o da Timeout', async () => {
        // Forzamos a que el robot tire un error simulado
        servicioRobot.ejecutarExtraccion.mockRejectedValue(new Error('TIMEOUT simulado'));

        const respuesta = await request(app)
            .post('/api/escanear')
            .send({ url: 'https://unpilar.edu.ar' });

        // qué esperamos? Que el Búnker ataje el error y devuelva un 500
        expect(respuesta.status).toBe(500);
        expect(respuesta.body.estado).toBe('ERROR');
        expect(respuesta.body.mensaje).toBe('Falla de comunicación con el escuadrón táctico');
    });

    test('3. Debería devolver el Contrato Sagrado (HTTP 200) ante un escaneo exitoso', async () => {
        // Simulamos la respuesta perfecta que nos mandaría el G4
        const mockG4 = {
            screenshots: ["https://ruta-falsa.com/img.png"],
            identity: { title: "Test Title" },
            metrics: { responseTimeMs: 150, documentSizeKb: 10, sslValid: true }
        };
        servicioRobot.ejecutarExtraccion.mockResolvedValue(mockG4);

        const respuesta = await request(app)
            .post('/api/escanear')
            .send({ url: 'https://unpilar.edu.ar' });

        // qué esperamos? Que el Búnker procese los datos y devuelva el JSON que acordamos con el Front
        expect(respuesta.status).toBe(200);
        expect(respuesta.body.estado).toBe('EXITO');
        expect(respuesta.body.identidad.titulo).toBe('Test Title');
        expect(respuesta.body.metricas.tiempoRespuestaMs).toBe(150);
        
        // Verificamos que se inyecte nuestra propiedad de fall-back. toBeDefined es literalmente "espero que esta variable exista"
        expect(respuesta.body.analisis_enlaces.total_links).toBeDefined();
    });
});