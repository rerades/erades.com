---
title: "programación funcional"
description: "Una introducción a los conceptos de programación funcional incluyendo programación declarativa, funciones puras, inmutabilidad y currificaci 3n."
pubDate: "2018-01-12"
tags:
  - declarative
  - Pure functions
  - Inmutable
  - currying
categories:
  - functional
draft: false
heroImage: "/blog-placeholder-12.jpg"
---

En ciencias de la computación, la programación funcional es un paradigma de programación, es decir, un estilo para construir la estructura y los elementos de los programas informáticos, que considera la computación como la **evaluación de funciones matemáticas y evita el cambio de estado y los datos mutables**.

Es un paradigma de programación **declarativo**, lo que significa que se programa mediante expresiones o declaraciones en lugar de sentencias. Para describirlo de manera diferente, podríamos decir que la programación **declarativa se preocupa por qué** se realiza una acción y la imperativa se preocupa por cómo realizar esa acción.

## Declarativo Vs. Imperativo || Qué Vs. Cómo

En el código funcional, el valor de salida de una función depende únicamente de los argumentos que se pasan a la función, por lo que llamar a una función f dos veces con el mismo valor para un argumento x produce el mismo resultado f(x) en cada ocasión; esto contrasta con los procedimientos que dependen de un estado local o global, que pueden producir resultados diferentes en momentos diferentes cuando se llaman con los mismos argumentos pero con un estado de programa diferente. Eliminar los efectos secundarios, es decir, los cambios en el estado que no dependen de las entradas de la función, puede facilitar mucho la comprensión y la predicción del comportamiento de un programa, que es uno de los principales motivos para el desarrollo de la programación funcional.

En contraste, la programación imperativa cambia el estado con comandos en el código fuente, siendo el ejemplo más simple la asignación. La programación imperativa tiene funciones, no en el sentido matemático, sino en el sentido de subrutinas. Pueden tener efectos secundarios que pueden cambiar el valor del estado del programa. Por lo tanto, tiene sentido que existan funciones que no devuelven valores. Por esto, carecen de transparencia referencial, es decir, la misma expresión en un lenguaje puede tener valores diferentes en momentos diferentes, dependiendo del estado del programa que se ejecute.

**IMPERATIVO**

```javascript
for (var i = 0; i < users.length; i++) {
  users[i].lastModified = new Date();
}
```

**DECLARATIVO**

```javascript
users.map((u) => {
  u.lastModified = new Date();
  return u;
});
```

## Funciones matemáticas (Funciones puras)

Son funciones que siempre devuelven el mismo resultado con la misma entrada. No dependen de ningún otro dato más allá de lo que se les pasa a la función y no alteran ningún dato más allá de lo que devuelven.

## Datos mutables

Los datos mutables son datos que pueden cambiar.
Un ejemplo sería ordenar un array. Si tenemos un array desordenado y creamos una función que ordena ese array, si la función devuelve un nuevo array con el orden, estos serían datos inmutables porque no cambiamos el array original. Sin embargo, si la función toma nuestro array inicial y lo modifica, entonces los datos son mutables y perderemos la referencia original del array y podríamos tener efectos secundarios.

## Trabajando con funciones de array

```javascript
// Devuelve el valor del primer elemento en un array que pasa una prueba
users.find((u) => {
  return u.id === id;
});
// Comprueba si todos los elementos en un array pasan una prueba
users.every((u) => {
  return u.isAdmin;
});
// Comprueba si alguno de los elementos en un array pasa una prueba
users.some((u) => {
  return u.isAdmin;
});
// Crea un nuevo array con cada elemento en un array que pasa una prueba
users.filter((u) => {
  return u.isAdmin;
});
// Crea un nuevo array con el resultado de llamar a una función para cada elemento del array
users.map((u) => {
  u.updated = new Date();
  return u;
});
// Reduce los valores de un array a un solo valor (de izquierda a derecha)
users.reduce((accumulator, n) => {
  return accumulator + n;
}, 0);
```

## Encadenamiento

Ejercicio: Para un array dado de números queremos:

1.  Reducir cada valor en 1.
2.  Sumar todos los valores resultantes que sean divisibles por 3.

Solución:

**IMPERATIVO**

```javascript
// Array dado
let numbers = [2, 4, 10, 12, 19, 23];
let sum = 0;

for (let i = 0; i < numbers.length; i++) {
  numbers[i] = numbers[i] - 1;
  if (numbers[i] % 3 == 0) {
    sum += numbers[i];
  }
}

console.log(sum); // sum = 30;
```

**DECLARATIVO**

```javascript
// Array dado
let numbers = [2, 4, 10, 12, 19, 23];

let substractOne = (n) => n - 1;
let isDivisbleBy3 = (n) => (n % 3 === 0 ? n : null);
let add = (n, i) => n + i;

let sum = numbers.map(substractOne).filter(isDivisbleBy3).reduce(add, 0);

console.log(sum); // sum = 30;
```

## Currying

Convertir una función que acepta varios parámetros en una serie de funciones que solo aceptan un parámetro cada una.

Veamos un ejemplo: <br>

```javascript
  // Empezando desde
  users.find((u) => {
    return u.id === id;
  });

// Ahora podríamos hacer algo así:

const byId = (item) => {
  return item.id === id;
}

users.find(byId)

// El problema con el código anterior es que id será indefinido ya que necesitamos 2 parámetros y solo estamos pasando uno

// La solución sería una función que retorna otra función
const byId = (id) => {
  return (item) => {
    return item.id === id;
  }
}

users.find(byId(2))

// Entonces esto también significa que podrías usar byId en cualquier lugar y puedes llamarlo así:
byId(2)(users)

// Ramda tiene una función curry que hace currying

const byId = R.curry(id, item) {
  return item.id === id;
}

users.find(byId(2))

// También la ventaja de usar la función R.curry es que acepta más de 2 parámetros
// Por ejemplo:

const add = R.curry((a,b,c,) => {
  return a + b + c;
})

add(1)(2)(3);


```

Este es otro ejemplo

```javascript
const convertUnits =
  (toUnit, factor, offset = 0) =>
  (input) =>
    ((offset + input) * factor).toFixed(2).concat(toUnit);

const milesToKm = convertUnits("km", 1.60936, 0);
const poundsToKg = convertUnits("kg", 0.4546, 0);
const farenheitToCelsius = convertUnits("grados C", 0.5556, -32);

milesToKm(10); //"16.09 km"
poundsToKg(2.5); //"1.14 kg"
farenheitToCelsius(98); //"36.67 grados C"

const weightsInPounds = [5, 15.4, 9.8, 110];

// Sin currying
// const weightsInKg = weightsInPounds.map(x => convertUnits('kg', 0.45460, 0)(x));

// Con currying
const weightsInKg = weightsInPounds.map(poundsToKg);
// "2.27kg", "7.00kg", "4.46kg", "50.01kg"
```

## Aplicación parcial

Suministro de menos argumentos que los requeridos

<div class="bibliography">
Bibliografía:

- Wikipedia: https://en.wikipedia.org/wiki/Functional_programming <br>
- Video de Pluralsite: [(Fundamentos de la Programación Funcional en JavaScript por Nate Taylor)](https://app.pluralsight.com/library/courses/javascript-functional-programming-fundamentals/exercise-files)<br>
- w3School: [Referencia del Array en JavaScript](https://www.w3schools.com/jsref/jsref_obj_array.asp)
</div>
