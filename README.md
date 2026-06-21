
# 🎯 Target Analyzer (Analizador de Objetivos)

## 📌 Resumen de la Operación (Visión General)
Target Analyzer es un proyecto académico diseñado para simular una herramienta de recolección de inteligencia web (OSINT). Su función principal es recibir la dirección de una página web (URL), enviar una sonda a explorarla de forma invisible y devolver un reporte detallado con sus tecnologías, métricas de rendimiento y estado de seguridad.

A nivel técnico, el proyecto implementa una **Arquitectura en Capas (Layered Architecture)** estructurada como un **Monolito Modular**. Esto significa que tanto la interfaz de usuario (Front-End) como la lógica del servidor (Back-End) coexisten en el mismo repositorio y son servidos por la misma instancia de Node.js (Express), manteniendo una estricta separación de responsabilidades.

---

## 🎨 Front-End (La Vidriera)
**Ubicación:** Carpeta `public/`

Esta capa es el cliente estático. Su única responsabilidad es dibujar la interfaz, capturar las interacciones del usuario y comunicarse con la API. Como está alojada bajo el mismo techo que el servidor, se evitan problemas de CORS y se utilizan rutas relativas limpias.

* **`index.html`:** Estructura de la aplicación (la grilla de monitoreo y la consola de comandos).
* **`style.css`:** Diseño visual utilizando CSS puro (CSS Grid, variables personalizadas, paleta oscura y tipografía técnica *JetBrains Mono* para un aspecto de terminal de intrusión).
* **`emisor-script.js`:** Lógica del cliente. Maneja el DOM de forma asíncrona, captura la URL objetivo y realiza la petición HTTP (`fetch('/api/escanear')`) hacia el Búnker Central.

---

## ⚙️ Back-End (El Búnker Central)
**Ubicación:** Directorio raíz y subcarpetas dentro de `src/`

El servidor está construido con Node.js y Express. Sigue el patrón **Rutas-Controladores-Servicios** para aislar la infraestructura de red de la lógica táctica de negocio.

* **`receptor-server.js`:** El punto de entrada principal. Inicializa el servidor, configura los middlewares (`cors`, `express.json`), expone estáticamente la carpeta `public/` al navegador y delega el tráfico a las rutas correspondientes.
* 📂 **`src/routes/` (El Radar):** Define los *endpoints* de la API (ej. `POST /api/escanear`). Su única función es escuchar peticiones entrantes y derivarlas al sector adecuado. No procesa ni altera datos.
* 📂 **`src/controllers/` (La Aduana):** Es el cerebro de las operaciones. Recibe la petición (`req`), extrae y valida la carga útil (URL objetivo), orquesta la misión enviando al robot, y empaqueta la respuesta JSON (`res`) de regreso al Front-End.
* 📂 **`src/services/` (El Escuadrón Táctico):** Aquí vive la herramienta de extracción. Utilizando **Puppeteer** (un navegador invisible) y **Cheerio**, el robot viaja a la URL indicada, lee su código interno y extrae las tecnologías y métricas clave.

---

## 📝 Sistema de Registros (La Caja Negra)
**Ubicación:** `src/utils/logger.js`

Para cumplir con los requisitos de trazabilidad, el sistema cuenta con un motor de registros transversal. Este módulo anota cada evento crítico (arranque, peticiones, éxitos o fallas) en un archivo local llamado `registro_bunker.txt`. 

**Detalle de rendimiento:** Para evitar que el servidor se vuelva lento o bloquee el *Event Loop* mientras escribe en el disco duro, este proceso utiliza el módulo nativo `fs.promises` de forma **asíncrona**, permitiendo que el servidor siga atendiendo múltiples conexiones en paralelo.

---

## 🧠 Fundamentos de Ingeniería: ¿Por qué elegimos esta arquitectura?

1. **Separación de Responsabilidades (Clean Architecture):** Al no mezclar lógica de ruteo con lógica de negocio o extracción en un solo archivo, el código se vuelve predecible. Si en el futuro se requiere actualizar el motor del Robot, solo se interviene la capa de Servicios sin riesgo de romper la comunicación HTTP del servidor.
2. **Preparado para Testing Automatizado:** Esta división modular facilita aislar los componentes para pruebas de calidad (QA). Se pueden simular peticiones contra los controladores o probar servicios específicos sin levantar puertos en la red. 
   *(Actualmente en fase de evaluación para futura integración utilizando herramientas de licencia MIT como [Supertest](https://www.npmjs.com/package/supertest) para la API y [Jest](https://jestjs.io/docs/getting-started) para testing unitario).*

---

