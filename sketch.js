const mappa = new Mappa('Leaflet');

let myMap;
let canvas;
let mapLoaded;

//Set of variables that deal with latitude longitude and coordinate data
var coords;
var Position = [];
let currentPosition;
let targetMarker;
var position;

let currentZone;
let riddleState;
let volume;

//Boolean values used to check against to display visual states within draw function
let score = true;
let riddlePopup = false;
let drawRect = false;
let showImage = false;
let logoImg = false;
let logoPopup = false;

//Image variables
let success;
let logo;

//Arrays of data used in preload, iterated through using stage number
let img = [];
let zone = [];
let song = [];

//State machine variables, stages increase while completed array is checked against
//Change number of values depending on number of stages
let completed = [0, 0, 0, 0, 0];
var stage = 0;

let col;

let maxDistance = 110;

//Testing variable
let testInside;

//Style of polgyon zone
let zoneStyle = {
  color: 'white',
  weight: '1',
  opacity: '0.75',
  fillColor: 'white',
  fill: true,
  fillOpacity: '.5'
};

let zoneDisappear = {
  opacity: '0',
  fillOpacity: '0'
};

let mapStyle = "https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png";

//Settings for map that are used in map load
let options = {
  lat: 50.371389,
  lng: -4.142222,
  zoom: 15,
  style: mapStyle
}

function preload() {

  soundFormats('mp3', 'ogg');

  //Load songs into array to check against current stage
  song[0] = loadSound('sounds/ElizabethanMusic.mp3');
  song[1] = loadSound('sounds/MayFlowerSteps.mp3');
  song[2] = loadSound('sounds/LighthouseSounds.mp3');
  song[3] = loadSound('sounds/GinSounds.mp3');
  song[4] = loadSound('sounds/w2.mp3');

  // This parses the JSON text file into a Javascript Object
  zone[0] = loadJSON("zones/zone.geo.json");
  zone[1] = loadJSON("zones/zone2.geo.json");
  zone[2] = loadJSON("zones/zone3.geo.json");
  zone[3] = loadJSON("zones/zone4.geo.json");
  zone[4] = loadJSON("zones/zone5.geo.json");

  //Background images for stage completion screen
  img[0] = loadImage('images/elizabethanHouse.jpeg');
  img[1] = loadImage('images/mayflower.jpg');
  img[2] = loadImage('images/lighthouse.jpg');
  img[3] = loadImage('images/gin.jpg');
  img[4] = loadImage('images/barcode.jpg');

  //Logo for sound navigation stage
  logo = loadImage('images/logo3.png');
  success = loadImage('images/success.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  myMap = mappa.tileMap(options);
  myMap.overlay(canvas, onMapLoaded);

  //Retrieves GPS position, every time it is recieved, runs function that updates application and moves it along.
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(gotPosition, undefined, {
      maximumAge: 0,
      timeout: 1000,
      enableHighAccuracy: true
    });
  }

  //Button, begin journey appears in riddle state 1
  col = color(255);
  button = createButton('START JOURNEY');
  button.size(windowWidth, 75);
  button.position(0, windowHeight - 75);
  button.style('z-index', '3000'); //Fix layer position
  button.style('font-size', '15px');
  button.style('font-weight', '700');
  button.style('color', 'black');
  button.style('border', 'none');
  button.style('background-color', col);
  button.mousePressed(audioPlay); //Run audio function

  button.hide();

  //Instruction button featured on top right of screen
  help = createButton('?');
  help.size(50, 50);
  help.position(width - 65, 15);
  help.style('z-index', '3000');
  help.style('font-size', '20px');
  help.style('color', 'black');
  help.style('border', 'none');
  help.style('background-color', col);
  help.mousePressed(helpPopup); //Run help popup function

  //Completion buttion appears in riddle stage 3
  completedButton = createButton("COMPLETE ZONE");
  completedButton.size(windowWidth, 75);
  completedButton.position(0, windowHeight - 75);
  completedButton.style('z-index', '3000');
  completedButton.style('font-size', '15px');
  completedButton.style('font-weight', '700');
  completedButton.style('color', 'black');
  completedButton.style('border', 'none');
  completedButton.style('background-color', col);
  completedButton.mousePressed(checkCompletion); //Runs completuon check when button is pressed, moving stage along.

  completedButton.hide();

}

function gotPosition(position) {
  // print("Position data function called");
  // print(position.coords.latitude);
  // print(position.coords.longitude);

  if (!mapLoaded) return;


  //Styles for GPS marker, making use of custom image
  var feetIcon = L.icon({
    iconUrl: 'footprints-01.png',
    iconSize: [35, 36.43], // size of the icon
    iconAnchor: [17.5, 18.2], // center of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });




  //Updates marker coords with if statement, only drawers marker if no current position is set. Loads custom image as marker.
  if (!currentPosition) {
    currentPosition = L.marker([position.coords.latitude, position.coords.longitude], {
      icon: feetIcon
    }).addTo(myMap.map);
  } else {
    currentPosition.setLatLng([position.coords.latitude, position.coords.longitude]);
  }



  // Using turf to calculate whether point is located within polygon. Relocates location data as turf using coordinates as opposed to lat lng.
  coords = L.GeoJSON.latLngToCoords(currentPosition.getLatLng());
  let point = turf.point(coords);
  let inside = turf.pointsWithinPolygon(point, zone[stage].features[0]);
  numberOfPointsInPolygon = inside.features.length;


  // print('Is user location within polygon: ' + numberOfPointsInPolygon);

  if (mapLoaded == true) {
    // console.log('Riddle state: ' + riddleState);
    clear();

    //Calculates distance between current position and landmark to use to scale volume for sound.
    let dist = myMap.map.distance(currentPosition.getLatLng(), targetMarker.getLatLng());



    if (numberOfPointsInPolygon == 1) {
      // testInside = true;
      //Volume mapped according to distance, gets louder as you get closer to the landmark.
      volume = map(dist, maxDistance, 45, 0, 1);
      currentZone.setStyle(zoneDisappear);

      //Landmark distance
      if (dist < 25) {
        riddleState = 2;
        checkRiddle();
      }
      //Riddle distance
      else if (dist >= 25 && dist < 45) {
        // console.log('No music');
        //Checks against if song is playing, turning volume off if outside the zone.
        if (song[stage].isPlaying()) {
          song[stage].setVolume(0);
        }
        riddleState = 1;
        checkRiddle();
      }
      //Sound distance
      else if (dist >= 45 && dist < maxDistance) {
        // console.log('Play music');
        riddleState = 3;
        checkRiddle();
      }
    }
    //Outside of zone
    else {
      // testInside = false;
      riddleState = 0;
      checkRiddle();
      if (song[stage].isPlaying()) {
        song[stage].setVolume(0);
      }
    }
  }
}

function onMapLoaded() {
  mapLoaded = true;

  //Removes attribution from the screen, workaround by changing CSS
  document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';

  //Displays initial zone outside of completion check
  currentZone = L.geoJSON(zone[0]).addTo(myMap.map);
  currentZone.setStyle(zoneStyle);

  //Target marker is landmark indicator, landmark will be hidden when out of production
  targetMarker = L.marker(zone[0].features[0].target, {
    opacity: 0
  }).addTo(myMap.map);
}


//Function to iterate through stages, called after button is pressed. Checks agaist stage's completion value, increments stage variable used to move content along.
function checkCompletion() {
  if (!completed[stage]) {

    //Set of booleans to indicate which stage is completed
    //Sets value of stage just completed to 1 to check against.
    completed[stage] = 1;

    //Hides other screen elements that may be present when stage completed
    showImage = false;
    completedButton.hide();
    logoPopup = false;
    button.hide();

    //Removes previous zone polygon and redraws new one after stage has been increased.
    currentZone.remove();

    //Stops previous song as stage moves.
    song[stage].stop();

    stage++;

    currentZone = L.geoJSON(zone[stage]).addTo(myMap.map);
    currentZone.setStyle(zoneStyle);

    //Update landmark marker
    targetMarker.setLatLng(zone[stage].features[0].target);

    //Temporary fix for larger polygon, allows concise sound and popup to not be delayed
    if (stage == 3) {
      maxDistance = 250;
    } else {
      maxDistance = 110;
    }

    // console.log('Stage: ' + stage);
    // console.log('Previous stage:' + completed[stage - 1]);
  }
}

function helpPopup() {
  //Use of booleans to display popup in draw function.
  if (drawRect == false) {
    drawRect = true;

    help.hide();

    close = createButton("X");
    close.size(50, 50);
    close.position(width - 65, 15);
    close.style('z-index', '3000');
    close.style('font-size', '20px');
    close.style('color', 'black');
    close.style('border', 'none');
    close.style('background-color', col);
    close.mousePressed(helpPopup);



  } else if (drawRect == true) {
    drawRect = false;
    help.show();
    close.hide();
  }
}

//Function checks states defined within gotPosition, checking against user position and distance/state within or outside of Polygon. Changes another state of boolean values that initiate UI screens in draw function.

//After use of booleans for draw function in later stages of UI development, can get rid of this function and state checks, move state changes to gotPosition.

function checkRiddle() {

  //Clue state, riddle pops up.
  if (riddleState == 1) {
    riddlePopup = true;

    //Removes polygon from view, add to variable to reduce code repetition due to frequent use to resolve layers issue
    currentZone.setStyle(zoneDisappear);

    //Riddle Text
    riddleText = zone[stage].features[0].clue;

    button.hide();
  }
  //User is outside of zone.
  else if (riddleState == 0) {
    //Display user's position marker
    currentPosition.setOpacity(1);
    button.hide();
  }
  //Landmark area, completion screen.
  else if (riddleState == 2) {
    showImage = true;
    currentZone.setStyle(zoneDisappear);
  }
  //Within zone, music plays, initiate journey screen.
  else if (riddleState == 3) {
    logoPopup = true;
    currentZone.setStyle(zoneDisappear);
  }

  //Don't display riddle if not in Riddle state
  if (riddleState != 1) {
    riddlePopup = false;
  }
  //Hide completion screne if not in landmark area
  if (riddleState != 2) {
    completedButton.hide();
    showImage = false;
  }
  //Hide logo, sound screen if not within zone area
  if (riddleState != 3) {
    logoPopup = false;
  }
  //If within zone, hide user's marker
  if (riddleState != 0) {
    currentPosition.setOpacity(0);
  }

}

//Runs audio through function as interaction is required to play audio on mobile devices.
function audioPlay() {

  //Dims button to show user the journey has begun
  button.style('background-color', 'black');
  button.style('color', 'grey');

  //Fix for playing audio on mobile devices
  getAudioContext().resume;

  song[stage].play();
  song[stage].loop();
  // console.log(volume);
}

function draw() {
  if (mapLoaded == true) {
    clear();

    //Riddle display check
    if (riddlePopup == true) {
      currentZone.setStyle(zoneDisappear);
      push();
      fill(0);
      rect(0, 0, windowWidth, windowHeight);
      textStyle(BOLD);
      textSize(17);
      fill(255);
      strokeWeight(0.5);
      textAlign(CENTER, CENTER);
      text(riddleText, width / 2, height / 2);
      pop();
    }



    //Statement to show background image when in completion step
    if (showImage == true) {
      push();
      tint(255, 100); // Display at half opacity
      img[stage].resize(windowWidth, windowHeight); //Stretch to screen
      image(img[stage], 0, 0); //Display given image
      pop();

      //Success tick icon
      image(success, windowWidth / 2 - 20, windowHeight / 2 - 80);

      //REMOVE THESE IF GOTPOSITION OPACITY WORKS
      currentZone.setStyle(zoneDisappear);
      completedButton.show();
    }

    //Statement to display logo when in sound step
    if (logoPopup == true) {
      currentZone.setStyle(zoneDisappear);
      push();
      fill(0);
      rect(0, 0, windowWidth, windowHeight);
      image(logo, windowWidth / 2 - 50, windowHeight / 2 - 100);
      button.show();
      pop();
      //Sets volume of ambient sound to variable that mapped the distance to volume.
      song[stage].setVolume(volume);
    }
    
  //When zone is completed, adds to the score according to the stage. In future with random zones, will use a different method.
    if (score == true) {
      push();
        fill(255);
        rect(width - 125, 14, 51, 51);
      pop();
      textSize(20);
      // textStyle(BOLD);
      text(stage, width - 105, 47);
    }

    //TESTING FEATURE

    // if (testInside == true) {
    //   push();
    //   fill(255);
    //   text('WITHIN POLYGON', 100, 200);
    //   pop();
    // } else {
    //   push();
    //   fill(255);
    //   text('OUTSIDE POLYGON', 100, 200);
    //   pop();
    // }

    if (drawRect == true) {
      currentZone.setStyle(zoneDisappear);
      //Text for instructions, can be redone using /n in future
      push();
      //Black background overlayed by white text
      fill(255);
      rect(0, 0, windowWidth, windowHeight);
      textSize(14);
      textStyle(BOLD);
      fill(0);
      text('1.	Ensure GPS is on.', windowWidth / 2 - 110, windowHeight / 2 - 60);
      text('2. Turn volume to max.', windowWidth / 2 - 110, windowHeight / 2 - 30);
      text('3. Make your way to the first zone.', windowWidth / 2 - 110, windowHeight / 2);
      text('4. In zone, start the journey.', windowWidth / 2 - 110, windowHeight / 2 + 30);
      text('5. Complete the riddle by getting near.', windowWidth / 2 - 110, windowHeight / 2 + 60);
      text('6. Head to the next zone!', windowWidth / 2 - 110, windowHeight / 2 + 90);
      pop();

    } else if (drawRect == false && riddleState == 0) {
      //Resets style back to normal if outside zone and help menu inactive
      currentZone.setStyle(zoneStyle);
    }

  }

}