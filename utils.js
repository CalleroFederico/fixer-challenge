module.exports = {

  //RegExp for pairs input
  testPair: function (t) {
    var regex = new RegExp(/^([A-Z]{6})$/);
    var match = regex.exec(t);
    return (match) ? true : false;
  },
  
  //RegExp for currency input
  testOne: function (t) {
    var regex = new RegExp(/^([A-Z]{3})$/);
    var match = regex.exec(t);
    return (match) ? true : false;
  },

  extractRates: function (json, o, t) {
    json = JSON.parse(json);
    var from = json.rates[o];
    var to = json.rates[t];
    if ( from == undefined  || to == undefined ) {
      return false;
    } else {
      return { from: from, to: to }
    }
  },
  
  //Takes the EUR value from two currencies and returns conversion rate
  getRate: function (from, to) { 
    return ((1/from) / (1/to)).toFixed(6);
  },
  
  convert: function (amount, rate) {
    return (amount * rate).toFixed(2);
  }

}
