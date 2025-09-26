Deploy a website, you can.
26/03/2025
apache
---

It's 2025, and you cannot deploy a website. Sure you can write a mind boggling React app.
But you have no idea how to get a dynamic website live. Not without some service that automates
the process for you, whilst robbing you of the knowledge you need to do it yourself.

<!-- more -->

So I am going to take you through the steps required to get a dyanmic website live on a remote server.
I am going to use Hetzner cloud to host a LAMP stack website.

<magpie-trinket>LAMP stands for Linux, Apache, MySQL, and PHP. It's the ultimate stack for building websites. Everything else is just pretentious fluff.</magpie-trinket>

After reading through this post you will be _enlightened_. You will reject complexity and take back
control. You don't need Vercel, Netlify, Heroku, etc... You have the ability to learn and do all
that yourself. These companies have gaslit you into thinking that you *CANNOT*. But I assure you, you *CAN*.

## Linux



## Apache

`man apt`

```
sudo apt update
sudo apt upgrade
sudo apt install apache2 apache2-dev
```

`man systemctl`

```
sudo systemctl enable apache2
sudo systemctl status apache2
```

### SSL

Earlier you installed Ubuntu 24.4 LTS, this comes with `openssl` installed. This means you do not have to fetch
it via `apt`. If, for some reason it's not present, install it with `sudo apt install openssl`.

Now let's enable the ssl module and restart apache.

```
sudo a2enmod ssl
sudo systemctl restart apache2
```

With the ssl module enabled, the next step is to generate a self signed ssl cert. To do this run the command below.
It will create the `/etc/apache2/ssl` folder where the generated `.key` and `.crt` files will be stored. Then run
openssl specifying those folders. You will be prompted to answer some questions. Use your common sense here.

```
sudo mkdir -p /etc/apache2/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/ssl/apache.key -out /etc/apache2/ssl/apache.crt
```


## MySQL

## PHP

```
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.3)"
```

```
apachectl -M | grep php
```

```
sudo apt install libapache2-mod-php8.3
sudo a2enmod php8.3
```

<chicken-asks>Isn't `php-fpm` faster and more flexible?</chicken-asks>
<magpie-replies>Yes, and it allows you to serve sites with different php versions. But untill our needs _actually_ surpass `php_mod`, it's perfectly acceptable to use.</magpie-replies>
<chicken-asks>You are right, chances are our site will never have high traffic.</chicken-asks>
<magpie-replies>If it did you'd never cross the road.</magpie-replies>

```
cd /var/www/html
sudo chown $(whoami) -R .
touch info.php
```

```php
<?php phpinfo(); ?>
```


## Enlightenment

That was a lot. But you got through it. You now have a website that is _live_. You did all the steps yourself.
You gained knowledge, and you can do it again. You are now empowered to deploy more sites, add new features,
iterate, and improve. I'm proud of you.

Now I encourage you to continue to reject complexity. Forget Vercel, forget React. Just render some HTML and send
it across the internet. Because that is freedom. Using some big tech bro framework or platform robs you of the
skills you need to succeed. Have confidence, do it yourself. I assure you, you *CAN*.
