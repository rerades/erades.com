---
title: "testing prototype inheritance"
description: "Exploring prototype inheritance in JavaScript using the call method to inherit properties and methods between objects and functions"
pubDate: "2018-11-21"
tags:
  - design patterns
  - prototype
  - inheritance
categories:
  - design patterns
draft: false
heroImage: "/blog-placeholder-17.jpg"
---

https://stackoverflow.com/questions/53406070/using-call-to-inherit-objects-from-a-function

```js
// testing Call to inherit objects / functions
// -------------------------------------------

// we declare our first function
const funcA = function (firstName) {
  this.firstName = firstName;
  this.getFirstName = function () {
    return "My name is " + this.firstName;
  };
  return this;
};
// Create an object out of that function
const objA = new funcA("Rodrigo");

// declare second function
const funcB = function (lastName) {
  this.lastName = lastName;
  this.getLastName = function () {
    return "My last name is " + this.lastName;
  };
  return this;
};

// Create an Object from funcB and ObjectA
const objC = funcB.call(objA, "Erades");
// We get an object
console.log("TYPE OF: ", typeof objC);
console.log("raw:", objC);
console.log("method A: ", objC.getFirstName());
console.log("prop A: ", objC.firstName);
console.log("method B: ", objC.getLastName());
console.log("prop B: ", objC.lastName);
console.log("------------");

// if we don't want to create an object out of a function and an object,
// we could also inherit two functions, but the result really surprise me
const funcC = funcB.call(funcA, "Alonso");
// We get a function !!!!!
console.log("TYPE OF: ", typeof funcC);
console.log("raw:", funcC);
// To get result we need to do this:
console.log("method ==>: ", funcC("Rui"));
console.log("method A: ", funcC("Rui").getFirstName());
console.log("prop A: ", funcC("Maria").firstName);
console.log("method B: ", funcC.getLastName());
console.log("prop B: ", funcC.lastName);
console.log("------------");
```
