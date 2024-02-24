var expect  = require("chai").expect;
var request = require("request");

describe("Server for LED state", function() {

   var url = "http://localhost:4000/";
   var target = "http://localhost:4000";
   var id = "db5"

   context('with no endpoint', function() {
      it("returns status 400 and empty body", function(done) {
         request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            expect(response.body).to.equal({});
//            done();
         });
      });
   });

   context("look up status for id that doesn't exist", function() {
      var endpoint = "db5/lights"
      it("Returns a valid not found response", function(done) {
         request("http://192.168.0.119:4000/db5/status", function(error, response, body) {
//            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal({});
            done();
         });
      });
   })

   context("Set lights state for a new ID", function() {
      var endpoint = "db5/lights"
      it("Returns a valid not found response", function(done) {
         request({url: "http://192.168.0.119:4000/db5/lights", method: 'PUT', json: { state: "on" }}, function(error, response, body) {
            //console.log(body);
            //console.log(response);
            //json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            //expect(json.state).to.equal("on");
            expect(body.state).to.equal("on");
            done();
         });
      });
   });

   context("look up status for id that does exist", function() {
      var endpoint = "db5/lights"
      it("Returns a valid value for each parameter", function(done) {
         request("http://192.168.0.119:4000/db5/status", function(error, response, body) {
            //console.log(response);
            //json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            //expect(body).to.equal('{"reset":"false","discovery":"false","lights":"on"}');
            expect(body.reset).to.equal("false");
            expect(body.lights).to.equal('on');
            expect(body.discovery).to.equal('false');
            done()
         });
      });
   })

//   context("look up status for id that doesn't exist", function() {
//      var endpoint = "db5/lights"
//      it("Sets the lights value to true", function(done) {
//         request({url: "http://localhost:4000/db5/lights", method: 'PUT', json: {state: "on"}},  function(error, response, body) {
//            console.log(body);
//            expect(body.state).to.equal('on');
//            //expect(body).to.equal("{ tts: 60000, reset: 'false', discovery: 'false', lights: 'on'}");
//            //expect(body).to.equal("{ tts: 60000, reset: 'false', discovery: 'false', lights: 'on'}");
//            //expect(body.tts).to.equal(60000);
//            //expect(body.lights).to.equal("on");
//            //expect(body.reset).to.equal("false");
//            //expect(body.discovery).to.equal("false");
////            done();
//         });
//      });
//   });
});
