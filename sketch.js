const mappa = new Mappa('Leaflet');

let myMap;
let canvas;

var Position = [];

let mseCoords;

let currentPosition;
let target;
let mapLoaded;

let targetMarker;
let currentZone;
let riddleState;
let riddlePopup;
let riddleButton;
let button;
let volume;

var coords;
let zone = [];
let song = [];
let completed = [0,0,0];
var stage = 0;
var position;

let mapStyle = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";

const options = { 
    lat: 50.371389,
    lng: -4.142222,
    zoom: 15,
    style: mapStyle
}

function preload() {
  // This parses the JSON text file into a Javascript Object
  soundFormats('mp3', 'ogg');
  song[0] = loadSound('sound1.mp3');
  song[1] = loadSound('sound2.mp3');
  song[2] = loadSound('sound1.mp3');
  
  zone[0] = loadJSON("zone.geo.json");
  zone[1] = loadJSON("zone2.geo.json");
  zone[2] = loadJSON("zone3.geo.json");
}

function setup() {
    canvas = createCanvas(640, 640);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas, onMapLoaded);

    if (navigator.geolocation){
        navigator.geolocation.watchPosition(gotPosition);
    }
  
}


function gotPosition(position) {
    print("Position data function called");
    // print(position.coords.latitude);
    // print(position.coords.longitude);
  
  if (!mapLoaded) return;
  
  //Updates marker coords with if statement, only drawers marker if no current position is set
  if (!currentPosition) {
     currentPosition = L.circleMarker([position.coords.latitude, position.coords.longitude]).addTo(myMap.map);
  } else {
    currentPosition.setLatLng([position.coords.latitude, position.coords.longitude]);
  }
  
  // checkCompletion();
  
  
  // TURF SPATIAL ANALYSIS : can do more complex calculations
   coords = L.GeoJSON.latLngToCoords(currentPosition.getLatLng());
  let point = turf.point(coords);
  let inside = turf.pointsWithinPolygon(point, zone[stage].features[0]);
  numberOfPointsInPolygon = inside.features.length;
  
  print('Is user location within polygon: '  + numberOfPointsInPolygon);
  // if (numberOfPointsInPolygon == 1) { 
  //   console.log("you're here ");
  // }
  
  if(mapLoaded == true) {
      console.log('Riddle state: ' + riddleState);
      clear();
    
//       
//       position = myMap.pixelToLatLng(mouseX, mouseY);
//       Position = [position.lng, position.lat];
//       var mousePoint = turf.point(Position);
//       var mouseChecker = turf.pointsWithinPolygon(mousePoint, zone[stage].features[0]);
//       var isMouseIn = mouseChecker.features.length;
      
//        mseCoords = [position.lat, position.lng];
    
      let dist = myMap.map.distance(currentPosition.getLatLng(), targetMarker.getLatLng());
  // print(dist);
      
      if (numberOfPointsInPolygon == 1) { 
        
            volume = map(dist,60,400,0,1);
            song[stage].setVolume(volume);
          
        
          // console.log(volume);
            if (dist < 30) {
              riddleState = 2;
              checkRiddle();
              // checkCompletion();
            }
            else if (dist >=30 && dist < 60) {
              console.log('No music');
              song[stage].setVolume(0);
              riddleState = 1;
              checkRiddle();
            }
            else if (dist >= 60 && dist < 3000) {
              console.log('Play music');
              riddleState = 3;
              checkRiddle();
              song[stage].setVolume(volume);
            } 
      } else { 
        riddleState = 0;
        checkRiddle();
        song[stage].setVolume(0);
      }

 }
  
  
  //Working on the map, retrieves coords and calculates difference
  
  for (let s = 0; s < completed.length; s++) {
      if (stage == s && completed[s - 1] == 1) {
          // console.log(zone.features[0].sound);
        currentZone.remove();
        currentZone = L.geoJSON(zone[s]).addTo(myMap.map);
        targetMarker.setLatLng(zone[s].features[0].target);
        
      }
    }
  
          
}

function onMapLoaded() {
    mapLoaded = true;
    
  //Creates marker for GPS position
    // L.marker([currentPositionLat, currentPositionLong]).addTo(myMap.map);
  
 currentZone = L.geoJSON(zone[0]).addTo(myMap.map);
    targetMarker = L.marker(zone[0].features[0].target).addTo(myMap.map);
  

}

function checkCompletion() {
          if (!completed[stage]) {
          // change leaflet stuff...
          
          completed[stage] = 1;
          
          currentZone.remove();
          currentZone = L.geoJSON(zone[stage]).addTo(myMap.map);
          stage++;
           
          //Stop song for previous stage after completion  
          if (stage >= 1) { 
             song[stage - 1].stop();
          }
          console.log('Stage: ' + stage);
          console.log('Previous stage:' + completed[stage - 1]);
        }
}

function checkRiddle() { 
  if (riddleState == 1) { 
      push();
      fill(255);
      riddlePopup = rect(0,0, windowWidth, windowHeight);
      pop();
      

      //Removes polygon from view
      currentZone.setStyle({opacity: '0', fillOpacity: '0'});
      targetMarker.setOpacity(0);

      //Riddle Text
      riddleText = zone[stage].features[0].clue;
      textSize(12); 
      fill(0, 102, 153);
      strokeWeight(0.5); 
      textAlign(CENTER, TOP); 
      text(riddleText, 0, width/2, height); 
  } 
    else if (riddleState == 0) { 
      riddlePopup = false;
      currentZone.setStyle({opacity: '1', fillOpacity: '0.2'});
      targetMarker.setOpacity(1);
  } 
    else if (riddleState == 2) { 
      // riddlePopup = rect(0,0, windowWidth, windowHeight);
      console.log('Within landmark zone');
      // targetMarker.setOpacity(1);
      console.log('COMPLETED');
      // fill(255,255,255);
      // riddleButton = rect(windowWidth/2 - 100, windowHeight/2 - 100, 200,200);
      setInterval(checkCompletion(), 1000);
      
  } else if (riddleState == 3) {
      console.log(riddleState);
      riddlePopup = false;
      currentZone.setStyle({opacity: '1', fillOpacity: '0.2'});
      targetMarker.setOpacity(1);
       let col = color(25, 23, 200, 50);
      //Stage +1 to improve UX and move away from array number sequence
       button = createButton('START JOURNEY ' + [stage + 1]);
       button.style('z-index', '3000');
       button.position(windowWidth/2-50, windowHeight/2);
       button.mousePressed(audioPlay);
    
  }
}

function draw() {
  
  //MOUSE CHECKER FOR FIRST ZONE
    
}

function audioPlay() {
  getAudioContext().resume;
  song[stage].play();
  song[stage].loop();
  console.log(volume);
}

