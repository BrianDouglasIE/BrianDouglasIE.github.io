---
title: Using Docker on Linux Mint
date: 02/04/2025
tags: [docker, linux]
---

Surely using Docker on Linux Mint is the same as Ubuntu? I can just follow the official Ubuntu
install guide.

<!-- more -->

Well this is not quite true. Yes, Linux Mint is built on Ubuntu and using Docker should be the
same. *BUT* the official install guide will not work for you. There is a minor tweak that is required.
And that is why this article exists.

## The "Official" install command (02/04/2025)

Here is the official install command from the Ubuntu docker guide ([install/ubuntu](https://docs.docker.com/engine/install/ubuntu/)).

```
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

When you run this it will complain. You will see the following error.

```
E: The repository 'https://download.docker.com/linux/ubuntu vera Release' does not have a Release file.
```

Notice the _"vera"_ release. Ubuntu has no release named _vera_. That is the Linux Mint release version. This is the crux
of the issue.

## The install command you are looking for

The fix here is to use the Debian download passing in the latest Debian release name. This is currently _"bookworm"_.

The updated command is below. I have hard coded the release name as _bookworm_ and updated the download url to use 
_debian_ instead of _ubuntu_.

```
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  bookworm stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

I hope this solves your issue, and that docker is now running on your lovely Linux Mint instance.
