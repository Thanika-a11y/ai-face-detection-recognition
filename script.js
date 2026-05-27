// script.js

const video = document.getElementById("video");
const statusText = document.getElementById("status");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(
    "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights"
  ),

  faceapi.nets.faceLandmark68Net.loadFromUri(
    "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights"
  ),

  faceapi.nets.faceRecognitionNet.loadFromUri(
    "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights"
  )
])

.then(startVideo)

.catch(err => {
  console.error(err);
  statusText.innerHTML = "❌ Model Loading Failed";
});

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      statusText.innerHTML = "✅ AI Models Loaded";
    })
    .catch(err => {
      console.error(err);
      statusText.innerHTML = "❌ Webcam Access Denied";
    });
}

video.addEventListener("play", () => {

  const canvas = faceapi.createCanvasFromMedia(video);

  document.body.append(canvas);

  const displaySize = {
    width: video.width,
    height: video.height
  };

  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {

    const detections = await faceapi
      .detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections =
      faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    faceapi.draw.drawDetections(
      canvas,
      resizedDetections
    );

    faceapi.draw.drawFaceLandmarks(
      canvas,
      resizedDetections
    );

  }, 100);

});
