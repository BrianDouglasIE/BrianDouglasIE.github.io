Prevent pixel art blur on canvas
15/10/2024
js,canvas
---

Nobody wants to see blurry pixel art rendered in a game. So let's investigate
how to render crisp pixel art images on a canvas element.

<!-- more -->

<magpie-trinket>
Full source code for this article is available at <a href="https://github.com/BrianDouglasIE/canvas-pixel-art">BrianDouglasIE/canvas-pixel-art</a>
</magpie-trinket>

## The task at hand

So for this demo let's say we want to render the sprite of our game's hero character
on a canvas. The sprite sheet that I will be using is from KenneyNL, it's the 1-Bit
monochrome asset pack. Each sprite in the canvas is 16x16 pixels in dimension. This
will be scaled up to around 4 times it's original size.

I want my canvas to be 640x480 pixels in dimension. If I were to draw a sprite
directly on the canvas it would look miniscule. If I were to draw it at 4 times it's
original size, it would look blurry. So the question is, how do I draw my scaled up
pixel art character without causing it to blur.

<chicken-asks>I bet this complex problem requires a complex solution</chicken-asks>
<magpie-replies>I bet the solution is a one liner</magpie-replies>

## Some boiler plate

Before I even get as far as rendering my pixel art character on a canvas there is some
initial boilerplate code that is needed.

Firstly I'll need to create a canvas element to render the game on. I can do that with
the following code. Which creates the canvas and appends it to the document's body. I
also set the canvas' width and height to be a quarter of the intended size. I will scale
this up later.

```javascript
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
document.body.appendChild(canvas)
canvas.height = 120
canvas.width = 160
```

Once this is in place I will add some functions to render the sprite sheet and extract the
image data of the sprite that I want to render. To do this I create a separate canvas. This
canvas will not be appended to the body of the html document as the user will never see it.
Instead it will be used to draw the sprite sheet in it's entirety. I will then grab the
individual sprites from it as and when they are needed. I also set the canvas to be scaled
up the target size using CSS. The code for this is below.

```javascript
const spriteCellSize = 16
const spriteSheet = new Image()
spriteSheet.crossOrigin = "anonymous"
spriteSheet.addEventListener("load", onLoad, false)
spriteSheet.src = "./monochrome-transparent.png"

const scale = 4
canvas.style.width = `${canvas.width * scale}px`
canvas.style.height = `${canvas.height * scale}px`

const spriteSheetCanvas = document.createElement('canvas')

let heroSprite = undefined

function onLoad() {
  if (!heroSprite) {
    spriteSheetCanvas.width = spriteSheet.width
    spriteSheetCanvas.height = spriteSheet.height
    const spriteSheetContext = spriteSheetCanvas.getContext('2d')
    clearScreen(spriteSheetContext, spriteSheetCanvas.width, spriteSheetCanvas.height)
    drawSpriteSheet(spriteSheetContext, spriteSheet)
    heroSprite = getSpriteSheetCell(spriteSheetContext, spriteCellSize, 26, 0)
  }

  clearScreen(ctx, canvas.width, canvas.height)
  ctx.putImageData(heroSprite, canvas.width / 2 - spriteCellSize / 2, canvas.height / 2 - spriteCellSize / 2)
}

function clearScreen(ctx, w, h) {
  ctx.save()
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
}

function drawSpriteSheet(ctx, spriteSheet) {
  ctx.drawImage(spriteSheet, 0, 0)
}

function getSpriteSheetCell(ctx, spriteCellSize, col, row) {
  const x = spriteCellSize * col
  const y = spriteCellSize * row
  return ctx.getImageData(x, y, spriteCellSize, spriteCellSize)
}
```

Here is what is rendered on the canvas. As you can see it is super blurry.

![blurry sprite render](/images/blurry-sprite-render.png)

## The solution

One line of CSS fixes this. Setting the `image-rendering` property on the canvas to be `pixelated`.
In the demo code this can be done by adding the following statement at line 10.

```javascript
canvas.style.imageRendering = "pixelated"
```

The canvas now renders a crisp sprite.

![crisp sprite render](/images/crisp-sprite-render.png)
