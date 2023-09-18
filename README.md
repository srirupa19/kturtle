# KTurtle Clone

KTurtle Clone is an educational programming environment inspired by KTurtle, built with Angular and TypeScript. This project provides an interactive platform for beginners to learn programming concepts using the Logo programming language.
.

![Animation](/src/assets/animation.gif)

## Supported Commands

KTurtle Clone supports a subset of Logo commands, allowing users to create engaging turtle graphics and learn programming concepts. Here is a list of supported commands:

- `forward <DISTANCE>`: Move the turtle forward by the specified distance and draw a line along the path if the pen is down.

- `backward <DISTANCE>`: Move the turtle backward by the specified distance and draw a line along the path if the pen is down.

- `turnleft <ANGLE>`: Turn the turtle left by the specified angle in degrees.
- `turnright <ANGLE>`: Turn the turtle right by the specified angle in degrees.
- `direction <ANGLE>`: Set the turtle's direction to the specified angle in degrees, with 0 degrees being up.
- `center`: Move the turtle to the center of the canvas **without** drawing anything.
- `go <X>, <Y>`: Move the turtle to the specified position (X, Y) **without** drawing anything.
- `gox <X>`: Move the turtle on the X-axis to the specified position X **without** drawing anything.
- `goy <Y>`: Move the turtle on the Y-axis to the specified position Y **without** drawing anything.
- `penup`: Set the pen state to "up" (off), so the turtle won't draw lines when moving.
- `pendown`: Set the pen state to "down" (on), allowing the turtle to draw lines when moving.
- `penwidth <WIDTH>`: Set the pen width to the specified value (in pixels) for drawing lines.
- `pencolor <R>,<G>,<B>`: Set the pen color using RGB values (R, G, B) to specify the desired color.


## Run Project

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files