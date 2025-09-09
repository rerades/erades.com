---
title: "transductores"
description: "Explorando transductores en la programación funcional para pipelines de transformación de datos eficientes sin crear valores intermedios"
pubDate: "2019-01-01"
tags:
  - declarative
  - Pure functions
  - Inmutable
  - currying
  - functors
  - transducers
categories:
  - functional
draft: false
heroImage: "/blog-placeholder-16.jpg"
---

El objetivo principal de los transductores es ejecutar una canalización de transformaciones en una secuencia de entrada de valores **sin crear valores intermedios**. Las funciones que describen los cálculos están decopladas, por lo que esto hace que el diseño del programa sea más limpio y fácil de desarrollar y mantener.

Un transductor es una función que acepta un transformador y devuelve un transformador y puede componerse directamente.

Los transductores pueden:

- Ser Componibles
- Solo enumeran los elementos **una vez** (muy eficiente para trabajar con flujos de datos)
- pueden usarse para evaluación perezosa o ansiosa
- Puedes combinar un transductor para generar otro transductor (¿Reductores de alto orden?)

Hay dos estrategias:

- **Tirar:** evaluación perezosa
- **Empujar:** evaluación ansiosa

**Tirar** espera hasta que un consumidor pida el siguiente valor (por ejemplo un Iterable)

**Empujar** enumera los valores fuente y los empuja a través de los tubos lo antes posible (Array.reduce())

Los transductores se componen de arriba a abajo (de izquierda a derecha)

**Ejemplo:**

Dado un arreglo de autobots queremos:

1. filtrar los valores que no contienen la letra 'r',
2. cambiar a mayúsculas
3. invertir cada valor

**Primer enfoque sin un transductor**

```javascript
const R = require("ramda"); // Librería funcional Ramda

let autobots = [
  "Optimus Prime",
  "Bumblebee",
  "Ironhide",
  "Sunstreaker",
  "Ratchet",
];

// Filtrar autobots que contienen 'r', cambiar a mayúsculas, luego invertir
let transform = R.compose(
  R.filter((x) => /r/i.test(x)),
  R.map(R.toUpper),
  R.map(R.reverse)
);

transform(autobots);
// => [ 'EMIRP SUMITPO', 'EDIHNORI', 'REKAERTSNUS', 'TEHCTAR' ]
```

**Mismo enfoque con transductor**

```javascript
const R = require("ramda"); // Librería funcional Ramda

let autobots = [
  "Optimus Prime",
  "Bumblebee",
  "Ironhide",
  "Sunstreaker",
  "Ratchet",
];

// Filtrar autobots que contienen 'r', cambiar a mayúsculas, luego invertir
let transform = R.compose(
  R.filter((x) => /r/i.test(x)),
  R.map(R.toUpper),
  R.map(R.reverse)
);

transform(autobots);
// => [ 'EMIRP SUMITPO', 'EDIHNORI', 'REKAERTSNUS', 'TEHCTAR' ]
```

Obtenemos exactamente el mismo resultado (en esta situación), pero algo muy diferente y muy poderoso ocurre por debajo. **En el primer ejemplo, se transformó toda la lista en cada paso**.<br>
Esto significa que tuvimos que iterar sobre la lista tres veces. Sin embargo, **en el segundo ejemplo** donde usamos el transductor, **¡solo tuvimos que iterar sobre la lista una vez!**

<div class="bibliography">
Bibliografía:<br><br>

- [effectfulJS](https://github.com/awto/effectfuljs/tree/master/packages/transducers)
- [Entendiendo Transductores en JavaScript](https://medium.com/@roman01la/understanding-transducers-in-javascript-3500d3bd9624)
- [MÁGICOS Y MÍSTICOS TRANSDUCTORES DE JAVASCRIPT](https://jrsinclair.com/articles/2019/magical-mystical-js-transducers/)
- [Transductores: Canalizaciones de procesamiento de datos eficientes en JavaScript](https://medium.com/javascript-scene/transducers-efficient-data-processing-pipelines-in-javascript-7985330fe73d).
</div>
