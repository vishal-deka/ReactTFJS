import "./styles.css";
import * as tflite from "@tensorflow/tfjs-tflite";
import * as tf from "@tensorflow/tfjs";

import { useState } from "react";

export default function App() {
  const [img, setImg] = useState(null);
  const [url, setUrl] = useState(null);
  const [dims, setDims] = useState({
    width: null,
    height: null
  });

  let tfliteModel = null;

  async function begin() {
    console.log("Loading...");
    tfliteModel = await tflite.loadTFLiteModel(
      "https://tfhub.dev/sayakpaul/lite-model/cartoongan/fp16/1?lite-format=tflite"
    );
    console.log("Model loaded");
  }

  async function predict() {
    await begin();
    //loading imageData
    //TODO: add image uplaod option
    console.log("Begin prediction");

    const image = new Image();

    image.src = url;
    image.crossOrigin = "Anonymous";
    image.onload = function () {
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
      const imageData = new ImageData(Uint8ClampedArray.from(rgba), 224, 224);
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      ctx.putImageData(imageData, 0, 0);
      canvas.classList.remove("hide");
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
      <h1>Tensorflow</h1>
      <div>
        <button onClick={() => begin()}>Start</button>
      </div>
      <input onChange={(e) => setUrl(e.target.value)} />
      <div className="display">
        {url && <img className="image" src={url} alt="pup" />}
      </div>

      <div>
        <button onClick={predict}>Begin </button>
      </div>
      <div className="result">
        <canvas width={`${dims.width}px`} height={`${dims.height}px`} />
      </div>
    </div>
  );
}
