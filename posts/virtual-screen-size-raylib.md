---
title: Using a virtual screen size in Raylib
tags: [c, raylib, gamedev]
date: 24/02/2025
---

When working with pixel art it is common to create a virtual screen size. For example
if my sprites are 16x16 pixels and my game world is 256x256. I would want to scale the
size up to fit my computer's screen size. If the art was not scaled it would look 
really tiny, on a 1920x1080 monitor.

<!-- more -->

This is where the concept of a virtual screen size comes into play. I can virtually limit
my game to use a small screen size, and then scale that up to match the target _window_ size.
In raylib this is achieved using a `RenderTexture2D`.

## Implementation

First off I like to define some constants.

```c
#define V_SCREEN_WIDTH 256
#define V_SCREEN_HEIGHT 256
#define V_SCALE 2
#define SCREEN_WIDTH  V_SCREEN_WIDTH * V_SCALE
#define SCREEN_HEIGHT V_SCREEN_HEIGHT * V_SCALE
```

In the above code the prefix `V_` refers to virtual. So I am setting my virtual screen size to 
256x256 pixels and applying the `V_SCALE` to get the actual window size. In this instance 
`256 x 2 = 512`.

When opening a window with raylib I will pass in the `SCREEEN_WIDTH` and `SCREEN_HEIGHT` constants
to the `InitWindow` method like so.

```c
InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Game Title");
```

This will open a correctly sizeed game window. I now want to create a `RenderTexture2D`. This 
is what the game will be drawn on. It will then itself be scaled and drawn onto the actual game
window. To create the `RenderTexture2D` I use the following code.

```c
const RenderTexture2D renderTexture = LoadRenderTexture(V_SCREEN_WIDTH, V_SCREEN_HEIGHT);
const Rectangle renderTextureSrc = (Rectangle){ 0.0f, 0.0f, V_SCREEN_WIDTH, -V_SCREEN_HEIGHT };
const Rectangle renderTextureDest = (Rectangle){ 0.0f, 0.0f, SCREEN_WIDTH, SCREEN_HEIGHT };
const Vector2 renderTextureOrig = {0};

// remember to unload the texture when finished using it
UnloadRenderTexture(renderTexture);
```

<magpie-trinket>
Notice that the <code>renderTextureSrc</code> rectangle uses a negative value for it's height.
This is to prevent the texture from being drawn on upside down. The reasoning is helpfully explained
in the <a href="https://github.com/raysan5/raylib/wiki/Frequently-Asked-Questions#why-is-my-render-texture-upside-down">raylib docs</a>.
</magpie-trinket>

The render texture can then be drawn on to by creating a new texture mode.

```c
BeginTextureMode(renderTexture);
    ClearBackground(BG_COLOR);
    DrawTextureRec(spritesheet, playerFrame, playerPos, WHITE);
EndTextureMode();
```

After this code is run the `RenderTexture2D`'s texture is then drawn on to the main draw context at the
correct scale.

```c
BeginDrawing();
    ClearBackground(BG_COLOR);
    DrawTexturePro(renderTexture.texture, renderTextureSrc, renderTextureDest, renderTextureOrig, 0, WHITE);
EndDrawing();
```

This results in the small 16x16 pixel art being drawn at the correct scale, without loss of fidelity.

