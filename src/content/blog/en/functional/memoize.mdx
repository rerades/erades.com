---
title: "Memoize"
description: "A more function memoizer"
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
// A more functional memoizer

//We can beef up our module by adding functions later
var Memoizer = (function () {
  //Private data
  var cache = {};
  //named functions are awesome!
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
  //Public data
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
