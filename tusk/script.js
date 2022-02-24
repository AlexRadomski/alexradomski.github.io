// const LAT = 27.54115;
// const LON = 30.861591;
const WEATHERID = "61ebd99f83498da4353dbbfbb0e081f9";
const MAPID = "8O69TZ38bBaGeARwj3meqnCgyVRcRmlvYP5O0aDcNN8";
let lat = 53.005742;
let lon = -1.294706;
let weatherURL;
let mapURL;

let effectShader;
let errorShader;

let font;
let locationData;

let time = 12000;
let lastTime = 0;

let connection = false;

let mapImage = [];
let weatherData = [];

// Sounds
let noise;
let noiseEnv;
let osc;
let oscEnv;
let player;

function preload() {
  effectShader = loadShader("shader.vert", "shader.frag");
  errorShader = loadShader("error.vert", "error.frag");

  font = loadFont("TECHNOID.TTF");

  locationData = loadStrings("locations.txt");

  updateData();

  player = new Tone.Player("test.wav").toDestination();
}

function updateData() {
  // Random Lat and Lon from text file (https://api.3geonames.org/randomland.UK.json)
  // let locationArr = split(locationData[floor(random(locationData.length))], ",");
  // lat = locationArr[0];
  // lon = locationArr[1];

  // API Urls
  let ran = random(-1, 1);
  weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + str(lat + ran) + "&lon=" + str(lon + ran) + "&appid=" + WEATHERID + "&units=metric";
  mapURL = "https://image.maps.ls.hereapi.com/mia/1.6/mapview?c=" + str(lat + ran) + "%2C" + str(lon + ran) + "&t=1&w=720&h=445&z=" + int(15) + "&apiKey=" + MAPID + "&nodot";

  httpGet(weatherURL, 'json', false, result => {
    weatherData[1] = result;
    connection = true;
  }, result => {
    connection = false; // Failed to get data
  });

  mapImage[1] = loadImage(mapURL, result => {
    mapImage[0] = mapImage[1].get(0, 0, 720, 405); // Cropping text from bottom
  }, result => {
    connection = false; // Failed to get data
  });
}

function setup() {
  createCanvas(1920, 1080, WEBGL);
  pixelDensity(1);

  const gl = canvas.getContext('webgl');
  gl.disable(gl.DEPTH_TEST);

  textSize(64);
  textFont(font);
  textAlign(LEFT, BOTTOM);

  frameRate(60);
  strokeWeight(16);

  Tone.Transport.bpm.value = 80;

  noiseEnv = new Tone.AmplitudeEnvelope({
		attack: 10,
		decay: 0,
		sustain: 1.0,
		release: 0,
    attackCurve: "sine"
	}).toDestination();
  noise = new Tone.Noise({
    mute: false,
  	volume: -10,
  	fadeIn: 0,
  	fadeOut: 0,
  	playbackRate: 10,
  	type: "white"
  }).connect(noiseEnv).start();
  oscEnv = new Tone.AmplitudeEnvelope({
		attack: 0.05,
		decay: 0,
		sustain: 1,
		release: 0.2,
    attackCurve: "linear"
	}).toDestination();
  osc = new Tone.Oscillator({
    mute: false,
  	volume: 1,
  	detune: 0,
  	frequency: 100,
  	partialCount: 0,
  	partials: [],
  	phase: 0,
  	type: "sine"
  }).connect(oscEnv).start();

  //player = new Tone.Player("test.wav").toDestination();
  // Tone.Transport.scheduleRepeat(time => {
  //   player.start();
	//    oscEnv.triggerAttackRelease(1);
  // }, "2n");
  // Tone.Transport.start();

  // noise = new Tone.Noise("pink").toDestination();
  // noise.start();
}

function soundManager() {

}
function draw() {
  translate(-width / 2, -height / 2);

  // Updating time values
  time += millis() - lastTime;
  lastTime = millis();

  //let u_time = 0.25 + (cos(time / 12000 % 1 * TWO_PI + PI) + 1) / 8;
  let u_time = (time % 12000 / 12000);

  effectShader.setUniform("u_time", u_time);
  effectShader.setUniform("u_resolution", [width, height]);
  effectShader.setUniform("u_add", random(1)); // Value to alter noise

  errorShader.setUniform("u_time", u_time);
  errorShader.setUniform("u_resolution", [width, height]);
  errorShader.setUniform("u_add", random(1)); // Value to alter noise


  if (time >= 12000) {
    effectShader.setUniform("u_modulo", random(100));
    effectShader.setUniform("u_texture", mapImage[0]);

    time = 0;
    lastTime = millis();

    weatherData[0] = weatherData[1];
    updateData();

    //synth.triggerAttackRelease(random(300, 400), "10");

    // start at "C4"
    // osc.frequency.value = 200;
    // // ramp to "C2" over 2 seconds
    // osc.frequency.rampTo(100, 12);
    // // start the oscillator for 2 seconds
    // osc.start().stop("+13");
    // noiseEnv.triggerRelease();
    // noiseEnv.triggerAttack();
    player.stop();
    player.start();
    //noiseEnv.triggerAttackRelease(11.9);
  }

  if (!connection || mapImage[0] === undefined) {
    shader(errorShader);
    //print("??");
  } else {
    shader(effectShader);
  }
  fill(255);
  rect(0, 0, width, height);

  resetShader();
  noFill();
  //rect(0, 0, width, height);

  fill(255, 0, 0);
  if (typeof weatherData[0] !== "undefined" && connection) {
    //text(weatherData[0].name + ", " + weatherData[0]["sys"].country, 10, height - 10);
    // print(lon);
    // print(lat);
    //print(weatherData[0].name);
  }
  //text(weatherData[1].name, 0, 0);
  //print(weatherURL);
  //noLoop();
}
