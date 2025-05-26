---
title: "New Lib: Placeholder Image Generator"
date: 26/05/2025
tags: [java]
---

I've recently had the need to generate placeholder images for a webapp. User's of this app are not required
to upload a profile image, even though they can. This means that a fallback or "placeholder" image is required
for those that choose not to upload a profile image. To facilitate this I developed a neat little package that
can be reused in any app. The details of which are below.

<!-- more -->

## Placeholder Image Generator

![Maven Central Version](https://img.shields.io/maven-central/v/ie.briandouglas/PlaceholderImageGenerator)
[![javadoc](https://javadoc.io/badge2/ie.briandouglas/PlaceholderImageGenerator/javadoc.svg?bustcache)](https://javadoc.io/doc/ie.briandouglas/PlaceholderImageGenerator)

This simple utility generates customizable placeholder images in Java using AWT. It is useful for creating mock user avatars, image placeholders in UI development, or dynamically generated image content.

## Features

* Set image dimensions and text
* Choose custom font and font size
* Configure text and background colors
* Enable or disable anti-aliasing for smoother text rendering

## Installation

Add the following dependency to your Maven `pom.xml`:

```xml
<dependency>
    <groupId>ie.briandouglas</groupId>
    <artifactId>PlaceholderImageGenerator</artifactId>
    <version>1.0.1</version>
</dependency>
```

Or if you're using Gradle:

```kotlin
dependencies {
    implementation("ie.briandouglas:PlaceholderImageGenerator:1.0.1")
}
```

## Example usage:

```java
public class Main {
    public static void main(String[] args) throws IOException {
        var placeholderImage = new PlaceholderImage();

        var options = PlaceholderImageOptions.builder()
                .text("BD")
                .width(400)
                .height(400)
                .backgroundColor(Color.decode("#DCDCDC"))
                .font(new Font("Arial", Font.BOLD, 200))
                .build();

        var image = placeholderImage.generate(options);
        ImageIO.write(image, "png", new File("placeholder.png"));
        System.out.println("Generated placeholder.png");
    }
}
```

This example will generate a centered `"BD"` in bold Arial on a `400x400` image with a light gray background, saved as `placeholder.png`.

![Example placeholder image](/images/placeholder.png)

## Documentation

See [javadoc.io](https://javadoc.io/doc/ie.briandouglas/PlaceholderImageGenerator/latest/index.html)

### `PlaceholderImageOptions`

Encapsulates configuration options for generating a placeholder image.

```java
PlaceholderImageOptions.builder()
    .text("AB")                                // Text to display
    .width(300)                                // Width in pixels
    .height(300)                               // Height in pixels
    .textColor(Color.DARK_GRAY)                // Color of the text (optional, default: DARK_GRAY)
    .backgroundColor(Color.GRAY)               // Background color (optional, default: GRAY)
    .font(new Font("Arial", Font.PLAIN, 16))   // Font used for rendering (optional)
    .antiAliasOn(true)                         // Enable anti-aliasing (optional, default: true)
    .build();
```

### `PlaceholderImage`

Generates a `BufferedImage` using the provided `PlaceholderImageOptions`.

```java
BufferedImage image = new PlaceholderImage().generate(options);
```

## Dependencies

* Java 8+
* No external libraries required; uses `java.awt` and `javax.imageio`

## License

Apache 2.0
