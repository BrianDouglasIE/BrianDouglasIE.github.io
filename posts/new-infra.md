---
title: Hosting this blog
tags: [devops]
date: 09/12/2025
---

"Every developer should host their own blog". Is a statement repeated regularly across socials.
I agree, they should. But I didn't untill now, so don't beat yourself up over it. Here is
a quick run down of how this blog is hosted.

<!-- more -->

<magpie-trinket>Hosting your own blog will give you a good idea of how the web works, and help hone you devops skills. So it's worth taking the time to do so.</magpie-trinket>

Firstly, this is just a static html blog. I have a js script which builds the site, converting markdown
files to html, and ordering them based off some frontmatter. Simple and effective.

Untill now I have used Github pages to host the blog. Which takes a a public repo called {username}.github.io
and serves the contents of the _/docs_ folder at that domain name. I then just added an A record to point my custom
domain name to github's specified ips, and voila I had a static site using my custom domain name, that updated whenever
I pushed to that repo.

Now however I have decided to take the time to manage my own server. So after some investigation
I chose to use a Fedora42 instance on a cheap [UpCloud](https://upcloud.com) server located in London.
In order to switch to this server I updated the aforementioned A records on my nameserver provider to
point to the new Fedora instance. On which I have running Caddy web server, to take advantage of it's auto
https feature. This is hella handy (certbot works but can be tricky). So now my site is live and I use rsync
to update it whenever I right a new post. I've created a simple shell script to run the update with one command.

No I can say I _manage my own server_, and get street cred. Or maybe cloud servers don't count. I should
actually be running it off an old Nokia 3310 for ultimate street cred.

Anyways here is the deply script I mentioned.

```sh
#!/bin/sh
node ./main.js
rsync -avz --delete ./build/* root@00.000.000.00:/var/www/briandouglas/
```
