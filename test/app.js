var expect  = require("chai").expect;
var request = require("request");

describe("Server for LED state", function() {

   var url = "http://localhost:4000/";
   //var target = "http://localhost:4000";

   const new_id = "id5"
   const not_found_id = "id6"
   const default_new_id = "id7"
   const new_id2 = "id8"

   const tts_value_default = 60000;
   const send_discovery_default = 'false'
   const reset_state_default = 'false'
   const mode_state_default = 'prog'

   const lights_value_initial = "on"
   const lights_value_changed = "off"

   const tts_value_changed = 30000;
   const reset_state_changed = 'true'
   const send_discovery_state_changed = 'true'
   const mode_state_changed = 'deep'
   const tts_value_max = 60 * 60 * 1000;
   const tts_value_too_high = tts_value_max * 2;

   context('with no endpoint', function() {
      it("returns status 400 and empty body", function(done) {
         request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            expect(response.body).to.equal('No Action');
            done();
         });
      });
   });

/***********************************************************************************/

   context("look up light state for id that doesn't exist", function() {
      var endpoint = not_found_id+"/lights"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("Set lights state for a new ID", function() {
      var endpoint = new_id+"/lights"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state:  lights_value_initial }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(lights_value_initial);
            done();
         });
      });
   });

   context("look up light state for id that does exist", function() {
      var endpoint = new_id+"/lights"
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

   context("Set lights state for an ID that exists", function() {
      var endpoint = new_id+"/lights"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state: lights_value_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(lights_value_changed);
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up time to sleep value for id that doesn't exist", function() {
      var endpoint = not_found_id+"/tts"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up time to sleep value for id that does exist but has never been set", function() {
      var endpoint = new_id+"/tts"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_value_default);
            done();
         });
      });
   })

   context("Set tts state for existing ID", function() {
      var endpoint = new_id+"/tts"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { value: tts_value_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_changed);
            done();
         });
      });
   })

   context("look up time to sleep value for id that exists and has been changed", function() {
      var endpoint = new_id+"/tts"
      it("Returns a valid response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_value_changed);
            done();
         });
      });
   })

   context("Set tts state for none existing ID", function() {
      var endpoint = not_found_id+"/tts"
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

   context("Set tts state for existing ID higher than max allowed", function() {
      var endpoint = new_id+"/tts"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { value: tts_value_too_high }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_max);
            done();
         });
      });

      it("Resets to expected", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { value: tts_value_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_changed);
            done();
         });
      });
   })

//   context("look up tts for id that has been changed", function() {
//      var endpoint = new_id+"/tts"
//      it("Returns a the changed value", function(done) {
//         request(url+endpoint, function(error, response, body) {
//            console.log(body);
//            json = JSON.parse(body);
//            expect(response.statusCode).to.equal(200);
//            expect(json.value).to.equal(tts_value_changed);
//            done();
//         });
//      });
//   })

/***********************************************************************************/

   context("look up discovery for id that doesn't exist", function() {
      var endpoint = not_found_id+"/send-discovery"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up discovery for id that does exist but has never been set", function() {
      var endpoint = new_id+"/send-discovery"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(send_discovery_default);
            done();
         });
      });
   })

   context("Set discovery state for existing ID", function() {
      var endpoint = new_id+"/send-discovery"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state: send_discovery_state_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(send_discovery_state_changed);
            done();
         });
      });
   })

   context("Set discovery state for none existing ID", function() {
      var endpoint = not_found_id+"/send-discovery"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state: 'true' }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up discovery for id that exists and has been changed", function() {
      var endpoint = new_id+"/send-discovery"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(send_discovery_state_changed);
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up reset for id that doesn't exist", function() {
      var endpoint = not_found_id+"/reset"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up reset for id that does exist but has never been set", function() {
      var endpoint = new_id+"/reset"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(reset_state_default);
            done();
         });
      });
   })

   context("Set reset state for existing ID", function() {
      var endpoint = new_id+"/reset"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state: reset_state_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(reset_state_changed);
            done();
         });
      });
   })

   context("Set reset state for none existing ID", function() {
      var endpoint = not_found_id+"/reset"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state: 'true' }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up reset for id that has been changed", function() {
      var endpoint = new_id+"/reset"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(reset_state_changed);
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up mode for id that doesn't exist", function() {
      var endpoint = not_found_id+"/mode"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up mode for id that does exist but has never been set", function() {
      var endpoint = new_id+"/mode"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.mode).to.equal(mode_state_default);
            done();
         });
      });
   })

   context("Set mode state for existing ID", function() {
      var endpoint = new_id+"/mode"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { mode: mode_state_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.mode).to.equal(mode_state_changed);
            done();
         });
      });
   })

   context("Set mode state for none existing ID", function() {
      var endpoint = not_found_id+"/mode"
      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { mode: 'deep' }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up mode for id that has been changed", function() {
      var endpoint = new_id+"/mode"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.mode).to.equal(mode_state_changed);
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up sequence id for id that doesn't exist", function() {
      var endpoint = not_found_id+"/seqid"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up sequence id for id that does exist", function() {
      var endpoint = new_id+"/seqid"
      it("Returns a valid response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(0);
            done();
         });
      });
   })

   context("Attempt to set sequence id", function() {
      var endpoint = new_id+"/seqid"
      it("Returns a Forbidden response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { mode: mode_state_changed }}, function(error, response, body) {
            //console.log(request);
            //console.log(error);
            //console.log(body);
            expect(response.statusCode).to.equal(403);
            expect(body).to.equal("Forbidden");
            done();
         });
      });
   })

   context("Check sequence ID isn't incremented", function() {
      var endpoint = new_id+"/seqid"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(0);
            done();
         });
      });
   })

/***********************************************************************************/

   context("look up status for id that doesn't exist", function() {
      var endpoint = not_found_id+"/status"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            //json = JSON.parse(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done()
         });
      });
   })

   context("look up status for id that does exist", function() {
      var endpoint = new_id+"/status"
      it("Returns a valid value for each parameter", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.lights).to.equal(lights_value_changed);
            expect(json.tts).to.equal(tts_value_changed);
            expect(json.discovery).to.equal(send_discovery_state_changed);
            expect(json.reset).to.equal(reset_state_changed);
            expect(json.mode).to.equal(mode_state_changed);
            //expect(json.seqid).to.equal(1);
            expect(json.seqid).to.be.a('number');
            expect(json.seqid % 1).to.equal(0);
            done()
         });
      });
   })

   context("look up status for id that exist but only lights has been set", function() {
      var set_endpoint = default_new_id+"/lights"
      var status_endpoint = default_new_id+"/status"

      it("Creates the record", function(done) {
         request({url: url+set_endpoint, method: 'PUT', json: { state: lights_value_initial }}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal("on");
            done()
         });
      });

      it("Returns a valid value for each parameter", function(done) {
         request(url+status_endpoint, function(error, response, body2) {
            console.log(body2);
            json = JSON.parse(body2);
            expect(response.statusCode).to.equal(200);
            expect(json.lights).to.equal(lights_value_initial);
            expect(json.tts).to.equal(tts_value_default);
            expect(json.discovery).to.equal(send_discovery_default);
            expect(json.reset).to.equal(reset_state_default);
            //expect(json.mode).to.not.be.undefined.to.equal(mode_state_default);
            expect(json.mode).equal(mode_state_default);
            //expect(json.seqid).equal(1);
            expect(json.seqid).to.be.a('number');
            expect(json.seqid % 1).to.equal(0);
            done()
         });
      });
   })

   context("Ensure sequence id increments", function() {
      var set_endpoint = new_id2+"/lights"
      var status_endpoint = new_id2+"/status"

      it("Creates a new record", function(done) {
         request({url: url+set_endpoint, method: 'PUT', json: { state: lights_value_initial }}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
         });
      });

      it("Returns a valid value for sequence id", function(done) {
         request(url+status_endpoint, function(error, response, body2) {
            console.log(body2);
            json = JSON.parse(body2);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(1);
            done()
         });
      });

      it("Returns a valid incremented value for sequence id", function(done) {
         request(url+status_endpoint, function(error, response, body2) {
            console.log(body2);
            json = JSON.parse(body2);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(2);
            done()
         });
      });

      it("Returns a valid incremented value for sequence id", function(done) {
         request(url+status_endpoint, function(error, response, body2) {
            console.log(body2);
            json = JSON.parse(body2);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(3);
            done()
         });
      });

      it("Deletes the record", function(done) {
         request({url: url+new_id2, method: 'DELETE'}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
         });
      });
   })


/***********************************************************************************/
   context("delete id that doesn't exist", function() {
      var endpoint = not_found_id
      //console.log(url+endpoint);
      it("Returns a valid not found response", function(done) {
         request({url: url+endpoint, method: 'DELETE'}, function(error, response, body) {
            console.log(body);
            //json = JSON.parse(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done()
         });
      });
   })

   context("delete id that does exist", function() {
      var endpoint = new_id

      it("Creates the record", function(done) {
         request(url+new_id+"/status", function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done()
         });
      });

      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'DELETE'}, function(error, response, body) {
            //console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json).to.equal(new_id);
            done()
         });
      });

      it("Checks the status returns not found", function(done) {
         request(url+new_id+"/status", function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            done()
         });
      });
   })

});
