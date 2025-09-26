Conway's Game of Life in Go
01/10/2024
go
---

Conway's _Game of Life_ is a relatively straight forward cellular automata.
I created an interactive demo using the rules that exists for it, using Go and Raylib.

<!-- more -->

<magpie-trinket>
Full source code is found on github, here <a href="https://github.com/BrianDouglasIE/conways-game-of-life">BrianDouglasIE/conways-game-of-life</a>.
</magpie-trinket>

Wikipedia tells me that these are the rules by which a cell can be determined to be _alive_ or _dead_.
 - Any live cell with fewer than two live neighbours dies, as if by underpopulation.
 - Any live cell with two or three live neighbours lives on to the next generation.
 - Any live cell with more than three live neighbours dies, as if by overpopulation.
 - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

With this in mind I was able to create the below demo. I added interactivity by allowing the user to click
a cell to toggle it's state between _dead_ and _alive_. Pressing the up arrow key runs the next cycle.

<video width="100%" controls>
    <source src="/videos/game-of-life-raylib-go.mp4" type="video/mp4">
    <source src="/videos/game-of-life-raylib-go.webm" type="video/webm">
    Your browser does not support the video tag.
</video>
