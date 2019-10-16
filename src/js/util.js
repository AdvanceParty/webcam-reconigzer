import Stats from 'stats.js';

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isiOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isMobile = () => isAndroid() || isiOS();

/**
 * Sets up a frames per second panel on the top-left of the window
 */
const stats = new Stats();
function setupFPS(parentElement = document.body) {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  parentElement.appendChild(stats.dom);
}

module.exports.isMobile = isMobile;
module.exports.initStats = setupFPS;
module.exports.statsPanel = stats;
