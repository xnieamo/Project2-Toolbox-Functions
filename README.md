# Project 2: Toolbox Functions, Wings!
-------------------------------------
* Xiaomao Ding
* CIS700-Procedual Graphics, UPenn

![demo](https://github.com/xnieamo/Project2-Toolbox-Functions/blob/master/reference/wings.gif?raw=true)

## Intro
This project aims to procedurally generate a bird wing. This is done using a mix of different curves for the outline of the wing and then distributing feathers onto the curve at a desired density to form the wing itself. Here is the [online demo](https://xnieamo.github.io/Project2-Toolbox-Functions/).

## Controls
* `fov` - Changes FOV of the camera.
* `density` - Adjusts the density of feathers distributed on the wings.
* `bias` - Adjusts the bias term used for the outer segment of the wing. This changes the curvature of that part.
* `speed` - Adjusts the up-down motion of the feathers. The motion is calculated using a sine function.
* `speedF` - Adjusts the up-down motion of the wing joints. Also calculated using a sine function.
* `scale` - Scales the amplitude of the feather sine function.
* `size` - Length of feathers.
* `wind` - Adjust feather jitter effects.
* `shoulderCurve` - Adjust the curvature of the inner part of the wing. This is down using a quadratic.
* `outerColor`/`innerColor` - Color of the large/small feathers.
