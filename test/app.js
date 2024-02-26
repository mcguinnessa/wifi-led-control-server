var expect  = require("chai").expect;
var request = require("request");

describe("Server for LED state", function() {

   var url = "http://localhost:4000/";
   var target = "http://localhost:4000";

   context('with no endpoint', function() {
      it("returns status 400 and empty body", function(done) {
         request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            expect(response.body).to.equal('No Action');
            done();
         });
      });
   });

   context("look up light state for id that doesn't exist", function() {
      var endpoint = "db6/lights"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("Set lights state for a new ID", function() {
      var endpoint = "db5/lights"
      it("Returns a success response", function(done) {
         //request({url: "http://192.168.0.119:4000/db5/lights", method: 'PUT', json: { state: "on" }}, function(error, response, body) {
         request({url: url+endpoint, method: 'PUT', json: { state: "on" }}, function(error, response, body) {
            console.log(body);
            //response.should.have.status(200);
            expect(response.statusCode).to.equal(200);
            //expect(json.state).to.equal("on");
            expect(body.state).to.equal("on");
            done();
         });
      });
   });

   context("look up light state for id that does exist", function() {
      var endpoint = "db5/lights"
      it("Returns valid state", function(done) {
         request({url: url+endpoint}, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal('on');
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up time to sleep value for id that doesn't exist", function() {
      var endpoint = "db6/tts"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up time to sleep value for id that does exist but has never been set", function() {
      var endpoint = "db5/tts"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(60000);
            done();
         });
      });
   })

   context("Set tts state for existing ID", function() {
      var endpoint = "db5/tts"
      const tts_value = 30000;
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { value: tts_value }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value);
            done();
         });
      });
   })

   context("Set tts state for none existing ID", function() {
      var endpoint = "db7/tts"
      const tts_value = 40000;
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { value: tts_value }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up tts for id that has been changed", function() {
      var endpoint = "db5/tts"
      it("Returns a the changed value", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(30000);
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up discovery for id that doesn't exist", function() {
      var endpoint = "db6/send-discovery"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up discovery for id that does exist but has never been set", function() {
      var endpoint = "db5/send-discovery"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal('false');
            done();
         });
      });
   })

   context("Set discovery state for existing ID", function() {
      var endpoint = "db5/send-discovery"
      it("Returns a success response", function(done) {
         //request({url: "http://192.168.0.119:4000/db5/lights", method: 'PUT', json: { state: "on" }}, function(error, response, body) {
         request({url: url+endpoint, method: 'PUT', json: { state: 'true' }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal('true');
            done();
         });
      });
   })

   context("Set discovery state for none existing ID", function() {
      var endpoint = "db7/send-discovery"
      it("Returns a success response", function(done) {
         //request({url: "http://192.168.0.119:4000/db5/lights", method: 'PUT', json: { state: "on" }}, function(error, response, body) {
         request({url: url+endpoint, method: 'PUT', json: { state: 'true' }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up discovery for id that has been changed", function() {
      var endpoint = "db5/send-discovery"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal('true');
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up reset for id that doesn't exist", function() {
      var endpoint = "db6/reset"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up reset for id that does exist but has never been set", function() {
      var endpoint = "db5/reset"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal('false');
            done();
         });
      });
   })

   context("Set reset state for existing ID", function() {
      var endpoint = "db5/reset"
      it("Returns a success response", function(done) {
         //request({url: "http://192.168.0.119:4000/db5/lights", method: 'PUT', json: { state: "on" }}, function(error, response, body) {
         request({url: url+endpoint, method: 'PUT', json: { state: 'true' }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal('true');
            done();
         });
      });
   })

   context("Set reset state for none existing ID", function() {
      var endpoint = "db7/reset"
      it("Returns a success response", function(done) {
         //request({url: "http://192.168.0.119:4000/db5/lights", method: 'PUT', json: { state: "on" }}, function(error, response, body) {
         request({url: url+endpoint, method: 'PUT', json: { state: 'true' }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up reset for id that has been changed", function() {
      var endpoint = "db5/reset"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal('true');
            done();
         });
      });
   })

/***********************************************************************************/


//   context("look up status for id that does exist", function() {
//      var endpoint = "db5/status"
//      it("Returns a valid value for each parameter", function(done) {
//         request(url+endpoint, function(error, response, body) {
//            //console.log(response);
//            console.log(body);
//            //json = JSON.parse(body);
//            expect(response.statusCode).to.equal(200);
//            //expect(body).to.equal('{"reset":"false","discovery":"false","lights":"on"}');
//            //expect(body.reset).to.equal('false');
//            expect(body.lights).to.equal('on');
//            //expect(body.discovery).to.equal('false');
//            //expect(body.mode).to.equal('prog');
//            done()
//         });
//      });
//   })

});
