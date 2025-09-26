Install OpenJDK on Ubuntu
02/04/2025
java
---

Let's install OpenJDK 21 LTS on Ubuntu.

<!-- more -->

The install command:

```
sudo apt install openjdk-21-jdk
```

## Using the correct Java version

It's likely that if you are a Java Developer that you will have multiple versions of Java installed.
To specify the default version of java to use we will run the `update-alternatives` command.

```
sudo update-alternatives --config java
```

This will list the available Java installs and request you to choose which one you want to use as the default.
You should see output similar to what is below. In this instance I choose 2. As I want to default to OpenJDK 21.

```
There are 2 choices for the alternative java (providing /usr/bin/java).

  Selection    Path                                         Priority   Status
------------------------------------------------------------
* 0            /usr/lib/jvm/java-21-openjdk-amd64/bin/java   2111      auto mode
  1            /usr/lib/jvm/java-11-openjdk-amd64/bin/java   1111      manual mode
  2            /usr/lib/jvm/java-21-openjdk-amd64/bin/java   2111      manual mode

Press <enter> to keep the current choice[*], or type selection number:
```

You can follow the same process to set the default `javac` command also.

## Setting the JAVA_HOME variable

In order to set up the `JAVA_HOME` variable we can use `update-alternatives` again. Running `sudo update-alternatives --config java`
will show the select Java path. We can take this and append it to our shell's path by adding the following to
our `.bashrc` file.

```
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64/
export PATH=$PATH:$JAVA_HOME/bin
```

To confirm this has worked reload your shell with `source ~/.bashrc` and run `echo $JAVA_HOME`. You should see output similar to:

```
/usr/lib/jvm/java-21-openjdk-amd64/
```

Now you can enjoy writing your enterprise Java code on Ubuntu. I know I do.
