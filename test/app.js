var expect  = require("chai").expect;
var request = require("request");

describe("State of LED", function() {

  describe("display status of LED", function() {

    var url = "http://localhost:4000/db5/status/all";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns empty JSON {} ", function(done) {
      request(url, function(error, response, body) {
        expect(body).to.equal("{}");
        done();
      });
    });
  });
});
