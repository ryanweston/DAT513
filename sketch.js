

let myMap;
let canvas;
let coords = [
    [
    -4.141759872436523,
    50.37502202865589
  ],
  [
    -4.13985013961792,
    50.373865645465976
  ],
  [
    -4.138616323471069,
    50.37390670097305
  ],
  [
    -4.136438369750977,
    50.376671023383096
  ],
  [
    -4.138723611831665,
    50.37725944745918
  ],
  [
    -4.142328500747681,
    50.376534179528626
  ],
  [
    -4.141759872436523,
    50.37502202865589
  ]
];

const mappa = new Mappa('Leaflet');

const options = { 
    lat: 50.371389,
    lng: -4.142222,
    zoom: 17,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function setup() {
    canvas = createCanvas(640, 640);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
  }

function keyPressed() { 
    L.marker([50.371389, -4.142222]).addTo(myMap.map);

    let latLng = L.GeoJSON.coordsToLatLngs(coords);
    L.polygon(latLng).addTo(myMap.map);
}

function draw() {
    clear();
    fill(255,0,0);
  
    let pixel = myMap.latLngToPixel(50.371389, -4.142222);
    circle(pixel.x, pixel.y,10);
}

