import "./styles.css";
import * as tflite from "@tensorflow/tfjs-tflite";
import * as tf from "@tensorflow/tfjs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useState } from "react";

export default function App() {
  const [img, setImg] = useState(null);
  const [url, setUrl] = useState(
    "https://cdn.shopify.com/s/files/1/0272/4770/6214/articles/when-do-puppies-start-walking_1200x855.jpg?v=1593020034"
  );
  const [dims, setDims] = useState({
    width: null,
    height: null
  });
  const [working, setWorking] = useState(false);

  let tfliteModel = null;

  async function begin() {
    console.log("Loading...");
    tfliteModel = await tflite.loadTFLiteModel(
      "https://tfhub.dev/sayakpaul/lite-model/cartoongan/fp16/1?lite-format=tflite"
    );
    console.log("Model loaded");
  }

  async function predict() {
    setWorking(true);
    await begin();

    //loading imageData
    //TODO: add image uplaod option
    console.log("Begin prediction");

    const image = new Image();

    image.src = url;
    image.crossOrigin = "Anonymous";

    image.onload = function () {
      console.log("here");
      setDims({
        width: image.width,
        height: image.height
      });
      const inputTensor = tf.image
        // Resize.
        .resizeBilinear(tf.browser.fromPixels(image), [224, 224])
        // Normalize.
        .expandDims()
        .div(127.5)
        .sub(1);

      const outputTensor = tfliteModel.predict(inputTensor);
      const data = outputTensor.add(1).mul(127.5);
      const rgb = Array.from(data.dataSync());

      const rgba = [];

      for (let i = 0; i < rgb.length / 3; i++) {
        for (let c = 0; c < 3; c++) {
          rgba.push(rgb[i * 3 + c]);
        }
        rgba.push(255);
      }
      // Draw on canvas.
      setWorking(false);
      const imageData = new ImageData(Uint8ClampedArray.from(rgba), 224, 224);
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      ctx.putImageData(imageData, 0, 0);
      canvas.classList.remove("canvas");
    };
  }
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0];
      setImg(imgFile);
      console.log(URL.createObjectURL(imgFile));
    }
  };

  return (
    <div className="App">
      <div className="heading">
        <h1>Cartoongan</h1>
      </div>
      <TextField
        style={{ width: "50%" }}
        id="outlined-basic"
        label="Enter Image URL"
        variant="outlined"
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="container">
        <div className="inputimg">
          {url && <img className="image" src={url} alt="pup" />}
        </div>
        <div className="middle">{working && <CircularProgress />}</div>
        <div className="result">
          <canvas className="canvas" width="250px" height="250px" />
        </div>
      </div>
      <div>
        <Button onClick={predict} variant="outlined">
          Convert
        </Button>
      </div>
    </div>
  );
}
