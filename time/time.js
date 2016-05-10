var ScribeSpeak;
var token;
var TIME_ELAPSED;
var FULL_RECO;
var PARTIAL_RECO;
var TIMEOUT_SEC = 10000;

exports.init = function () {
    info('[ Time ] is initializing ...');
}

exports.action = function(data, callback){

  SARAH.context.scribe.activePlugin('Time');
  
  config = Config.modules.time;
  /* Si pas de ville demandé */
  if(data.time && !data.location) {
    var name = config.name;

    var date = new Date();

    var text = "Il est " + date.getHours() + " heure";
    if (date.getMinutes() > 0){ 
      text += " " + date.getMinutes();
    }
    text += " " + name + ".";

    // Callback with TTS
    console.log("Heure: " + date.getHours() + "h" + date.getMinutes());
    callback({'tts': text});
  } else { // On recherche pour la ville spécifié

    ScribeSpeak = SARAH.ScribeSpeak;

    FULL_RECO = SARAH.context.scribe.FULL_RECO;
    PARTIAL_RECO = SARAH.context.scribe.PARTIAL_RECO;
    TIME_ELAPSED = SARAH.context.scribe.TIME_ELAPSED;

    var util = require('util');
    console.log("Time call log: " + util.inspect(data, { showHidden: true, depth: null }));

    SARAH.context.scribe.hook = function(event) {
      checkScribe(event, data.action, callback); 
    };

    token = setTimeout(function(){
      SARAH.context.scribe.hook("TIME_ELAPSED");
    }, TIMEOUT_SEC);
  }
}

function checkScribe(event, action, callback) {

  if (event == FULL_RECO) {
    clearTimeout(token);
    SARAH.context.scribe.hook = undefined;
    // aurait-on trouvé ?
    decodeScribe(SARAH.context.scribe.lastReco, callback);

  } else if(event == TIME_ELAPSED) {
    // timeout !
    SARAH.context.scribe.hook = undefined;
    // aurait-on compris autre chose ?
    if (SARAH.context.scribe.lastPartialConfidence >= 0.7 && SARAH.context.scribe.compteurPartial > SARAH.context.scribe.compteur) {
      decodeScribe(SARAH.context.scribe.lastPartial, callback);
    } else {
      SARAH.context.scribe.activePlugin('Aucun (Time)');
      //ScribeSpeak("Désolé je n'ai pas compris. Merci de réessayer.", true);
      return callback({'tts': "Désolé je n'ai pas compris. Merci de réessayer."});
    }
  } else {
    // pas traité
  }
}

function decodeScribe(search, callback) {

  console.log("Search: " + search);
  var rgxp = /(il est quelle heure|quelle heure est-il|peux tu me donner l'heure|tu peux me donner l'heure|heure) (à|a|de|en|au) (.+)/i;
  var match = search.match(rgxp);

  if (!match || match.length <= 1){
    //ScribeSpeak("Je ne comprends pas");
    callback({'tts': "Je ne comprends pas"});
    return;
  }

  return getTimeLocation(callback, match);
}

function getTimeLocation(callback, match) {

  var location = match[3];

    var search = "il est quelle heure " + match[2] + " " + location;
    var url = "https://www.google.fr/search?q=" + encodeURI(search) + "&btnG=Rechercher&hl=fr&biw=&bih=&gbv=1";
    console.log('Request Url: ' + url);

    var request = require('request');
    var cheerio = require('cheerio');

    var options = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
      'Accept-Charset': 'utf-8'
    };

    request({ 'uri': url, 'headers': options, 'encoding': 'binary' }, function(error, response, html) {

    if (error || response.statusCode != 200) {
      //ScribeSpeak("L'action a échoué");
      callback({'tts': "L'action a échoué"});
      return;
    }
    var $ = cheerio.load(html);

    var heure = $('._Tsb._HOb._Qeb ._rkc._Peb').text().trim().replace(':', " heure ");
    var description = $('._Tsb._HOb._Qeb span._HOb._Qeb').text().trim();
    description = description.replace('Heure ', '').replace('(', '').replace(')', '');
    var onlycity = description.split(',')[0];

    if(heure == "") {
      var reponse = "Désolé, je n'ai pas pu avoir d'informations";
    } else {
      var reponse = "Il est " + heure + " " + match[2].trim() + " " + onlycity.trim();
    }

    //ScribeSpeak(reponse);
    callback({'tts': reponse});
    return;
    });
}