---
title: Useful ImageData Methods
tags: [canvas, js]
date: 16/11/2024
---

When creating a 2d game on canvas I like to render the sprites on an offscreen canvas and access them
via retrieving their ImageData.

<!-- more -->

Usually this will look something like the following, when working on a 2d grid based game.

```javascript
function getSprite(spritesheetCtx, x, y, size) {
	return spritesheetCtx.getImageData(size * x, size * y, size, size)
}
```

Below are three useful methods that build on this technique.

## Clone ImageData

When `ctx.getImageData` is called, it returns an `ImageData` object. This `ImageData` object can then
be rendered and manipulated. When manipulating the `ImageData` object we will want to create a copy
so that the original is not altered. To do this we use the following method.

```javascript
function cloneImageData(imageData) {
	const data = new Uint8ClampedArray(imageData.data)
	return new ImageData(data, imageData.width, imageData.height)
}
```

The data held by an `ImageData` instance is a `Uint8ClampedArray`. To copy the data a new `Uint8ClampedArray`
is instantiated from the original `ImageData` object and passed as a constructor argument to the new one.

## Color Mask

I like to use Kenny's massive [one bit tile pack](https://kenney-assets.itch.io/1-bit-pack) when creating small
2d games. I use the non-colored white version. This allows me to add a color mask to the sprites, so that I
can have them be any color I like.

Again I will render the spritesheet on an offscreen canvas and pre-fetch the sprites before game starts. I use
the following method in order to apply a color mask to the sprites.

```javascript
function applyColorMaskToImageData(imageData, maskColor) {
	const { data } = imageData
	const [maskR, maskG, maskB, maskA] = maskColor;

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const a = data[i + 3];

		data[i] = (r * maskR) / 255;
		data[i + 1] = (g * maskG) / 255;
		data[i + 2] = (b * maskB) / 255;
		data[i + 3] = (a * maskA) / 255;
	}

	return imageData
}
```

This method takes and `ImageData` object, which should be a copy from `cloneImageData`, and applies the passed in
rgba values as a mask. This can be used like so.

```javascript
// initial sprite to copy
const skeletonSprite = getSprite(spritesheetCtx, 1, 1)
// sprite with red color mask applied
const redSkeletonSprite = applyColorMaskToImageData(cloneImageData(skeletonSprite), [255, 0, 0, 0])
```

## Flip Horizontally

Tile packs usually only contain sprites facing in one direction. This means that if a sprite is facing
left and you want it to face right, you will need to _flip_ the sprite on a horizontal access. Again
this is achieved by modifying the `ImageData`.

```javascript
function flipImageDataHorizontally(imageData) {
	const { width, height, data } = imageData;
	const flippedData = new Uint8ClampedArray(data.length);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const srcIndex = (y * width + x) * 4;
			const destIndex = (y * width + (width - x - 1)) * 4;

			flippedData[destIndex] = data[srcIndex];
			flippedData[destIndex + 1] = data[srcIndex + 1];
			flippedData[destIndex + 2] = data[srcIndex + 2];
			flippedData[destIndex + 3] = data[srcIndex + 3];
		}
	}

	return new ImageData(flippedData, width, height);
}
```

With the sprite now flipped on it's horizontal acces it can be used like so.

```javascript
// initial sprite to copy
const skeletonSprite = getSprite(spritesheetCtx, 1, 1)
// left facing instance of ImageData
const leftFacingSkeletonSprite = flipImageDataHorizontally(cloneImageData(skeletonSprite))
```