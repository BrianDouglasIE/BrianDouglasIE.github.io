---
title: Homer's Drinking Bird
tags: [productivity, python]
date: 20/01/2025
---

Do you work for a large multinational? Do you have a minimal amount of work to do
during the day? Have they set your screen to go to sleep after 5 minutes of no
interaction?

Well then, look no further.

<!-- more -->

I have a simple Python script that you can run. It will simulate a mouse's right
click at a set interval.

<chicken-asks>Why a right click?</chicken-asks>
<magpie-replies>
  He tried making the mouse move, but the screen still went to sleep.
  A left click might take an action, so right clicking is safer.
</magpie-replies>

## The script

I call this script the "drinking bird" after that episode of the Simpsons
where Homer entrusted the nuclear power plant's safety over to a novelty toy.

![Homer's Drinking Bird](/images/drinking-bird.gif)

This script uses the [mouse](https://pypi.org/project/mouse/) package. Install
it via pip.

```python
import sched, time, mouse

INTERVAL = 120

def do_right_click(scheduler):
    scheduler.enter(INTERVAL, 1, do_right_click, (scheduler,))
    mouse.right_click()

my_scheduler = sched.scheduler(time.time, time.sleep)
my_scheduler.enter(INTERVAL, 1, do_right_click, (my_scheduler,))
my_scheduler.run()
```

As long as this is running, your screen won't go to sleep, and if you have your
company's chat client open, it will look like you are active.

Good luck on your side projects....
