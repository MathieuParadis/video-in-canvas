# Canvas Video Player
The Canvas Video Player is a JavaScript application that plays a video composed of scenes on an HTML canvas. Each scene consists of an image and a text caption. The video can be played, paused, and stopped by clicking on the canvas.

## Features
- Play a video composed of scenes on an HTML canvas.
- Control playback (play, pause, stop) by clicking on the canvas.

## Installation

1. Clone this repository to your local machine:
```
git clone https://github.com/your-username/canvas-video-player.git
```

2. Install the package dependencies by running:
```
npm install
```

## Usage
1. Start the server by running:
```
npm start
```

2. Open your web browser and navigate to `http://localhost:3000`.

3. To play the video, simply click on the canvas. Click again to pause the video. To stop and restart from the beginning click stop

## Data Format
The video scenes are defined in an array of objects, where each object represents a scene with the following properties:

```javascript
[
  {
    index: 0,
    sentence: "This is a simple Javascript test",
    media: "https://miro.medium.com/max/1024/1*OK8xc3Ic6EGYg2k6BeGabg.jpeg",
    duration: 3
  },
  {
    index: 1,
    sentence: "Here comes the video!",
    media: "https://media.gettyimages.com/videos/goodlooking-young-woman-in-casual-clothing-is-painting-in-workroom-video-id1069900546",
    duration: 5
  }
]
```

## Enhancements
- [ ] Refactor code for improved readability and maintainability.
- [ ] Fix the issue where the video duration restarts from the beginning when pausing and resuming playback.
- [ ] Resolve the issue where text does not appear in video mode.
