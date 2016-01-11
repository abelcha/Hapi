var speech = require('google-speech-api');

var opts = {
  file: 'cache/axialis/17476524.mp3',
};

speech(opts, function (err, results) {
  console.log(err);
  // [{result: [{alternative: [{transcript: '...'}]}]}]
});