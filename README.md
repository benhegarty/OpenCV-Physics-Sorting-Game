# About
This project uses Node.js, OpenCV, WebSockets and Phaser.io to allow a user to play a game without touching their computer.

[Link to project page](https://www.benhegarty.com/project/opencv-html5-physics-game)

## Requirements
- MacOS
- A Webcam

## Setup
- Install Node.JS
- Install OpenCV 2 (via. homebrew. Package name: `OpenCV@2`)
- Clone this repo onto your PC
- `cd` into the repo folder
- Run `npm install` to install dependencies
- Update `lower_threshold` and `upper_threshold` in app.js file to correctly mask out the object you'd like to use. This will require some trial and error. You need the restart the app after each adjustment.
- Run`node app.js`
- The game will be hosted at `http://localhost:8080` if all went well!