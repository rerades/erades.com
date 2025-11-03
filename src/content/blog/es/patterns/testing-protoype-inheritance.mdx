---
title: "probando la herencia del prototipo"
description: "Explorando la herencia de prototipos en JavaScript utilizando el método call para heredar propiedades y métodos entre objetos y funciones"
pubDate: 2018-11-21
tags:
  - design patterns
  - prototype
  - inheritance
categories:
  - design patterns
draft: false
heroImage: /blog-placeholder-17.jpg
---

https://stackoverflow.com/questions/53406070/using-call-to-inherit-objects-from-a-function

```js
// probando Call para heredar objetos / funciones
// -------------------------------------------

// declaramos nuestra primera función
const funcA = function (nombre) {
  this.nombre = nombre;
  this.getNombre = function () {
    return "Mi nombre es " + this.nombre;
  };
  return this;
};
// Creamos un objeto a partir de esa función
const objA = new funcA("Rodrigo");

// declarar segunda función
const funcB = function (apellido) {
  this.apellido = apellido;
  this.getApellido = function () {
    return "Mi apellido es " + this.apellido;
  };
  return this;
};

// Crea un objeto a partir de funcB y ObjectA
const objC = funcB.call(objA, "Erades");
// Obtenemos un objecto
console.log("TIPO DE: ", typeof objC);
console.log("crudo:", objC);
console.log("método A: ", objC.getNombre());
console.log("prop A: ", objC.nombre);
console.log("método B: ", objC.getApellido());
console.log("prop B: ", objC.apellido);
console.log("------------");

// si no queremos crear un objeto a partir de una función y un objeto,
// podríamos heredar dos funciones también, pero el resultado realmente me sorprende
const funcC = funcB.call(funcA, "Alonso");
// ¡¡¡¡¡Obtenemos una función!!!!!
console.log("TIPO DE: ", typeof funcC);
console.log("crudo:", funcC);
// Para obtener resultados necesitamos hacer esto:
console.log("método ==>: ", funcC("Rui"));
console.log("método A: ", funcC("Rui").getNombre());
console.log("prop A: ", funcC("Maria").nombre);
console.log("método B: ", funcC.getApellido());
console.log("prop B: ", funcC.apellido);
console.log("------------");
```
