// import { train } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as config from './config';

const classInfo = [];
let classifier;
let mobilenet;

const setClassInfo = (classNum, exampleCount, confidence, isTopPrediction) => {
  classInfo[classNum] = { exampleCount, confidence, isTopPrediction, classNum };
};

const initModel = async () => {
  classifier = knnClassifier.create();
  mobilenet = await mobilenetModule.load();
  return true;
};

const processVideoFrame = async (streamObj, training = -1) => {
  let logits;
  const image = tf.browser.fromPixels(streamObj);
  const infer = () => mobilenet.infer(image, 'conv_preds');

  // Train class if one of the buttons is held down
  // Add current image to classifier
  if (training != -1) {
    logits = infer();
    classifier.addExample(logits, training);
  }

  // If the classifier has examples for any classes, make a prediction!
  const numClasses = classifier.getNumClasses();
  if (numClasses > 0) {
    logits = infer();
    const res = await classifier.predictClass(logits, config.keras.TOPK);

    for (let i = 0; i < config.keras.NUM_CLASSES; i++) {
      const classExampleCount = classifier.getClassExampleCount();
      const confidence = res.confidences[i] * 100;

      setClassInfo(i, classExampleCount[i], confidence, res.classIndex == i);
    }
  }

  image.dispose();
  logits != null ? logits.dispose() : null;
};

module.exports.processVideoFrame = processVideoFrame;
module.exports.initModel = initModel;
module.exports.getModelClasses = () => classInfo.map(c => ({ ...c }));
