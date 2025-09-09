---
title: "particle system"
pubDate: 2019-01-11
description: "Exploring particle system animation techniques using Canvas and JavaScript for creating dynamic visual effects"
tags:
  - particle system
categories:
  - experiment
draft: false
heroImage: /blog-placeholder-11.jpg
---

<canvas id="canvas" style="background-color:black; height:100%; width:100%"></canvas>

<script type="module" src="/js/experiments/fn/scene.js"></script>

As a side project, I created a small particle system.
In addition to creating the particle system, I implemented the same functionality by approaching the project with two different paradigms: on one hand, object-oriented programming using classes (ES6), and on the other hand, with a functional approach.

https://github.com/rerades/particle-system-es6

**Project Summary**

- **Objective:** simulate a particle system in Canvas with two approaches: OOP (ES6 classes) and functional (data + pure functions).
- **Actors:** `Particle` (moving entity), `Emitter` (particle emitter), `Field` (gravitational/repulsive field), `Display` (canvas drawing), and an orchestration layer (`ParticleSystem`/`Scene` in OOP; `scene.js` + utilities in functional).
- **Result:** particles emitted with initial angle/velocity, affected by positive/negative fields, that update and draw in each frame.

**Physics and Movement**

- **Field acceleration:** for each particle, a vector is calculated from the particle towards each field. The force is proportional to the field's mass and inversely proportional to the distance cubed (prevents explosions near 0 and decays quickly with distance).
- **Simple integration:** in each frame, `acceleration -> velocity -> position` (vector sum). Particles outside canvas boundaries are filtered out.
- **Key parameters:** field mass (sign defines attraction/repulsion), emitter frequency, emission angle spread (`spread`), and particle size/color.

**OOP Approach (Object-Oriented)**

- **Main classes:** `Vector`, `Particle`, `Emitter`, `Field`, `Display`, `ParticleSystem`, `EventHandler` and `PSEvent`.
- **Architecture:** `Scene` initializes the `canvas`, creates `Display`, registers listeners in an `EventHandler` (singleton) and delegates simulation to `ParticleSystem` (add emitters/fields, update and draw).
- **Loop:** `Display` manages `requestAnimationFrame` and emits events (`beforeUpdate`, `update`, `draw`, etc.). `ParticleSystem` responds to these events to add new particles, apply fields and draw everything.
- **Advantages:** state encapsulated per instance, clear event flow, separation between logic (system) and representation (`Display`).

**Functional Approach**

- **Immutable data and pure functions:** entities like `Particle`, `Field` or `emitter` are object "constructors"; operations (`move`, `attachToEmitter`, `Vector` utilities) return new values.
- **Composition:** the loop in `scene.js` uses `pipe`/`tap` to compose steps: add new particles by emitter and frequency, move them according to fields, clean by boundaries, and draw.
- **Decoupled drawing:** `Display` exposes pure functions that receive state and draw (rectangles or circles with gradient) without mutating the data source.
- **Advantages:** clarity in data flow, ease of testing functions in isolation and adjusting pipeline steps without side effects.

**Animation Loop**

- **Timing:** `requestAnimationFrame` coordinates rendering. In OOP, `Display` emits events per frame; in functional, the `loop` chains transformations of the particle collection and calls itself again.
- **Stop criteria:** in OOP it's limited by maximum number of frames; in functional the counter can be infinite (or bounded if desired).

**How to Run It**

- **Repositories/demos:** the code is in the linked repository. There are two HTML entries: `index-oo.html` (OOP) and `index-fn.html` (functional). Since ES6 modules are used, it's advisable to serve it with a simple server (for example: `npx simple-server`).

**Notes and Learnings**

- **Vector modeling:** central for forces and movement; reused in both paradigms.
- **Event-driven design vs. pipelines:** events (OOP) facilitate runtime modularity; pipelines (functional) facilitate reading and testing.
- **Sensitive parameters:** very high masses or large `spread` drastically change behavior; it's advisable to experiment with moderate values.
