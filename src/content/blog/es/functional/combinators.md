---
title: "combinadores"
description: "Comprendiendo los combinadores en la programación funcional como funciones puras de orden superior para componer y controlar el flujo del programa"
pubDate: "2019-01-10"
tags:
  - declarative
  - Pure functions
  - Inmutable
  - currying
  - combinator
categories:
  - functional
draft: false
heroImage: /blog-placeholder-10.jpg
---

Un combinator es una función de orden superior, **funciones puras** que no tienen ninguna **variable libre** y
pueden combinar artefactos primitivos como otras funciones (u otros combinators) y comportarse como lógica de control.

Las **variables libres** son simplemente variables en el contexto de una función que no se pasan explícitamente
como argumento.

Nuestro compromiso es que todas las dependencias se pasen por parámetro.

Los combinators desbloquean la libertad y facilitan la programación libre de puntos.
Debido a que los combinators son puros, se pueden componer en otros combinators,
proporcionando un número infinito de alternativas para expresar y reducir la complejidad de la escritura
cualquier tipo de aplicación.

Por ejemplo, una función de composición será un combinator:

```javascript
const compose = (f, g) => (x) => f(g(x));

const addTwo = (x) => x + 2;
const multByThree = (x) => x * 3;

const operator = compose(addTwo, multByThree);

console.log(operator(7)); // 23
// NOTA: recuerda que compose se ejecutará de derecha a izquierda
```

En Ramda hay muchos combinators que podemos usar:

- compose
- pipe
- identity
- tap
- alternation
- sequence
- fork (join)

## identity

El combinator identity es una función que devuelve el mismo valor que se le proporcionó como argumento:

`identity :: (a) -> a`

Se utiliza ampliamente al examinar las propiedades matemáticas de las funciones,
pero también tiene otras aplicaciones prácticas:

- Proporcionar datos a funciones de orden superior que lo esperan al evaluar un argumento de función.
- Pruebas unitarias del flujo de combinators de funciones donde necesita un resultado de función simple sobre el cual
  hacer afirmaciones.
- Extracción de datos de manera funcional de tipos encapsulados.

## Tap

tap es extremadamente útil para enlazar funciones vacías (como registrar o escribir un archivo o una página HTML)
en su composición sin tener que crear ningún código adicional. Lo hace pasándose a sí mismo
en una función y retornándose a sí mismo. Aquí está la firma de la función:

`tap :: (a -> *) -> a -> a`

## Alternation [OR - combinator]

El combinator alt permite realizar **lógica condicional simple** al proporcionar comportamiento predeterminado
en respuesta a una llamada de función.
Este combinator toma dos funciones y devuelve el resultado de la primera si el valor está
definido (no falso, nulo o indefinido); de lo contrario, devuelve el resultado de la segunda función.

## Sequence (S-combinator)

El combinator seq se utiliza para recorrer una secuencia de funciones. Toma dos o más funciones
como parámetros y devuelve una nueva función, que ejecuta todas ellas en secuencia contra el mismo valor.

El combinator seq no devuelve un valor; solo realiza un conjunto de acciones una tras otra.

## Fork (join) combinator

El combinator fork es útil en casos donde necesitas procesar un solo recurso de dos
maneras diferentes y luego combinar los resultados.

<br><br>

<div class="bibliography">
Bibliografía:<br>

- Programación Funcional en JavaScript . Ed: MANNING SHELTER ISLAND. Autor: Luis Atencio.<br>
- [Guía Más Que Adecuada para la programación funcional](https://drboolean.gitbooks.io/mostly-adequate-guide-old/content/).
  Professor Frisby's<br>
- [Creando una aplicación declarativa usando JavaScript funcional](https://www.packtpub.com/web-development/building-declarative-apps-using-functional-javascript-video).
  Michael Rosata
  </div>
