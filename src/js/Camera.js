import { isMobile } from './util';

let streamObject = false;

const videoConfig = {
  element: null,
  width: null,
  height: null,
};

class Camera {
  static get isSupported() {
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }

  static async getStream() {
    if (!streamObject) {
      console.log('Initialising Camera instance.');
      streamObject = await setupCamera();
    }
    return streamObject;
  }

  static set element(el) {
    videoConfig.element = el;
  }

  static set width(w) {
    videoConfig.width = w;
  }
  static set height(h) {
    videoConfig.height = h;
  }

  constructor() {
    throw new Error('Camera class only has static methods. Do not instantiate');
  }
}

export default Camera;

const setupCamera = async () => {
  const mobile = isMobile();
  const { element, width, height } = videoConfig;
  element.width = width;
  element.height = height;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: mobile ? undefined : width,
      height: mobile ? undefined : height,
    },
  });
  element.srcObject = stream;

  return new Promise(resolve => {
    element.onloadedmetadata = () => {
      resolve(element);
    };
  });
};
