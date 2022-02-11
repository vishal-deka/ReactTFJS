const BlobToBase64 = function (blob) {
  let blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = blobUrl;
  }).then((img) => {
    URL.revokeObjectURL(blobUrl);
    // Limit to 256x256px while preserving aspect ratio
    let [w, h] = [img.width, img.height];
    let aspectRatio = w / h;
    // Say the file is 1920x1080
    // divide max(w,h) by 256 to get factor
    let factor = Math.max(w, h) / 256;
    w = w / factor;
    h = h / factor;

    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
  });
};

const BlobToImageData = function (blob) {
  let blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = blobUrl;
  }).then((img) => {
    URL.revokeObjectURL(blobUrl);
    // Limit to 256x256px while preserving aspect ratio
    let [w, h] = [img.width, img.height];
    let aspectRatio = w / h;
    // Say the file is 1920x1080
    // divide max(w,h) by 256 to get factor
    let factor = Math.max(w, h) / 256;
    w = w / factor;
    h = h / factor;

    // REMINDER
    // 256x256 = 65536 pixels with 4 channels (RGBA) = 262144 data points for each image
    // Data is encoded as Uint8ClampedArray with BYTES_PER_ELEMENT = 1
    // So each images = 262144bytes
    // 1000 images = 260Mb
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas;
    //return ctx.getImageData(0, 0, w, h); // some browsers synchronously decode image here
  });
};

const ImageDataToBlob = function (imageData) {
  let w = imageData.width;
  let h = imageData.height;
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0, w, h); // synchronous

  return new Promise((resolve, reject) => {
    canvas.toBlob(resolve); // implied image/png format
  });
};

const ObjectURLToBlob = function (url) {
  return new Promise(async (resolve, reject) => {
    try {
      let blob = await fetch(url);
      resolve(blob);
    } catch (err) {
      reject(err);
    }
  });
};

const BlobToObjectURL = function (blob) {
  return new Promise((resolve, reject) => {
    try {
      resolve(URL.createObjectURL(blob));
    } catch (err) {
      reject(err);
    }
  });
};

export {
  BlobToBase64,
  BlobToImageData,
  ImageDataToBlob,
  ObjectURLToBlob,
  BlobToObjectURL
};
