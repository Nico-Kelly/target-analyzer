# 🎯 Target Analyzer - Arquitectura del Proyecto

## 🏗️ Visión General
Este proyecto implementa una **Arquitectura en Capas (Layered Architecture)** estructurada como un **Monolito Modular**. Esto significa que tanto la interfaz de usuario (Front-End) como la lógica del servidor (Back-End) coexisten en el mismo repositorio y son servidos por la misma instancia de Node.js (Express), pero manteniendo una estricta separación de responsabilidades.

---

## 🎨 Front-End (La Vidriera)
**Ubicación:** Carpeta `public/`

Esta capa es el cliente estático. Su única responsabilidad es dibujar la interfaz, capturar las interacciones del usuario y comunicarse con la API. Como está alojada bajo el mismo techo que el servidor, se evitan problemas de CORS y se utilizan rutas relativas limpias.

* **`index.html`**: Estructura de la aplicación (la grilla de monitoreo y la consola de comandos).
* **`style.css`**: Diseño visual utilizando CSS puro (CSS Grid, variables personalizadas, paleta oscura y tipografía JetBrains Mono para un aspecto de terminal).
* **`emisor-script.js`**: Lógica de cliente. Maneja el DOM de forma asíncrona, captura la URL objetivo y realiza la petición HTTP (`fetch('/api/escanear')`) hacia el Búnker Central.

---

## ⚙️ Back-End (El Búnker Central)
**Ubicación:** Directorio raíz y subcarpetas dentro de `src/`

El servidor está construido con Node.js y Express. Sigue el patrón **Rutas-Controladores-Servicios** para aislar la infraestructura de red de la lógica táctica de negocio.

* **`receptor-server.js`**: El punto de entrada principal. Inicializa el servidor, configura los middlewares (`cors`, `express.json`), expone estáticamente la carpeta `public/` al navegador y delega el manejo del tráfico a las rutas correspondientes.
* **`src/routes/` (El Radar)**: Contiene `escaneo.routes.js`. Define los *endpoints* de la API. Su única función es escuchar las peticiones entrantes (ej. `POST /api/escanear`) y derivarlas al controlador adecuado. No procesa ni altera datos.
* **`src/controllers/` (La Aduana)**: Contiene `escaneo.controller.js`. Recibe la petición (`req`), extrae y valida la carga útil (URL objetivo), orquesta la lógica y finalmente empaqueta la respuesta JSON (`res`) que será devuelta al Front-End.

---

## 🧠 ¿Por qué elegimos esta arquitectura?

1. **Separación de Responsabilidades (Clean Architecture)**: Al no mezclar lógica de ruteo con lógica de negocio en un solo archivo, el código se vuelve altamente predecible. Si en el futuro se requiere escalar la lógica de extracción, solo se interviene la capa correspondiente sin riesgo de romper el servidor o la comunicación HTTP.

2. **Preparado para Testing Unitario**: Esta división modular facilita enormemente la automatización. Se pueden simular peticiones con *Supertest* directamente contra los controladores, o testear servicios de forma aislada utilizando *Jest*, todo sin necesidad de levantar puertos o bases de datos en la red.
(No implementamos aún estas librerias pero estamos leyendo su documentación evaluando la utilidad real para el proyecto)

adjunto sus documentaciones, ambas librerias son de licencia MIT.

https://www.npmjs.com/package/supertest
https://jestjs.io/docs/getting-started
