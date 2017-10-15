// Include OpenCV module so we can see
var cv = require('opencv');

// Include express so we can serve the webpage (and sockets server)
var express = require('express');
var app = express();

// Create a http server and attach a sockets server
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Start server on port 8080
server.listen(8080);

// Website is contained in the 'public' folder. Serve from there please express.
app.use(express.static('public'))

// IMPORTANT!!!!
// You'll need to update these values so your ruler (or object) is masked out.
// (H)ue, (S)aturation, (V)Brightness (I don't know why)
var lower_threshold = [160, 100, 50];
var upper_threshold = [175, 256, 256];

// Define smallest detectable object size
// This is so we can eliminate noise!
var minArea = 2500;

var lastAngle; // Used to prevent sockets sending duplicate messages

try {
  // Start the camera
  var camera = new cv.VideoCapture(0);

  // Load a window (to show the masked image preview)
  var window = new cv.NamedWindow('OpenCV Mask', 0);

  function processFrame() {
    camera.read(function(err, im) {
      if (err) throw err;
      
      // Apply blur and color adjustments
      im.gaussianBlur([9,9]);
      im.convertHSVscale();
      
      // Filter out colors which we aren't interested in
      im.inRange(lower_threshold, upper_threshold);

      // Take a copy of the frame here to use in preview window
      var output = im.copy();

      // Erode to simplify the shapes
      var verticalStructure = cv.imgproc.getStructuringElement(1, [1, 20]);
      im.erode(1, verticalStructure);

      // Find the shapes
      var contours = im.findContours();

      // Cycle through shapes, detecting if any are big enough
      // (according to the minArea variable)
      for(i = 0; i < contours.size(); i++) {
        if(contours.area(i) > minArea) {

          // Get angle
          var angle = -contours.minAreaRect(i).angle;

          // Adjust angle to match ruler angle
          if (angle > 45) angle = angle - 90;

          // Send out via sockets (if not the same as the last measured angle)
          if (angle != lastAngle) io.sockets.emit('angle', angle);
          lastAngle = angle;
        }
      }

      // If the output frame exists, show it in the window
      if (outputim.size()[0] > 0 && output.size()[1] > 0){
        output = output.flip(1);
        window.show(output);
      }

      // Close the window on keypress
      window.blockingWaitKey(0, 50);

      // This frame is done, so process the next frame!
      processFrame()
    });
  }

  // Kick off the frame processing
  processFrame();

} catch (e){
  console.log("Couldn't start camera:", e)
}