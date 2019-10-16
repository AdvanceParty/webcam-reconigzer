import * as tf from '@tensorflow/tfjs';

import Camera from './Camera';
import { initStats, statsPanel } from './util';
import * as config from './config';
import { getButtons, getInfoPanel, setInfo } from './ui';
import { processVideoFrame, initModel, getModelClasses } from './modelFunctions';
import { train } from '@tensorflow/tfjs';

let training = -1;

async function animate() {
  statsPanel.begin();
  const stream = await Camera.getStream();
  processVideoFrame(stream, training);
  updateSummaryPanel(getModelClasses());
  statsPanel.end();
  requestAnimationFrame(animate);
}

const updateSummaryPanel = classInfo => {
  let prediction;
  const list = classInfo.map(c => {
    const { exampleCount, confidence, isTopPrediction, classNum } = c;
    prediction = isTopPrediction ? classNum : prediction;
    return `Class ${classNum} | ${confidence} confident (from ${exampleCount} samples`;
  });

  prediction = prediction ? `<h2>${prediction}</h2>` : prediction;
  const summary = `<p>${list.join('<br />')}</p>`;
  setInfo(prediction + summary);
};

const setupCamera = async () => {
  Camera.element = document.getElementById(config.video.elementId);
  Camera.width = config.video.width;
  Camera.height = config.video.height;
};

const setLoading = isLoading => {
  document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
  document.getElementById('main').style.display = isLoading ? 'none' : 'block';
};

const trainForClass = index => {
  training = index;
};

export async function start() {
  setLoading(true);
  await initModel();

  const mainEl = document.getElementById('main');
  const btnContainer = getButtons();
  btnContainer.addEventListener('mousedown', e => trainForClass(Number(e.target.dataset.index)));
  btnContainer.addEventListener('mouseup', e => trainForClass(-1));
  mainEl.appendChild(btnContainer);
  mainEl.appendChild(getInfoPanel());
  setLoading(false);

  initStats();
  setupCamera();

  try {
    const video = await Camera.getStream();
    video.play();
  } catch (e) {
    alert('Video capture device not found!');
    console.log(e);
  }

  animate();
}

start();
