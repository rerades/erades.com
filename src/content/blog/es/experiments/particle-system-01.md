---
title: "sistema de partículas"
pubDate: 2019-01-11
description: "Explorando técnicas de animación de sistemas de partículas utilizando Canvas y JavaScript para crear efectos visuales dinámicos"
tags:
  - particle system
categories:
  - experiment
draft: false
heroImage: /blog-placeholder-11.jpg
---

<canvas id="canvas" style="background-color:black; height:100%; width:100%"></canvas>

<script type="module" src="/js/experiments/fn/scene.js"></script>

Como side project realicé un pequeño sistema de partículas.
Además de crear el sistema de partículas hice la misma funcionalidad afrontando el proyecto con dos paradigmas diferenciados por un lado con una programación orientada a objetos utilizando clases (ES6) y por otro lado con un enfoque funcional

https://github.com/rerades/particle-system-es6

**Resumen del proyecto**

- **Objetivo:** simular un sistema de partículas en Canvas con dos enfoques: POO (clases ES6) y funcional (datos + funciones puras).
- **Actores:** `Particle` (entidad que se mueve), `Emitter` (emisor de partículas), `Field` (campo gravitatorio/repulsivo), `Display` (dibujo en canvas), y una capa de orquestación (`ParticleSystem`/`Scene` en POO; `scene.js` + utilidades en funcional).
- **Resultado:** partículas emitidas con un ángulo/velocidad iniciales, afectadas por campos positivos/negativos, que se actualizan y dibujan en cada frame.

**Física y movimiento**

- **Aceleración por campos:** para cada partícula, se calcula un vector desde la partícula hacia cada campo. La fuerza es proporcional a la masa del campo e inversamente proporcional a la distancia al cubo (evita explosiones cerca de 0 y decae rápido con la distancia).
- **Integración sencilla:** en cada frame, `aceleración -> velocidad -> posición` (suma vectorial). Se filtran partículas fuera de los límites del lienzo.
- **Parámetros clave:** masa del campo (signo define atracción/repulsión), frecuencia del emisor, apertura del ángulo de emisión (`spread`) y tamaño/color de las partículas.

**Enfoque POO (orientado a objetos)**

- **Clases principales:** `Vector`, `Particle`, `Emitter`, `Field`, `Display`, `ParticleSystem`, `EventHandler` y `PSEvent`.
- **Arquitectura:** `Scene` inicializa el `canvas`, crea `Display`, registra listeners en un `EventHandler` (singleton) y delega la simulación en `ParticleSystem` (añadir emisores/campos, actualizar y dibujar).
- **Bucle:** `Display` gestiona `requestAnimationFrame` y emite eventos (`beforeUpdate`, `update`, `draw`, etc.). `ParticleSystem` responde a estos eventos para añadir nuevas partículas, aplicar campos y dibujar todo.
- **Ventajas:** estado encapsulado por instancia, flujo de eventos claro, separación entre lógica (sistema) y representación (`Display`).

**Enfoque funcional**

- **Datos inmutables y funciones puras:** entidades como `Particle`, `Field` o `emitter` son “constructores” de objetos; operaciones (`move`, `attachToEmitter`, utilidades de `Vector`) devuelven nuevos valores.
- **Composición:** el bucle en `scene.js` usa `pipe`/`tap` para componer pasos: añadir nuevas partículas por emisor y frecuencia, moverlas según campos, limpiar por límites, y dibujar.
- **Dibujo desacoplado:** `Display` expone funciones puras que reciben el estado y dibujan (rectángulos o círculos con gradiente) sin mutar la fuente de datos.
- **Ventajas:** claridad en el flujo de datos, facilidad para testear funciones en aislamiento y ajustar pasos de la tubería sin efectos colaterales.

**Bucle de animación**

- **Temporización:** `requestAnimationFrame` coordina el render. En POO, `Display` emite eventos por frame; en funcional, el `loop` encadena transformaciones de la colección de partículas y vuelve a llamarse.
- **Criterios de parada:** en POO se limita por número máximo de frames; en funcional el contador puede ser infinito (o acotado si se desea).

**Cómo ejecutarlo**

- **Repositorios/demos:** el código está en el repositorio enlazado. Hay dos entradas HTML: `index-oo.html` (POO) y `index-fn.html` (funcional). Al usar módulos ES6, conviene servirlo con un servidor simple (por ejemplo: `npx simple-server`).

**Notas y aprendizajes**

- **Modelado vectorial:** central para fuerzas y movimiento; reutilizado en ambos paradigmas.
- **Diseño por eventos vs. tuberías:** eventos (POO) facilitan modularidad en tiempo de ejecución; tuberías (funcional) facilitan lectura y testeo.
- **Parámetros sensibles:** masas muy altas o `spread` grande cambian drásticamente el comportamiento; conviene experimentar con valores moderados.
