'use strict';
//Required stack
const Hapi = require('@hapi/hapi');
const m = require('./mongo-mediator');
const utils = require('./utils');
const fx = require('./fixer');

//Server definition
const init = async () => {
  
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });
	
	//Base get sends you to the repository.
    server.route({
        method: 'GET',
        path: '/',
        handler: (req, h) => {
			    return h.redirect('https://github.com/CalleroFederico/fixer-challenge');
        }
    });	
    
    //GET
    /* /currency/all
    * returns detailed list of currencies properties
    *{ 
    *  currencies:[
    *    {
    *	   origin: ´${origin}´, 
    *      to:[
    *	     {
    *		   target:´${target}´, 
    *          originalRate:´${originalRate}´, 
    *          fee:´${fee}%´, 
    *	       feeAmount:´${feeAmount}´,
    *	       rateWithFee:´${rateWithFee}´
    *        }
    *	   ]
    *    }
    *  ]
    *}
    */
    server.route({
        method: 'GET',
        path: '/currency/all',
        handler: (req, h) => {
          return new Promise(res => {
            m.find()
              .then(function (r) {
                if (r[0]) {
                  var currArr = {};
                  for (var i = 0; i < r.length; i++) {
                    if ( currArr[r[i].origin] == undefined ) {
                      currArr[r[i].origin] = { to: {} };
	            }
                    currArr[r[i].origin].to[r[i].to] = { originalRate: r[i].rate, fee: r[i].fee + '%', feeAmount: r[i].rate * (r[i].fee/100), rateWithFee: r[i].rate - (r[i].fee/100) };
                  } 
                  res(h.response({ currencies: currArr  }));
                } else {
                  res(h.response().code(404));
                }
              })
            .catch(function (e) {
		    console.log(e);
              res(h.response().code(500));
            });
        });
      }
    });
	
    /* /currency/{currency}
    *   returns detailed currency properties
    *{
    *  origin: ´${origin}´, 
    *  to:[
    *    {
    *      target:´${target}´, 
    *      originalRate:´${originalRate}´, 
    *      fee:´${fee}%´, 
    *      feeAmount:´${feeAmount}´,
    *      rateWithFee:´${rateWithFee}´
    *    }
    *  ]
    *}
    */
    server.route({
        method: 'GET',
        path: '/currency/{currency}',
        handler: (req, h) => {
          return new Promise(res => {
            if (!utils.testOne(req.params.currency)) {
              res(h.response().code(400));
            } else {
              var origin = req.params.currency;
              m.find({ origin: origin })
                .then(function (r) {
                  if (r[0]) {
                    var exchangeArr = [];
                    for (var i = 0; i < r.length; i++) {
                      exchangeArr.push({ target: r[i].to, originalRate: r[i].rate, fee: r[i].fee + '%', feeAmount: r[i].rate * (r[i].fee/100), rateWithFee: r[i].rate - (r[i].fee/100) });
                    }
                    res({ origin: origin, to: exchangeArr });
                  } else {
                    res(h.response().code(404));
                  }
                })
              .catch(function (e) {
                res(h.response().code(500));
              });
	    }
          });
        }
    });
	
    /* /fee/all
    * returns list of existing pairs fees
    *{ 
    *  fees:[
    *    {
    *      pair:´${pair}´,
    *      fee:´${fee}%´
    *    }
    *  ]
    *}
    */
    server.route({
        method: 'GET',
        path: '/fee/all',
        handler: (req, h) => {
          return new Promise(res => {
            m.find()
              .then(function (r) {
                if (r[0]) {
                  var feeArr = [];
                  for (var i = 0; i < r.length; i++) {
                    feeArr.push({ pair: '' + r[i].origin + r[i].to, fee: r[i].fee + '%' });
                  }
                  res({ fees: feeArr });
                } else {
                  res(h.response().code(404));
                }
              })
            .catch(function (e) {
              res(h.response().code(500));
            });
          });
        }
    });
	
    /* /fee/{pair}
    * returns fee of specified pair
    *{  
    *  pair:´${pair}´,
    *  fee:´${fee}%´
    *}
    *
    */
    server.route({
        method: 'GET',
        path: '/fee/{pair}',
        handler: (req, h) => {
          return new Promise(res => {
            if (!utils.testPair(req.params.pair)) {
              res(h.response().code(400));
            } else {
              var origin = req.params.pair.substring(0,3);
              var to = req.params.pair.substring(3,6);
              m.find({ origin: origin, to: to })
                .then(function (r) {
                  if (r[0]) {
                    res({ pair: `${origin}${to}`, fee: r[0].fee });
                  } else {
                    res(h.response().code(404));
                  }
                })
              .catch(function (e) {
                res(h.response().code(500));
              });
            }
          });
        }
    });
	
    /* /pair/all
    * returns the full pair list
    *{
    *  pairs:[
    *   ´${pair}´
    *  ]
    *}
    */
    server.route({
        method: 'GET',
        path: '/pair/all',
        handler: (req, h) => {
          return new Promise(res => {
            m.find()
              .then(function (r) {
                if (r[0]) {
		  var pairArr = [];
                  for (var i = 0; i < r.length; i++) {
	            pairArr.push('' + r[i].origin + r[i].to);
		  }
	          res({ pairs: pairArr });
                } else {
                  res(h.response().code(404));
                }
              })
            .catch(function (e) {
		    console.log(e);
              res(h.response().code(500));
            });
          });
        }
    });
	
    /* /pair/{pair}
    * returns true if pair exists
    *{
    *  pair: boolean
    *}
    */
    server.route({
        method: 'GET',
        path: '/pair/{pair}',
        handler: (req, h) => {
          return new Promise(res => {
            if (!utils.testPair(req.params.pair)) {
              res(h.response().code(400));
            } else {
              var origin = req.params.pair.substring(0,3);
              var to = req.params.pair.substring(3,6);
              m.find({ origin: origin, to: to })
                .then(function (r) {
                  if (r[0]) {
                    res({ pair: true });
                  } else {
                    res({ pair: false });
                  }
                })
              .catch(function (e) {
                res(h.response().code(500));
              });
            }
          });
        }
    });
	
    /* /pair/rate/{pair}
    * returns pair rate
    *{
    *  pair:´${pair}´, 
    *  rate:´${rate}´
    *}
    */
    server.route({
        method: 'GET',
        path: '/pair/rate/{pair}',
        handler: (req, h) => {
          return new Promise(res => {
            if (!utils.testPair(req.params.pair)) {
              res(h.response().code(400));
            } else {
              var origin = req.params.pair.substring(0,3);
              var to = req.params.pair.substring(3,6);
              m.find({ origin: origin, to: to })
                .then(function (r) {
	          if (r[0]) {
                    res({ pair: `${origin}${to}`, rate: r[0].rate });
		  } else {
	            res(h.response().code(404)); 
             	  }
                })
              .catch(function (e) {
                res(h.response().code(500));
              });
            }
          });		
        }
    });	

    //POST
    /* /pair/create/{pair}
    *  creates a pair rate
    *  returns 200 / 201 / 400 / 500 
    */
    server.route({
        method: 'POST',
        path: '/pair/create/{pair}',
        handler: (req, h) => {
          return new Promise(res => {
	    if (!utils.testPair(req.params.pair)) {
	      res(h.response().code(400));
	    } else {
	      var origin = req.params.pair.substring(0,3);
	      var to = req.params.pair.substring(3,6);
              fx.getFixerData()
                .then(function (fxRates) {
                  var rates = utils.extractRates(fxRates, origin, to);
                  if ( rates ) {
                    var rate = utils.getRate(rates.from, rates.to);
                    m.find({ origin: origin, to: to })
                      .then(function (r) {
                        if (r[0] == undefined) {
                          m.insert({ origin: origin, to: to, rate: rate, fee: 0})
                            .then(function () {
                              res(h.response().code(201))
                            })
                          .catch(function (e) {
                            res(h.response().code(500));
                          });
                        } else {
                          res(h.response().code(200));
                        }
                      })
                    .catch(function (e) {
                      res(h.response().code(500));
                    });
		  } else {
	            res(h.response().code(400));
		  }
                })
              .catch(function (e) {
                res(h.response().code(500));
	      });
	    }          
	  });
        }
    });	

    
    /* /pair/delete/{pair}
    *  deletes a pair rate
    *  returns 200 / 400 / 500
    */
    server.route({
        method: 'POST',
        path: '/pair/delete/{pair}',
        handler: (req, h) => {
          return new Promise(res => {
           if (!utils.testPair(req.params.pair)) {
              res(h.response().code(400));
            } else {
              var origin = req.params.pair.substring(0,3);
              var to = req.params.pair.substring(3,6);
              m.remove({origin: origin, to: to})
	        .then(function (r) {
                  res(h.response().code(200));
		})
              .catch(function (e) {
	        res(h.response().code(500));
	      });
            }
          });
        }
    });
    
    /* /fee/set/{pair}/{fee}
    *  sets pair fee
    *  returns 200 / 400 / 500
    */
    server.route({
        method: 'POST',
        path: '/fee/set/{pair}/{fee}',
        handler: (req, h) => {
          return new Promise(res => {
            if (!utils.testPair(req.params.pair) || isNaN(req.params.fee) ) {
              res(h.response().code(400));
            } else {
              var origin = req.params.pair.substring(0,3);
              var to = req.params.pair.substring(3,6);
              m.update({origin: origin, to: to}, { fee: req.params.fee })
                .then(function (r) {
                  res(h.response().code(200));
                })
              .catch(function (e) {
                res(h.response().code(500));
              });
            }
          });
        }
    });
    
    /* /fee/reset/{pair}
    *  resets pair fee to 0%;
    *  returns 200 / 400 / 500
    */
    server.route({
        method: 'POST',
        path: '/fee/reset/{pair}',
        handler: (req, h) => {
          return new Promise(res => {
            if (!utils.testPair(req.params.pair)) {
              res(h.response().code(400));
            } else {
              var origin = req.params.pair.substring(0,3);
              var to = req.params.pair.substring(3,6);
              m.update({origin: origin, to: to}, { fee: 0 })
                .then(function (r) {
                  res(h.response().code(200));
                })
              .catch(function (e) {
                res(h.response().code(500));
              });
            }
          });
        }
    });
	
    await server.start();
    console.log('Server running on %s', server.info.uri);
};



process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
