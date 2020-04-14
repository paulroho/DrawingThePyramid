# Drawing The Pyramid

> WORK IN PROGRESS

This project has two goals:

* Provide an easy way to draw a test automation pyramid with proper proportions.
* Provide a good example for doing property based testing in JavaScript using [fast-check](https://www.npmjs.com/package/fast-check).

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



## Miscellaneous Hints

### VS Code: Toggle between Code and Terminal

Use `Ctrl+J` to switch focus between the code window and the current terminal. This creates a new terminal if you currently do not have one open yet. 
