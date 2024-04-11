var expect  = require("chai").expect;
var request = require("request");

var url = "http://localhost:4000/";
const lights_value_initial = "on"

headers = { "Content-Type": "application/json" }


function create_id(id) {
   console.log("CREATE:" + id);
   request({url: url+id+"/lights", method: 'PUT', headers: headers, json: { state:  lights_value_initial }}, function(error, response, body) {
   //console.log(body);
      expect(response.statusCode).to.equal(200);
   });
}

function delete_id(id) {
   
   console.log("DELETE:" + id);
   request({url: url+id, method: 'DELETE', headers: headers }, function(error, response, body) {
      //console.log("DELETE:body);
      expect(response.statusCode).to.equal(200);
   });
}

describe("Server for LED state", function() {

   //var target = "http://localhost:4000";

   const new_id = "id5"
   const not_found_id = "id6"
   const default_new_id = "id7"
   const new_id2 = "id8"

   const tts_value_default = 60 * 1000;
   const tts_value_changed = 6 * 60 * 1000;

   const send_discovery_default = 'false'
   const send_discovery_changed = 'true'

   const reset_state_default = 'false'
   const reset_state_changed = 'true'



   const mode_state_default = 'prog'

   const lights_value_changed = "off"

   const mode_state_changed = 'deep'
   const tts_value_max = 60 * 60 * 1000;
   const tts_value_too_high = tts_value_max * 2;
   const tts_value_min = 10 * 1000;
   const tts_value_too_low = 1;

//   const ne_value_changed = 6 * 60 * 1000;
//   const ne_value_default = 86400;

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
         delete_id(new_id);
      });
   });

   context("look up light state for id that does exist", function() {
 
      var endpoint = new_id+"/lights"
      it("Returns valid state", function(done) {
         create_id(new_id);
         request({url: url+endpoint}, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal('on');
            done();
         });
         delete_id(new_id);
      });
   })

   context("Set lights state for an ID that exists", function() {
      var endpoint = new_id+"/lights"
      it("Returns a success response", function(done) {
         create_id(new_id);
         request({url: url+endpoint, method: 'PUT', json: { state: lights_value_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(lights_value_changed);
            done();
         });
         delete_id(new_id);
      });
   })

/***********************************************************************************/

   context("TTS: look up time to sleep value for id that doesn't exist", function() {
      it("Returns a valid not found response", function(done) {
         request(url+not_found_id+"/tts", function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("TTS: look up time to sleep value for id that does exist but has never been set", function() {

      it("Returns a valid not found response", function(done) {
         create_id(new_id);
         request(url+new_id+"/tts", function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_value_default);
            done();
         });
         delete_id(new_id);
      });
   })

   context("TTS: Set tts state for existing ID", function() {
      it("Returns a success response", function(done) {
         create_id(new_id);
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_value_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_changed);
            done();
         });
         delete_id(new_id);
      });
   })

   context("TTS: look up time to sleep value for id that exists and has been changed", function() {

      it("Creates the record, checks the value is the default one", function(done) {
         create_id(new_id);

         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_value_default);
            done();
         });
      });

      it("Changes the value, Returns a success response", function(done) {
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_value_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_changed);
            done();
         });
      });

      it("Checks the value has been changed", function(done) {
         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_value_changed);
            done();
         });
         delete_id(new_id);
      });
   })

   context("TTS: Set tts state for none existing ID", function() {
      const tts_value = 40000;
      it("Returns a success response", function(done) {
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_value }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("TTS: Set tts state for existing ID higher than max allowed", function() {
      it("Returns a success response", function(done) {
         create_id(new_id);
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_value_too_high }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_max);
            done();
         });
         delete_id(new_id);
      });

   })

   context("TTS: Set tts state for existing ID lower than min allowed", function() {
      it("Returns a success response", function(done) {
         create_id(new_id);
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_value_too_low }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_min);
            done();
         });
         delete_id(new_id);
      });

   })

   context("look up tts for id that has been changed", function() {
      var endpoint = new_id+"/tts"

      it("Returns a the changed value", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_value_default);
            done();
         });
      });

      it("Returns a success response", function(done) {
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_value_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_value_changed);
            done();
         });
      });

      it("Returns a the changed value", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_value_changed);
            done();
         });
         delete_id(new_id);
      });
   })

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
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(send_discovery_default);
            done();
         });
         delete_id(new_id);
      });
   })

   context("Set discovery state for existing ID", function() {
      var endpoint = new_id+"/send-discovery"
      it("Returns a success response", function(done) {
         create_id(new_id);
         request({url: url+endpoint, method: 'PUT', json: { state: send_discovery_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(send_discovery_changed);
            done();
         });
         delete_id(new_id);
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

      it("Creates the record, checks it is the default value", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(send_discovery_default);
            done();
         });
      });

      it("Changes the TTS value", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state: send_discovery_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(send_discovery_changed);
            done();
         });
      });

      it("Checks the value has been changed", function(done) {
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(send_discovery_changed);
            done();
         });
         delete_id(new_id);
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
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(reset_state_default);
            done();
         });
         delete_id(new_id);
      });
   })

   context("Set reset state for existing ID", function() {
      var endpoint = new_id+"/reset"
      it("Returns a success response", function(done) {
         create_id(new_id);
         request({url: url+endpoint, method: 'PUT', json: { state: reset_state_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(reset_state_changed);
            done();
         });
         delete_id(new_id);
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

      it("Returns the default value", function(done) {
         create_id(new_id);
         request({url: url+endpoint, method: 'GET', headers: headers}, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(reset_state_default);
            done();
         });
      });

      it("Returns a success response", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { state: reset_state_changed }, headers: headers}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(reset_state_changed);
            done();
         });
      });

      it("Returns a the changed value", function(done) {
         request({url: url+endpoint, method: 'GET', headers: headers}, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.state).to.equal(reset_state_changed);
            done();
         });
         delete_id(new_id);
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
      it("Returns a valid response", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.mode).to.equal(mode_state_default);
            done();
         });
         delete_id(new_id);
      });
   })

   context("Set mode state for existing ID", function() {
      var endpoint = new_id+"/mode"
      it("Returns a success response", function(done) {
         create_id(new_id);
         request({url: url+endpoint, method: 'PUT', json: { mode: mode_state_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.mode).to.equal(mode_state_changed);
            done();
         });
         delete_id(new_id);
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

      it("Creates the record and checks it is the default value", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.mode).to.equal(mode_state_default);
            done();
         });
      });

      it("Change the value", function(done) {
         request({url: url+endpoint, method: 'PUT', json: { mode: mode_state_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.mode).to.equal(mode_state_changed);
            done();
         });
      });

      it("Checks it is the changed value", function(done) {
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.mode).to.equal(mode_state_changed);
            done();
         });
         delete_id(new_id);
      });
   })

/***********************************************************************************/

   context("look up next event for id that doesn't exist", function() {
      var endpoint = not_found_id+"/nextevent"
      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up next event for id that does exist but has never been set", function() {
      var endpoint = new_id+"/nextevent"
      it("Returns a valid not found response", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(undefined)
            done();
         });
         delete_id(new_id);
      });
   })

   context("Set next event for existing ID", function() {
      var endpoint = new_id+"/nextevent"
      
      it("Returns a success response", function(done) {
         create_id(new_id);
         ne_offset = 60 * 60 * 1000
         ne_expected = ne_offset + Date.now()
         console.log("Expected:" + ne_expected);

         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset }}, function(error, response, body) {
            console.log(body);

            expect(response.statusCode).to.equal(200);
            expect(body.value).to.be.above(ne_expected) 
            expect(body.value).to.be.below(ne_expected + 2000) 
           
            done();
         });
         delete_id(new_id);
      });
   })

   context("Set next event for existing ID as a string", function() {
      var endpoint = new_id+"/nextevent"
      
      it("Returns a success response", function(done) {
         create_id(new_id);
         ne_offset = 60 * 60 * 1000
         ne_expected = ne_offset + Date.now()
         console.log("Expected:" + ne_expected);

         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset.toString() }}, function(error, response, body) {
            console.log(body);

            expect(response.statusCode).to.equal(200);
            expect(body.value).to.be.above(ne_expected) 
            expect(body.value).to.be.below(ne_expected + 2000) 
           
            done();
         });
         delete_id(new_id);
      });
   })

   context("Set next event for none existing ID", function() {
      var endpoint = not_found_id+"/nextevent"
      it("Returns a success response", function(done) {
         ne_offset = 60 * 60 * 1000
         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(404);
            expect(body).to.equal("Not Found");
            done();
         });
      });
   })

   context("look up next event for id that has been changed", function() {
      var endpoint = new_id+"/nextevent"

      it("Creates the record and checks the default value", function(done) {
         create_id(new_id);
         ne_offset = 60 * 60 * 1000
         ne_expected = ne_offset + Date.now()
         console.log("Expected:" + ne_expected);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(undefined)
            //expect(json.value).to.equal(ne_value_default);
            //expect(json.value).to.be.above(ne_expected) 
            //expect(json.value).to.be.below(ne_expected + 2000) 
            done();
         });
      });

      it("Changes the value", function(done) {
         ne_offset_changed = 5 * 60 * 60 * 1000
         ne_expected_changed = ne_offset_changed + Date.now()
         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            //expect(body.value).to.equal(ne_value_changed);
            expect(body.value).to.be.above(ne_expected_changed) 
            expect(body.value).to.be.below(ne_expected_changed + 2000) 
            done();
         });
      });

      it("Checks the value has changed", function(done) {
         request(url+endpoint, function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            //expect(json.value).to.equal(ne_value_changed);
            expect(json.value).to.be.above(ne_expected_changed) 
            expect(json.value).to.be.below(ne_expected_changed + 2000) 
            done();
         });
         delete_id(new_id);
      });
   });

   context("look up tts for id that has been changed as next event to time longer than TTS", function() {
      var endpoint = new_id+"/nextevent"
      it("Creates the record and checks the default value", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(undefined)
            done();
         });
      });

      tts_non_standard_value = 60075
      it("Changes the TTS value, Returns a success response", function(done) {
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_non_standard_value }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_non_standard_value);
            done();
         });
      });

      it("Checks the tts value", function(done) {
         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_non_standard_value);
            done();
         });
      });

      it("Changes the value", function(done) {
         ne_offset_changed = 5 * 60 * 60 * 1000
         ne_expected_changed = ne_offset_changed + Date.now()
         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            //expect(body.value).to.equal(ne_value_changed);
            expect(body.value).to.be.above(ne_expected_changed) 
            expect(body.value).to.be.below(ne_expected_changed + 2000) 
            done();
         });
      });

      it("Checks the tts value has is the same as the changed value ", function(done) {
         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_non_standard_value);
            done();
         });
         delete_id(new_id);
      });
   });

   context("look up tts for id that has been changed as next event to time shorter than TTS", function() {
      var endpoint = new_id+"/nextevent"
      it("Creates the record and checks the default value", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(undefined)
            done();
         });
      });

      const ne_offset_changed = 10 * 60 * 1000
      const tts_non_standard_value_high = 1200000
      const delta = tts_non_standard_value_high - ne_offset_changed

      //tts_non_standard_value = 60075
      it("Changes the TTS value, Returns a success response", function(done) {
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_non_standard_value_high }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_non_standard_value_high);
            done();
         });
      });

      it("Checks the tts value", function(done) {
         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_non_standard_value_high);
            done();
         });
      });

      it("Changes the nextevent value", function(done) {
         ne_expected_changed = ne_offset_changed + Date.now()
         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            //expect(body.value).to.equal(ne_value_changed);
            expect(body.value).to.be.above(ne_expected_changed) 
            expect(body.value).to.be.below(ne_expected_changed + 2000) 
            done();
         });
      });

      it("Checks the tts value has is the is less than the TTS", function(done) {
         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            //expect(json.value).to.equal(tts_non_standard_value);
            //expect(body.value).to.be.above(ne_expected_changed) 
            expect(json.value).to.be.below(delta) 
            expect(json.value).to.be.below(tts_non_standard_value_high) 
            expect(json.value).to.be.above(delta - 5000) 
            done();
         });
         delete_id(new_id);
      });
   });

   context("look up tts via status for id that has been changed as next event to time longer than TTS", function() {
      var endpoint = new_id+"/nextevent"
      it("Creates the record and checks the default value", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(undefined)
            done();
         });
      });

      tts_non_standard_value = 60075
      it("Changes the TTS value, Returns a success response", function(done) {
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_non_standard_value }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_non_standard_value);
            done();
         });
      });

      it("Checks the tts value", function(done) {
         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_non_standard_value);
            done();
         });
      });

      it("Changes the value", function(done) {
         ne_offset_changed = 5 * 60 * 60 * 1000
         ne_expected_changed = ne_offset_changed + Date.now()
         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            //expect(body.value).to.equal(ne_value_changed);
            expect(body.value).to.be.above(ne_expected_changed) 
            expect(body.value).to.be.below(ne_expected_changed + 2000) 
            done();
         });
      });

      it("Checks the tts via status value has is the same as the changed value ", function(done) {
         console.log("ALEX");
         request(url+new_id+"/status", function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);

            expect(json.lights).to.equal("on");
            //expect(json.tts).to.equal(tts_value_default);
            expect(json.discovery).to.equal(send_discovery_default);
            expect(json.reset).to.equal(reset_state_default);
            expect(json.mode).to.equal(mode_state_default);
            expect(json.seqid).to.be.a('number');
            expect(json.seqid % 1).to.equal(0);
            //expect(json.nextevent).to.equal(0);
            //expect(json.nextevent).to.equal(0);
            expect(json.nextevent).to.be.above(ne_expected_changed) 
            expect(json.nextevent).to.be.below(ne_expected_changed + 2000) 
            expect(json.tts).to.equal(tts_non_standard_value);

            done();
         });
         delete_id(new_id);
      });
   });

   context("look up tts via status for id that has been changed as next event to time shorter than TTS", function() {
      var endpoint = new_id+"/nextevent"
      it("Creates the record and checks the default value", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(undefined)
            done();
         });
      });

      const ne_offset_changed = 10 * 60 * 1000
      const tts_non_standard_value_high = 1200000
      const delta = tts_non_standard_value_high - ne_offset_changed

      //tts_non_standard_value = 60075
      it("Changes the TTS value, Returns a success response", function(done) {
         request({url: url+new_id+"/tts", method: 'PUT', json: { value: tts_non_standard_value_high }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.value).to.equal(tts_non_standard_value_high);
            done();
         });
      });

      it("Checks the tts value", function(done) {
         request(url+new_id+"/tts", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            expect(json.value).to.equal(tts_non_standard_value_high);
            done();
         });
      });

      it("Changes the nextevent value", function(done) {
         var endpoint = new_id+"/nextevent"
         ne_expected_changed = ne_offset_changed + Date.now()
         request({url: url+endpoint, method: 'PUT', json: { nextevent: ne_offset_changed }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            //expect(body.value).to.equal(ne_value_changed);
            expect(body.value).to.be.above(ne_expected_changed) 
            expect(body.value).to.be.below(ne_expected_changed + 2000) 
            done();
         });
      });

      it("Checks the tts value via status has is the is less than the TTS", function(done) {
         request(url+new_id+"/status", function(error, response, body) {
            json = JSON.parse(body);
            console.log(json);
            expect(response.statusCode).to.equal(200);
            //expect(json.value).to.equal(tts_non_standard_value);
            //expect(body.value).to.be.above(ne_expected_changed) 
            expect(json.tts).to.be.below(delta) 
            expect(json.tts).to.be.below(tts_non_standard_value_high) 
            expect(json.tts).to.be.above(delta - 5000) 

            expect(json.lights).to.equal("on");
            //expect(json.tts).to.equal(tts_value_default);
            expect(json.discovery).to.equal(send_discovery_default);
            expect(json.reset).to.equal(reset_state_default);
            expect(json.mode).to.equal(mode_state_default);
            expect(json.seqid).to.be.a('number');
            expect(json.seqid % 1).to.equal(0);

            //expect(json.nextevent).to.equal(0);
            expect(json.nextevent).to.be.above(ne_expected_changed) 
            expect(json.nextevent).to.be.below(ne_expected_changed + 2000) 

            done();
         });
         delete_id(new_id);
      });
   });

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
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(0);
            done();
         });
         delete_id(new_id);
      });
   })

   context("Attempt to set sequence id", function() {
      var endpoint = new_id+"/seqid"
      it("Returns a Forbidden response", function(done) {
         create_id(new_id);
         request({url: url+endpoint, method: 'PUT', json: { mode: mode_state_changed }}, function(error, response, body) {
            //console.log(request);
            //console.log(error);
            //console.log(body);
            expect(response.statusCode).to.equal(403);
            expect(body).to.equal("Forbidden");
            done();
         });
         delete_id(new_id);
      });
   })

   context("Check sequence ID isn't incremented with multiple calls", function() {
      var endpoint = new_id+"/seqid"
      it("Returns a valid not found response", function(done) {
         create_id(new_id);
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(0);
            done();
         });
      });

      it("Returns a valid not found response", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(0);
            done();
         });
         delete_id(new_id);
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
      it("Returns a success response", function(done) {
         create_id(new_id);
         console.log(url+new_id+"/lights");
         request({url: url+new_id+"/lights", method: 'PUT', json: { state:  lights_value_initial }}, function(error, response, body) {
            console.log(body);
            expect(response.statusCode).to.equal(200);
            expect(body.state).to.equal(lights_value_initial);
            done();
         });
      });

      var endpoint = new_id+"/status"
      it("Returns a valid value for each parameter", function(done) {
         request(url+endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.lights).to.equal("on");
            expect(json.lights).to.equal("on");
            expect(json.tts).to.equal(tts_value_default);
            expect(json.discovery).to.equal(send_discovery_default);
            expect(json.reset).to.equal(reset_state_default);
            expect(json.mode).to.equal(mode_state_default);
            expect(json.seqid).to.be.a('number');
            expect(json.seqid % 1).to.equal(0);
            expect(json.tts).to.equal(tts_value_default);
            expect(json.discovery).to.equal(send_discovery_default);
            expect(json.reset).to.equal(reset_state_default);
            expect(json.mode).to.equal(mode_state_default);
            expect(json.seqid).to.be.a('number');
            expect(json.seqid % 1).to.equal(0);
            done()
         });
         delete_id(new_id);
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
         create_id(new_id);
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
         delete_id(new_id);
      });
   })

   context("Ensure sequence id increments", function() {
      var set_endpoint = new_id+"/lights"
      var status_endpoint = new_id+"/status"

//      it("Creates a new record", function(done) {
//         request({url: url+set_endpoint, method: 'PUT', json: { state: lights_value_initial }}, function(error, response, body) {
//            expect(response.statusCode).to.equal(200);
//            done()
//         });
//      });

      it("Returns a valid value for sequence id", function(done) {
         create_id(new_id);
         request(url+status_endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(1);
            done()
         });
      });

      it("Returns a valid incremented value for sequence id", function(done) {
         request(url+status_endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(2);
            done()
         });
      });

      it("Returns a valid incremented value for sequence id", function(done) {
         request(url+status_endpoint, function(error, response, body) {
            console.log(body);
            json = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(json.seqid).to.equal(3);
            done()
         });
         delete_id(new_id);
      });

//      it("Deletes the record", function(done) {
//         request({url: url+new_id2, method: 'DELETE'}, function(error, response, body) {
//            expect(response.statusCode).to.equal(200);
//            done()
//         });
//      });
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

//      it("Creates the record", function(done) {
//         request(url+new_id+"/status", function(error, response, body) {
//            expect(response.statusCode).to.equal(200);
//            done()
//         });
//      });

      it("Returns a success response", function(done) {
         create_id(new_id);
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
