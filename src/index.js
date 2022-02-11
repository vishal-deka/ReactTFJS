import { StrictMode } from "react";
import ReactDOM from "react-dom";
import * as tflite from "@tensorflow/tfjs-tflite";

import App from "./App";

const rootElement = document.getElementById("root");
tflite.setWasmPath(
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/"
);

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
