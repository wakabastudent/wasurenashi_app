

function startLoadingTile() {
  loadingTilesCount++;
}

function finishLoadingTile() {
  // Delayed increase loaded count to prevent changing the layer before 
  // it will be replaced by next
  setTimeout(function () {
    loadedTilesCount++;
  }, 250);
}

function isTilesLoading() {
  return loadingTilesCount > loadedTilesCount;
}
/**
 * Load all the available maps frames from RainViewer API
 */
var apiRequest = new XMLHttpRequest();
apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
apiRequest.onload = function (e) {
  // store the API response for re-use purposes in memory
  apiData = JSON.parse(apiRequest.response);
  initialize(apiData, optionKind);
};
apiRequest.send();
/**
 * Initialize internal data from the API response and options
 */
function initialize(api, kind) {
  // remove all already added tiled layers
  for (var i in radarLayers) {
    map.removeLayer(radarLayers[i]);
  }
  mapFrames = [];
  radarLayers = [];
  animationPosition = 0;
  if (!api) {
    return;
  }
  if (kind == 'satellite' && api.satellite && api.satellite.infrared) {
    mapFrames = api.satellite.infrared;
    lastPastFramePosition = api.satellite.infrared.length - 1;
    showFrame(lastPastFramePosition, true);
  } else if (api.radar && api.radar.past) {
    mapFrames = api.radar.past;
    if (api.radar.nowcast) {
      mapFrames = mapFrames.concat(api.radar.nowcast);
    }
    // show the last "past" frame
    lastPastFramePosition = api.radar.past.length - 1;
    showFrame(lastPastFramePosition, true);
  }
}
/**
 * Animation functions
 * @param path - Path to the XYZ tile
 */
function addLayer(frame) {
  if (!radarLayers[frame.path]) {
    var colorScheme = optionKind == 'satellite' ? 0 : optionColorScheme;
    var smooth = optionKind == 'satellite' ? 0 : optionSmoothData;
    var snow = optionKind == 'satellite' ? 0 : optionSnowColors;
    var source = new L.TileLayer(apiData.host + frame.path + '/' + optionTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.png', {
      tileSize: 256,
      opacity: 0.01,
      zIndex: frame.time
    });
    // Track layer loading state to not display the overlay 
    // before it will completelly loads
    source.on('loading', startLoadingTile);
    source.on('load', finishLoadingTile);
    source.on('remove', finishLoadingTile);
    radarLayers[frame.path] = source;
  }
  if (!map.hasLayer(radarLayers[frame.path])) {
    map.addLayer(radarLayers[frame.path]);
  }
}
/**
 * Display particular frame of animation for the @position
 * If preloadOnly parameter is set to true, the frame layer only adds for the tiles preloading purpose
 * @param position
 * @param preloadOnly
 * @param force - display layer immediatelly
 */
function changeRadarPosition(position, preloadOnly, force) {
  while (position >= mapFrames.length) {
    position -= mapFrames.length;
  }
  while (position < 0) {
    position += mapFrames.length;
  }
  var currentFrame = mapFrames[animationPosition];
  var nextFrame = mapFrames[position];
  addLayer(nextFrame);
  // Quit if this call is for preloading only by design
  // or some times still loading in background
  if (preloadOnly || (isTilesLoading() && !force)) {
    return;
  }
  animationPosition = position;
  if (radarLayers[currentFrame.path]) {
    radarLayers[currentFrame.path].setOpacity(0);
  }
  radarLayers[nextFrame.path].setOpacity(100);
  var pastOrForecast = nextFrame.time > Date.now() / 1000 ? '今後の予想' : 'これまで';
  document.getElementById("timestamp").innerHTML = pastOrForecast + ': ' + (new Date(nextFrame.time * 1000)).toLocaleString('ja-JP');
}
/**
 * Check avialability and show particular frame position from the timestamps list
 */
function showFrame(nextPosition, force) {
  var preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;
  changeRadarPosition(nextPosition, false, force);
  // preload next next frame (typically, +1 frame)
  // if don't do that, the animation will be blinking at the first loop
  changeRadarPosition(nextPosition + preloadingDirection, true);
}
/**
 * Stop the animation
 * Check if the animation timeout is set and clear it.
 */
function stop() {
  if (animationTimer) {
    clearTimeout(animationTimer);
    animationTimer = false;
    return true;
  }
  return false;
}

function play() {
  showFrame(animationPosition + 1);
  // Main animation driver. Run this function every 500 ms
  animationTimer = setTimeout(play, 500);
}

function playStop() {
  if (!stop()) {
    play();
  }
}
/**
 * Change map options
 */
function setKind(kind) {
  optionKind = kind;
  initialize(apiData, optionKind);
}

function setColors() {
  var e = document.getElementById('colors');
  optionColorScheme = e.options[e.selectedIndex].value;
  initialize(apiData, optionKind);
}
/**
 * Handle arrow keys for navigation between next \ prev frames
 */
document.onkeydown = function (e) {
  e = e || window.event;
  switch (e.which || e.keyCode) {
  case 37: // left
    stop();
    showFrame(animationPosition - 1, true);
    break;
  case 39: // right
    stop();
    showFrame(animationPosition + 1, true);
    break;
  default:
    return; // exit this handler for other keys
  }
  e.preventDefault();
  return false;
}
