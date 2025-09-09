---
title: "programando funtores"
description: "Entendiendo los funtores como un patrón de diseño para manipular de manera segura los valores envueltos en la programación funcional"
pubDate: "2019-01-01"
tags:
  - declarative
  - Pure functions
  - Inmutable
  - currying
categories:
  - functional
draft: false
heroImage: "/blog-placeholder-15.jpg"
---

> **Un functor es simplemente una interfaz con un contrato.**<br>
> Podríamos haberlo nombrado Mappable igual de fácil, pero, ¿dónde estaría la diversión en eso?.<br> > _Professor Frisby's_

Un functor no es más que una estructura de datos con la que puedes mapear funciones con el propósito de
levantar valores en un wrapper, modificarlos, y luego devolverlos a un wrapper.

Es un patrón de diseño que define la semántica de cómo debería funcionar **fmap**

` fmap :: (A -> B) -> Wrapper(A) -> Wrapper(B)`

Veamos un ejemplo:

```javascript
// NOTA: no podemos usar la función de flecha si estamos haciendo referencia a this dentro de la función (no "new" para las funciones de flecha)
var Contenedor = function (x) {
  this.__valor = x;
};

Contenedor.of = function (x) {
  return new Contenedor(x);
};

Contenedor.of(3); // => Contenedor(3) === { "__valor": 3 }
Contenedor.of(Contenedor.of("pepinillos")); // => Contenedor(Contenedor("pepinillos")) === { "__valor": { "__valor": "pepinillos" } }
```

- `Contenedor` es un objeto con una propiedad.

- Muchos contenedores simplemente contienen una cosa, aunque no están limitados a una.
  Hemos nombrado arbitrariamente a su propiedad `__valor`.

- El `__valor` no puede ser de un tipo específico o nuestro `contenedor` apenas viviría hasta el nombre.

- Una vez que los datos entran en el `Contenedor` ahí se quedan. Podríamos sacarlo usando `.__valor` , pero eso derrotaría al propósito.

---

Así que ahora repasemos de nuevo la idea de un functor. ¿Qué es un functor y qué debería tener un functor?

Un functor será principalmente un contenedor, y ¿por qué queremos hacer eso? Bueno, contener (o envolver) valores es un patrón de diseño fundamental en la programación funcional
porque **protege el acceso directo a los valores** para que puedan ser manipulados de manera segura e inmutable en tus programas.

```javascript
class Envoltorio {
  constructor(valor) {
    this._valor = valor;
  }

  toString() {
    return "Envoltorio (" + this._valor + ")";
  }
}

// wrap :: A -> Envoltorio(A)
const wrap = (val) => new Envoltorio(val);
wrap("Hola Muzzy").toString(); // -> Envoltorio (Hola Muzzy)
```

Ahora que tenemos un contenedor para nuestros valores necesitamos algo para operar esos valores , porque acceder a un valor envuelto sólo puede hacerse **mapeando una operación a su contenedor**.

Así que un functor debe ser un objeto envuelto y una función para **mapear** sobre los valores, en el mundo funcional suelen llamar a esta función **map** o **fmap**

```javascript
class Envoltorio {
  constructor(valor) {
    this._valor = valor;
  }
  toString() {
    return "Envoltorio (" + this._valor + ")";
  }

  // map :: (A -> B) -> A -> B
  map(fn) {
    return fn(this._valor);
  }
}
// wrap :: A -> Envoltorio(A)
const wrap = (val) => new Envoltorio(val);
wrap("Hola Muzzy").toString(); // -> Envoltorio (Hola Muzzy)
wrap("Hola Muzzy").map((item) => item.toUpperCase()); // --> HOLA MUZZY
```

En el ejemplo anterior estamos mapeando sobre el valor pero el problema es que estamos devolviendo el valor transformado ya , lo cual está bien pero no podemos encadenar nada más dentro de este contenedor
y perdemos la habilidad de encasillar nuestros datos porque salimos de nuestro "contenedor seguro".

Así que tal vez una buena idea sería devolver el resultado mapeado en un nuevo envoltorio en lugar de devolver solo el resultado. Así que cambiamos nuestra función map en un **fmap**

```javascript
class Envoltorio {
  constructor(valor) {
    this._valor = valor;
  }
  toString() {
    return "Envoltorio (" + this._valor + ")";
  }

  // fmap :: (A -> B) -> Envoltorio[A] -> Envoltorio[B]
  fmap(fn) {
    return new Envoltorio(fn(this._valor));
  }
}
// wrap :: A -> Envoltorio(A)
const wrap = (val) => new Envoltorio(val);
wrap("Hola Muzzy").toString(); // -> Envoltorio (Hola Muzzy)
wrap("Hola Muzzy").fmap((item) => item.toUpperCase()); // --> Envoltorio { _valor: 'HOLA MUZZY' }
```

Así que ahora estamos devolviendo un nuevo objeto Envoltorio con el valor transformado después de aplicar la función mapeada (toUpperCase).

fmap sabe cómo aplicar funciones a valores envueltos en un contexto. Primero abre el contenedor,
luego aplica la función dada a su valor, y finalmente cierra el valor de nuevo en un nuevo contenedor del **mismo tipo**.

Esto nos permite encadenar más acciones dentro de nuestro valor envuelto.

Así que imagina que queremos pasar a mayúsculas y luego dividir las palabras en un arreglo, podríamos hacerlo fácilmente:

```javascript
class Envoltorio {
  constructor(valor) {
    this._valor = valor;
  }
  toString() {
    return "Envoltorio (" + this._valor + ")";
  }

  // fmap :: (A -> B) -> Envoltorio[A] -> Envoltorio[B]
  fmap(fn) {
    return new Envoltorio(fn(this._valor));
  }
}
// wrap :: A -> Envoltorio(A)
const wrap = (val) => new Envoltorio(val);

wrap("Hola Muzzy")
  .fmap((item) => item.toUpperCase())
  .fmap((item) => item.split(" ")); // -->  Envoltorio { _valor: [ 'HOLA', 'MUZZY' ] }
```

Entonces después de tener una función fmap que devuelve el mismo tipo de objeto también podemos afirmar que un functor seguirá estas dos reglas:

1. **Preserva la identidad**

```javascript
    objeto.fmap(x => x) ≍ objeto
```

2. **Es componible**

```javascript
    objeto.fmap(componer(f, g)) ≍ objeto.fmap(g).fmap(f)
```

<br>

Y finalmente podemos decir entonces que un objeto será un functor si cumple estas reglas:

**1) Es un objeto envoltorio para contener nuestros datos**<br>
**2) tiene una función map para iterar sobre sus propios datos**<br>
**3) preserva la identidad**<br>
**4) puede ser componible**<br><br>

<hr>
<div class="bibliography">
Bibliografía:<br><br>

- Programación funcional en JavaScript . Ed: MANNING SHELTER ISLAND. Autor: Luis Atencio.
- [Guía mayormente adecuada para la programación funcional](https://drboolean.gitbooks.io/mostly-adequate-guide-old/content/).
Professor Frisby's<br>
</div>
