var expect  = require("chai").expect;
var request = require("request");

describe("State of LED", function() {

  describe("display status of LED", function() {

    var url = "http://localhost:4000/db5/status";
    var target = "http://localhost:4000";
    var id = "db5"

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

//    it("returns empty JSON {} ", function(done) {
//      request(url, function(error, response, body) {
//        expect(body).to.equal("{}");
//        done();
//      });
//    });


    var endpoint = "db5/lights"
    it("Sets the lights value to true", function(done) {
      request({url: "http://localhost:4000/db5/lights", method: 'PUT', json: {state: "on"}},  function(error, response, body) {
        console.log(body);
        //expect(body).to.equal("{ tts: 60000, reset: 'false', discovery: 'false', lights: 'on'}");
        expect(body.tts).to.equal(60000);
        expect(body.lights).to.equal("on");
        expect(body.reset).to.equal("false");
        expect(body.discovery).to.equal("false");
        done();
      });
    });
  });
});
