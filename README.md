# Canimation

A simple canvas library for animation.

> Only support IE9+

## Concept
What is Animation? Animation is the transition from one state to another. Thus generally any animation could be made up of three factors: the initial state, the final state and the duration.

At anytime during the transition, the intermediate state which is also called a frame could be calculated automatically based on these factors. And Easing functions are often used to process the time-varying params to make the motion more dynamic.

## Basic Usage
Move a circle straight to the right side

```
var canvas = document.getElementById('canvas')
var cnm = new Canimation(canvas, window.innerWidth, window.innerHeight);
cnm.createAnimation({
  circle: {
    from: {
      x: 200,
      y: 300,
      r: 15
    },
    to: {
      x: 500
    },
    duration: 3000
  }
});
```

Let the circle scale up at the same time
```
cnm.createAnimation({
  circle: {
    from: {
      x: 200,
      y: 300,
      r: 15
    },
    to: {
      x: 500,
      r: 30
    },
    duration: 3000
  }
});
```

Move more than one circle to any space
```
cnm.createAnimation({
  circle: {
    from: [{
      x: 100,
      y: 100,
      r: 10
    }, {
      x: 200,
      y: 200,
      r: 20
    }, {
      x: 300,
      y: 300,
      r: 30
    }],
    to: [{
      x: 500,
    }, {
      y: 500,
    }, {
      x: 500,
      y: 500
    }],
    duration: 3000
  }
});

## examples

<a href="https://bison1994.github.io/kidney/canimation/example/example1.html" target="_blank">example1</a>
<br>
<a href="https://bison1994.github.io/kidney/canimation/example/example2.html" target="_blank">example2</a>

