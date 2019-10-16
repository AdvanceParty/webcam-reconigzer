import * as config from './config';

let _buttonContainer = null;
let _infoPanel = null;

const setupInfoPanel = () => {
  return document.createElement('div');
};

const createTrainingButton = (label, index, clickHandler = null) => {
  const button = document.createElement('button');
  button.innerText = label;
  button.dataset.index = index;
  clickHandler ? button.addEventListener('click', e => clickHandler(e)) : null;
  return button;
};

const setupButtons = (clickHandler = null) => {
  const container = document.createElement('div');
  for (let i = 0; i < config.keras.NUM_CLASSES; i++) {
    const div = document.createElement('div');
    const btn = createTrainingButton(`Train ${i}`, i);
    div.appendChild(btn);
    container.appendChild(div);
  }
  return container;
};

const getButtons = () => {
  _buttonContainer = _buttonContainer ? _buttonContainer : setupButtons();
  return _buttonContainer;
};

const getInfoPanel = () => {
  _infoPanel = _infoPanel ? _infoPanel : setupInfoPanel();
  return _infoPanel;
};

const setInfo = msg => {
  const infoPanel = getInfoPanel();
  infoPanel.innerHTML = msg;
};

module.exports.getButtons = getButtons;
module.exports.getInfoPanel = getInfoPanel;
module.exports.setInfo = setInfo;
