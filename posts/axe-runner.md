AxeRunner
06/03/2025
java
---

AxeRunner is used to run accessibility tests on web pages using the [axe-core](https://www.deque.com/axe/) library in Java.

<!-- more -->

<magpie-trinket>Source code available at [BrianDouglasIE/AxeRunner](https://github.com/BrianDouglasIE/AxeRunner)</magpie-trinket>

It integrates with Selenium WebDriver to automate web accessibility testing, providing detailed reports on accessibility
violations, passes, and other relevant results. The resulting axe-core report is converted into Java classes so that it
can be used within a Java project and allows for type hinting.

Quick synopsis of the package.

## Features
- Runs accessibility tests on specified URLs.
- Uses Selenium WebDriver for browser automation.
- Configurable via `AxeSpec` and `AxeRunOptions`.
- Parses and categorizes accessibility test results.
- Supports axe-core rule customization.
- Supports axe-core localization.

## Prerequisites
- Java (JDK 8 or higher)
- Selenium WebDriver

## Installation
To use `AxeRunner`, include the following dependencies in your project:

### Maven
```xml
<dependencies>
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.x.x</version>
    </dependency>
    <dependency>
        <groupId>ie.briandouglas</groupId>
        <artifactId>axe_runner</artifactId>
        <version>0.0.1</version>
    </dependency>
</dependencies>
```

## Usage

### Creating an Instance
```java
WebDriver driver = new ChromeDriver(); // or any other WebDriver instance
AxeRunner axeRunner = new AxeRunner(driver);
```

### Running Accessibility Tests
```java
String url = "https://example.com";
AxeResults results = axeRunner.getAxeResults(url);
```

### Running with Custom Configurations
```java
AxeSpec spec = new AxeSpec(); // Define accessibility testing specifications
AxeRunOptions options = new AxeRunOptions(); // Define run options
AxeResults results = axeRunner.getAxeResults(url, spec, options);
```

### Accessing Results
```java
System.out.println("Violations: " + results.violations.size());
System.out.println("Passes: " + results.passes.size());
```

## Error Handling
- If `axe-core.min.js` fails to load, an exception is thrown.
- If Selenium fails to navigate to the page, the WebDriver is closed.
- JSON processing errors during configuration are logged.

## License
This project is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.txt).

## Contributing
- Fork the repository.
- Create a feature branch.
- Submit a pull request.
