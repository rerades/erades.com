---
title: "Notación Hindley-Milner"
description: "Entendiendo la notación de tipo Hindley-Milner en programación funcional para expresar firmas de funciones y relaciones de tipo"
pubDate: "2019-04-11"
tags:
  - declarative
  - Pure functions
  - Inmutable
  - currying
  - Hindley-Milner
categories:
  - functional
draft: false
heroImage: "/blog-placeholder-13.jpg"
---

Una forma de crear una notación para expresar qué tipos de parámetro toma una función y qué devuelve.

## Lo básico

Una función que toma un valor primario ("tipo antiguo" como cadena, número, booleano, matriz, función ...) y devuelve otro valor primario:

`instruction :: String -> String`

```javascript
const instruction = function (verb) {
  return verb + " me";
};
```

la función instruction toma una cadena y devuelve una cadena

También podría hacer algo así:

`length :: String → Number`

```javascript
const length = function (s) {
  return s.length;
};
```

En el caso de una matriz de números:

`length :: [Number] → Number`

```javascript
    const length = function(arr){
        retrun arr.length
    }
```

## Trabajando con funciones

En el caso de una función, envolvemos nuestra función entre paréntesis y dentro de los paréntesis tenemos nuestro tipo de entrada y nuestro tipo de salida:

`addOneToAll :: ((Number → Number),[Number]) → [Number]`

```javascript
const addOne = function (x) {
  return x + 1;
};
const addOneToAll = (addOne, arr) => arr.map(addOne);
```

En este caso tenemos una función llamada addOneToAll que espera como primer parámetro una función (en nuestro caso addOne) y esta función aceptará un número y devolverá un número.
Y como segundo parámetro una matriz de números y devolverá otra matriz de números.

### Funciones de currying

Ahora, ¿qué pasa con una función que devuelve una función que devuelve otra función ....

Siguiendo lo anterior, tendríamos algo como esto:
`replace :: String -> (String -> (String -> String))`

```javascript
var replace = curry(function (find, replacement, str) {
  var regex = new RegExp(find, "g");
  return str.replace(regex, replacement);
});
```

En este caso también hacemos que la función sea curry para tomar parámetros uno por uno

Y en la programación funcional podemos asumir que todo es curry, así que tendemos a dejar caer los corchetes y algo como esto:

` replace :: String -> String -> String -> String`

## Trabajando con funciones que toman múltiples parámetros como entrada (Variables arbitrarias de Hindley-Milner)

Mostramos el ejemplo con la función de longitud donde podríamos tener:
`length :: [Number] → Number`
o
`length :: string → Number`

En este caso podríamos escribir ambos con una variable arbitraria como:
`length :: [a] → Number`

Otro ejemplo común es la identidad:
`identity :: a -> a`

Y un ejemplo más complejo:
`map :: (a -> b) -> [a] -> [b]`

```javascript
const map = curry(function (callback, array) {
  return array.map(callback);
});
```

La función de mapa toma una función que toma una variable de tipo `a` y devuelve una variable de tipo `b`.
Luego toma una **matriz de valores**, todos de tipo `a`, y devuelve una **matriz de valores**, todos de tipo `b`.

---

## Trabajando con Ramda

## Tipos parametrizados

Podemos imaginar fácilmente un tipo que representa una colección de elementos similares,
llamémoslo una Caja. Pero ninguna instancia es una Caja arbitraria; cada uno solo puede contener un tipo de elemento.

`makeBox :: Number -> Number -> Number -> [a] -> Box a`

```javascript
  const makeBox = curry((height, width, depth, items) => /* ... */);
```

## Alias de tipo

Si tuviéramos un tipo parametrizado Usuario String, donde la String se supone que representa un nombre, y quisieramos ser más específicos acerca del tipo de String que se representa al generar una URL, podríamos crear un alias de tipo así:

`toUrl :: User Name u => Url -> u -> Url`

`Name = String`

` Url = String`

```javascript
const toUrl = curry(
  (base, user) => base + user.name.toLowerCase().replace(/\W/g, "-")
);
toUrl("http://example.com/users/", { name: "Fred Flintstone", age: 24 });
//=> 'http://example.com/users/fred-flintstone'
```

## Restricciones de tipo [Ord]

A veces queremos restringir los tipos genéricos que podemos usar en alguna firma de alguna manera u otra.

Podríamos querer una función máxima que pueda operar sobre Números, en Cadenas, en Fechas, pero no en Objetos arbitrarios.

Queremos describir tipos ordenados, aquellos para los cuales **a < b siempre devolverá un resultado significativo**

`maximum :: Ord a => [a] -> a`

```javascript
const maximum = (vals) =>
  reduce((curr, next) => (next > curr ? next : curr), head(vals), tail(vals));
maximum([3, 1, 4, 1]); //=> 4
maximum(["foo", "bar", "baz", "qux", "quux"]); //=> 'qux'
maximum([
  new Date("1867-07-01"),
  new Date("1810-09-16"),
  new Date("1776-07-04"),
]); //=> new Date("1867-07-01")
```

`Ord a ⇒ [a] → a` dice que la máxima toma una colección de elementos de algún tipo, pero ese tipo debe adherirse a Ord.

En JS, no hay forma de garantizar que el usuario no nos pasará [1, 2, 'a', false, undefined, null].
Así que toda nuestra anotación de tipo es **descriptiva y aspiracional** en lugar de ser impuesta por el compilador, como sería en, digamos, Haskell.

## Firmas múltiples

A veces, en lugar de tratar de encontrar la versión más genérica de una firma, es más sencillo enumerar varias firmas relacionadas por separado.
Podríamos hacer eso como abajo:

`getIndex :: a -> [a] -> Number`
`:: String -> String -> Number`

```javascript
const getIndex = curry((needle, haystack) => haystack.indexOf(needle));
getIndex("ba", "foobar"); //=> 3
getIndex(42, [7, 14, 21, 28, 35, 42, 49]); //=> 5
```

## Funciones variadicas (específicas para Ramda)

En Haskell, todas las funciones tienen una aridad fija. Pero Javsacript tiene que lidiar con funciones variadicas.
`flip :: (a -> b -> ... -> z) -> (b -> a -> ... -> z)`

```javascript
const flip = (fn) =>
  function (b, a) {
    return fn.apply(this, [a, b].concat([].slice.call(arguments, 2)));
  };
flip((x, y, z) => x + y + z)("a", "b", "c"); //=> 'bac'
```

## Objetos simples

Cuando un objeto se utiliza como un diccionario de valores de tipo similar (a diferencia de su otro papel como un Registro), entonces los tipos de las claves y los valores pueden volverse relevantes.
Entonces podríamos representarlos así:
`keys :: {k: v} -> [k]`
`values :: {k: v} ->  [v]`

```javascript
keys({ a: 86, b: 75, c: 309 }); //=> ['a', 'b', 'c']
values({ a: 86, b: 75, c: 309 }); //=> [86, 75, 309]
```

## Ejemplo complejo

`Lens s a -> (a -> a) -> s -> s`
`Lens s a = Functor f => (a -> f a) -> s -> f s`

Comenzamos con el alias de tipo, Lens s a = Functor f ⇒ (a → f a) → s → f s.
Esto nos dice que el tipo Lens **está parametrizado por dos variables genéricas, s, y a**.
Sabemos que hay una restricción en el tipo de la variable f utilizada en una Lens: **debe ser un Functor**.
Con eso en mente, vemos que una Lens es una función acurruada de dos parámetros, el primero siendo una función de
un valor del tipo genérico a a uno del tipo parametrizado f a, y el segundo siendo un valor del tipo genérico s.

**El resultado** es un valor del tipo parametrizado `f・s`

<div class="bibliography">
Bibliografía:<br><br>

- [gentle introduction to functional javascript style](https://jrsinclair.com/articles/2016/gentle-introduction-to-functional-javascript-style#hindley-milnertypesignatures)
- [function type signatures in Javascript](https://hackernoon.com/function-type-signatures-in-javascript-5c698c1e9801)
- [Type signatures in Ramda](https://github.com/ramda/ramda/wiki/Type-Signatures)
</div>
