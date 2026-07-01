# 🎯 Target Analyzer - Búnker Central (API Gateway)

## 📌 Resumen de la Operación (Visión General)
Target Analyzer es un proyecto académico diseñado para simular una herramienta táctica de recolección de inteligencia web (OSINT). Su función principal es recibir la dirección de una página web (URL), orquestar una exploración asíncrona mediante microservicios externos y devolver un reporte estructurado y normalizado con tecnologías, métricas de rendimiento y parámetros de seguridad.

A nivel arquitectónico, el sistema evolucionó de un Monolito a un **API Gateway**. Nuestro Back-End asume el rol de escudo centralizador: recibe las peticiones del Front-End (Grupo 1), delega el *web scraping* pesado al Robot externo (Grupo 4), y formatea los datos bajo un **Contrato JSON Estricto** para garantizar que la interfaz gráfica nunca colapse por inconsistencias.

---

## 🚀 Puesta en Marcha (Instalación y Comandos)

### 1. Instalación de Dependencias
Asegurate de tener Node.js instalado. Cloná el repositorio y ejecutá el siguiente comando en la terminal para instalar las dependencias principales (Express, CORS) y las herramientas de desarrollo:
```bash
npm install
``` 
2. Comandos Operativos (npm scripts)

El proyecto cuenta con comandos estandarizados en el package.json para facilitar el flujo de trabajo:

   - npm start (Entorno de Producción):
    Levanta el servidor de forma estándar utilizando Node.js. Ideal para despliegues definitivos.

   - npm run dev (Entorno de Desarrollo):
    Inicia el servidor utilizando Nodemon.
    ¿Por qué lo integramos? Nodemon vigila constantemente los archivos del proyecto y reinicia el servidor automáticamente cada vez que guardamos un cambio (Ctrl + S). Esto elimina la necesidad de apagar y prender el servidor manualmente, agilizando drásticamente la escritura de código.

   - npm test (Entorno de QA Automation):
    Ejecuta la suite de pruebas automatizadas utilizando Jest y Supertest.
    ¿Por qué los integramos? Al depender de un microservicio externo (Robot G4), necesitábamos testear nuestra API sin depender de su conexión de red. Jest nos permite falsificar (Mockear) las respuestas del robot, mientras que Supertest levanta una versión fantasma del servidor en la memoria RAM. Esto nos permite validar los códigos HTTP (200, 400, 500) en milisegundos y asegurar que nuestro código es a prueba de balas.

## Arquitectura de Carpetas (Separation of Concerns)

Para evitar el "Código Espagueti", el Búnker Central está diseñado bajo una estricta separación de responsabilidades:

📦 target-analyzer
 ┣ 📂 public/        # 🎨 CAPA DE PRESENTACIÓN (FRONT-END CLIENTE)
 ┃                   # Aquí puede alojarse el Front-End de cualquier grupo.
 ┃                   # Actualmente incluye un cliente básico (HTML/CSS/JS) 
 ┃                   # diseñado por nuestro equipo para testeos visuales rápidos.
 ┣ 📂 src/
 ┃ ┣ 📂 controllers/ # 🧠 CEREBRO Y ADUANA: Valida peticiones, orquesta la extracción y formatea el JSON definitivo.
 ┃ ┣ 📂 logs/        # 🗄️ CAJA NEGRA: Almacenamiento físico de la bitácora de eventos rotativa.
 ┃ ┣ 📂 routes/      # 🚦 SEMÁFOROS: Define los endpoints (ej. /api/escanear) y deriva el tráfico.
 ┃ ┣ 📂 services/    # ⚙️ ESCUADRÓN TÁCTICO: Lógica asíncrona. Contiene el fetch al robot (Puerto 3001).
 ┃ ┣ 📂 tests/       # 🧪 QA AUTOMATION: Archivos de prueba unitaria y de integración (.test.js).
 ┃ ┣ 📂 utils/       # 🛠️ HERRAMIENTAS: Scripts transversales (Logger asincrónico, lógica de Contraespionaje).
 ┃ ┗ 📂 validations/ # 🛡️ PRIMERA DEFENSA: Expresiones regulares para validar URLs de entrada.
 ┣ 📜 package.json   # Manifiesto de dependencias y scripts.
 ┗ 📜 receptor-server.js # Punto de entrada principal. Configura middlewares y levanta Express.

## Características Clave de Ingeniería

    1. El Contrato Sagrado (JSON Definitivo): Sin importar qué datos omita el Robot de extracción, nuestro controlador inyecta valores de contingencia (Fall-backs, ej: total_links: 0). El Front-End siempre recibe las mismas variables, garantizando estabilidad visual.

    2. Resiliencia de Red (Timeout): El fetch hacia el Robot está vigilado por un AbortController nativo. Si el motor externo no responde en 20 segundos, la conexión se aborta automáticamente liberando los hilos del servidor y retornando un Error 500 controlado.

    3. Protocolo de Contraespionaje (Falso Positivo): Simulador de seguridad corporativa. Si se cae en la probabilidad de la funcion de Contraespionaje, el Back-End aborta el escaneo real pero devuelve un falso Status 200 OK al Front-End. Esto fuerza a la interfaz gráfica a renderizar alertas visuales ("RASTREO DETECTADO"), logrando un hackeo de interfaz controlado estrictamente desde el servidor.

    3. Sistema de Logging Asincrónico: Utilizando fs.promises, el servidor registra todos los eventos críticos en el disco duro sin bloquear el Event Loop, permitiendo atender a múltiples usuarios simultáneamente.

Desarrollado por el Grupo 3 - Comisión 8 | Proyecto Final "Desarrollo Web Full Stack"
