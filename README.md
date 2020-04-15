# Drawing The Pyramid

> WORK IN PROGRESS

This project has two goals:

* Provide an easy way to draw a test automation pyramid with proper proportions.
* Provide a good example for doing property based testing in JavaScript using [fast-check](https://www.npmjs.com/package/fast-check). You might want to consider this example for a [Coding Dojo](#Using-in-a-Coding-Dojo) on that topic.

Watch live on [paulroho.com/DrawingThePyramid](https://paulroho.com/DrawingThePyramid).

> For a concise introduction to Property based testing refer to the wonderful 15' talk [The Magic of Generative Testing: Fast-Check in JavaScript](https://www.youtube.com/watch?v=a2J_FSkxWKo) by [Gabriel Lebec](https://github.com/glebec).

## Getting Started

### Get the Sources

Clone the repository

    $ git clone https://github.com/paulroho/DrawingThePyramid.git
    $ cd DrawingThePyramid

### Setup

    $ npm install

This downloads all the npm-packages as stated in project.json.

### Watch it in the Browser

    $ npm start

This starts a [life-server](https://www.npmjs.com/package/live-server) and opens the url in your browser. life-server is started with the `--watch=.` switch, you do not have to refresh your browser. life-server does it for you on saving any file. Press `Ctrl+C` to stop the server.

Hint: As you are probably not too much interested in observing the output of the live-server, you might consider running this command from a integrated terminal of your IDE, such as Visual Studio Code.

Refer to [Known Issues - Browser Support](#browser-support).

## Run the Tests

On a dedicated terminal from project root:

    $ npm test

This starts [mocha](https://www.npmjs.com/package/mocha) with the `--watch` switch automatically re-running the tests on each file change. Use `Ctrl+C` to cancel test execution.

Hint: You better start this command from a terminal window external to your IDE.


## Known Issues

### Browser Support
* **Firefox on Android** - On Firefox for Android the input box for the numbers are partially covered by the classification input ([Issue #1](/../../issues/1))
* **Legacy Microsoft Edge** - While the code works fine with Mozialla Firefox and Google Chrome, legacy Microsoft Edge has some issues loading all assets properly.
    * Interestingly, if you have the debugger tools open, refreshing the page once or twice usually makes it work in Edge as well.


## Using in a Coding Dojo

This repo can work as the basis for a coding dojo learning the basics of property-based testing.

### Start with Branch DojoStart

The branch [DojoStart](../../tree/DojoStart) offers a starting point. A working setup of the code is in place, but its implementation is strikingly wrong:

![An out of shape pyramid](/assets/DojoStartPyramid.png)

A few tests are in place to see how to get started with implementing property-based tests.

### Roles for Pair-Programming

It is instructional (and fun BTW!) to make the excercise in pairs with very special roles:

#### The Tester

* Formulates a property
* Implements a property-based spec

Hint: Make sure that property and spec is very focused on just one single aspect.

#### The Developer

* Implements production code

Developers understand that it is their duty to satisfy whatever spec the tester wrote. But they should embody the following character:
* **Lazy** - They code just the minimum. No thinking ahead.
* **Mean** - Keeping the code buggy by all means brings them joy.
* **Devious**  - They do not want the code to be right.