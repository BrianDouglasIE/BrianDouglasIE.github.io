---
title: "GameDev in C Part 3: Drawing a Slime"
date: 31/01/2025
tags: [c, raylib, gamedev]
---

It's part 3 and I am finally able to draw something meaningful on the screen.

<!-- more -->

I've decided that the game will be a DoodleJump clone, named SlimeJump. The 
goal will be to ascend to the highest platform possible. Sort of like a vertical
endless runner. The Slime's movement will be somewhat limited to add to the 
difficulty. There will be a start menu and high score list. I will create the
sprites and sfx myself.

## The Slime

I have decided to go with pixel art. This means that the Slime will consist of
16x16 pixel frames. Each frame will correspond to a bounding box that will be 
displayed based on the Slime's state _(which will be the topic of part 4)_ and
animation duration.

I've used a really nice image editor called [Aseprite](https://www.aseprite.org/)
to create the pixel art for the slime. It had some preloaded color pallettes so
I decided to go for the default _pico-8_ pallette that was availabel. I really liked
the bold popping colors. The resulting Slime sprite sheet is below. You can see that
I added an idle, walk, jump charge, damage, and death sequence. These will correspond
to Slime's game state.

<img alt="The slime spritesheet" src="/images/slime.png" style="width: 500px; image-rendering: pixelated; margin: 2rem 0;" />

<magpie-trinket>
The image above is only 144x16 pixels in size. If you are wondering how he got it to render crisply at 500px width,
It's by adding the css rule <code>image-rendering: pixelated;</code>.
</magpie-trinket>

## Rendering a texture

When it comes to drawing the sprite on the screen. Raylib requires the texture to be
loaded first. Naturally this requires the `LoadTexture` method. This must be called 
after the window is initialised. Otherwise you will see some random error that is not
at all self explanatory. The code I use to render the texture looks like this:

```c
const Texture2D slime_texture = LoadTexture("assets/sprites/slime.png");
```

It's also important to remember that the texture needs to be unloaded. This is done like so,
outside of the game loop.

```c
UnloadTexture(slime_texture);
```

In order to draw a single frame of the texture to the screen the `DrawTexturePro` method is used.
This will take a texture, along with a source (frame_rec), and dest (player_bounds). The resulting
code looks like this.

```c
Rectangle frame_rec = { 0, 0, 16, 16 };
DrawTexturePro(slime_texture, frame_rec, player_get_bounds(&player), sprite_origin, 0, WHITE);
```

If you have experience with raylib or gamedev in general, you notice that an important part is left out.
If this code were to run now, a 16x16 pixel slime would be drawn to the screen. Which would be much
to small to be usable. So the sprite needs to be scaled up. In order to do this a render texture must be
created.

A render texture is something that can be drawn to at a smaller scale, then drawn itself at a large scale
on the screen. To make this work a virtual screen width and height will be defined. I want the game window
to be 480x855 pixels in size. The virtual width of the game will be 160x285 pixels. This means that the Slime
will take up more space on the virtual screen, eg: it will look correctly sized. I define the screen sizes as
macros.

```c
#define SCREEN_WIDTH 480.0f
#define SCREEN_HEIGHT 855.0f

#define V_SCREEN_WIDTH 160.0f
#define V_SCREEN_HEIGHT 285.0f
```

I then create the render texture, with a source rec (the virtual screen size), and a dest rec (the scaled screen size).

```c
const RenderTexture2D render_texture = LoadRenderTexture(V_SCREEN_WIDTH, V_SCREEN_HEIGHT);
const Rectangle render_texture_src = {0, 0, V_SCREEN_WIDTH, -V_SCREEN_HEIGHT};

const float virtual_ratio = (float) SCREEN_WIDTH / (float) V_SCREEN_HEIGHT;

const Rectangle render_texture_dest = {
    -virtual_ratio, -virtual_ratio, SCREEN_WIDTH + (virtual_ratio * 2), SCREEN_HEIGHT + (virtual_ratio * 2)
};
```

The draw loop will then need to be updated as follows to account for drawing to the render texture. Then drawing
that render texture to the main out. Raylib provides the `BeginTextureMode` and `EndTextureMode` methods to accomodate
this like so:

```c
BeginTextureMode(render_texture);
ClearBackground(RAYWHITE);
DrawTexturePro(slime_texture, frame_rec, player_get_bounds(&player), sprite_origin, 0, WHITE);
EndTextureMode();

BeginDrawing();
DrawTexturePro(render_texture.texture,
        render_texture_src,
        render_texture_dest,
        sprite_origin,
        0,
        WHITE);
EndDrawing();
```

This will result in the following. Note the screenshot contains a floor which I have left out of these code examples.

![the slime on screen](/images/slime-part-3.png)