---
title: "monadas"
description: "Explorando monadas como funtores especializados para manejar datos nulos y agilizar el manejo de errores en la programación funcional"
pubDate: "2019-11-11"
tags:
  - declarative
  - Pure functions
  - Inmutable
  - currying
  - functors
categories:
  - functional
draft: true
heroImage: "/blog-placeholder-8.jpg"
---

Así que recordemos primero qué es un functor:

    1. Es un objeto envolvente para contener nuestros datos
    2. tiene una función de mapa para iterar sobre sus propios datos
    3. preserva la identidad
    4. puede ser componible

Pero los funtores por sí mismos no son convincentes, porque no se espera que
sepan cómo manejar casos con **datos nulos**.<br> `R.compose de Ramda`, por ejemplo,
fallará si se le pasa una referencia a una función nula. Esto no es un defecto
en el diseño; es intencional.

- Los funtores mapean funciones de un tipo a otro.

- Se puede encontrar un comportamiento más especializado en tipos de datos funcionales llamados monads.

- Entre otras cosas, los monads pueden simplificar la gestión de errores en su código, permitiéndole
  escribir composiciones de funciones fluidas.

- ¿Cuál es su relación con los funtores? **Los monads son los contenedores
  a los que los funtores "alcanzan".**
