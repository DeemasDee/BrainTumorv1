const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const Jimp = require('jimp');

let savedModel;

const modelPath = path.join(__dirname, 'model_tfjs/model.json');

async function loadModel() {
    try {
        savedModel = await tf.loadLayersModel(`file://${modelPath}`);
        return savedModel;
    } catch (error) {
        console.error('Error loading the model:', error);
        throw error;
    }
}


//async function loadModel() {
//    try {
//        savedModel = await tf.loadLayersModel('file://./model_tfjs/VGG_model/model.json');
//        console.log("Model loaded successfully");
//    } catch (err) {
//        console.error("Error loading the model: ", err);
//    }
//}

loadModel();

async function check(inputImg) {
    if (!savedModel) {
        console.error("Model is not loaded yet!");
        return false;
    }

    console.log("Your image is: " + inputImg);

    const imgPath = path.join(__dirname, 'public/images', inputImg);
    let img = await Jimp.read(imgPath);
    img = img.resize(224, 224);
    const imgBuffer = await img.getBufferAsync(Jimp.MIME_JPEG);

    let tensor = tf.node.decodeImage(imgBuffer)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();

    try {
        const output = await savedModel.predict(tensor).array();
        const status = output[0][0] === 1;
        console.log(status);
        return status;
    } catch (err) {
        console.error("Error during prediction: ", err);
        return false;
    }
}

module.exports = { check };
