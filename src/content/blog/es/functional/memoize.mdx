---
title: "Memoizar"
description: "Un memoizador de funciones más avanzado"
pubDate: "2019-11-11"
tags:
  - declarative
  - Pure functions
  - Inmutable
  - currying
  - functors
categories:
  - functional
draft: false
heroImage: "/blog-placeholder-9.jpg"
---

```javascript
// Un memoizador más funcional

// Podemos potenciar nuestro módulo añadiendo funciones más adelante
var Memoizer = (function () {
  // Datos privados
  var cache = {};
  // ¡Las funciones nombradas son increíbles!
  function cacher(func) {
    return function () {
      var key = JSON.stringify(arguments);
      if (cache[key]) {
        return cache[key];
      } else {
        val = func.apply(this, arguments);
        cache[key] = val;
        return val;
      }
    };
  }
  // Datos públicos
  return {
    memo: function (func) {
      return cacher(func);
    },
  };
})();

var fib = Memoizer.memo(function (n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
});
```
