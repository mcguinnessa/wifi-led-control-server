const http = require('http');
//var fs = require('fs');
const express = require('express')
const app = express()
//const bodyParser = require('body-parser');

//DEFAULT_TIME_TO_SLEEP_MS = 60 * 60 * 1000
DEFAULT_TIME_TO_SLEEP_MS = 60 * 1000
MAX_TIME_TO_SLEEP_MS = 60 * 60 * 1000
MIN_TIME_TO_SLEEP_MS = 10 * 1000

//mergeParams allows the next router to access params
var idRouter = express.Router({mergeParams: true}); 

// middleware to read body, parse it and place results in req.body
app.use(express.json());             // for application/json
app.use(express.urlencoded({ extended: true }));       // for application/x-www-form-urlencoded

//var jsonParser = bodyParser.json()
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
/db5/lights/on
/db5/lights/off
/db5/status/lights
/db5/admin/reset

PUT /id1/lights { state: on}
GET /id1/lights 
PUT /id1/tts { value: 666}
GET /id1/tts 
PUT /id1/discovery { state: true}
GET /id1/discovery 
PUT /id1/reset { state: true}
GET /id1/reset 
DELETE /id1
PUT /id1/mode { mode: deep}
GET /id1/mode 
*/

//const hostname = '192.168.0.124';
const hostname = '';
const port = 4000;
//const port = 0;

const lights_tag = 'lights';
const reset_tag = "reset";
const discovery_tag = "discovery";
const tts_tag = "tts";
const ne_tag = "nextevent";
const mode_tag = "mode";
const state_tag = "state";
const value_tag = "value";
const seqid_tag = "seqid";
const id_tag = "id";

var data = {}

function get_base_struct() {
   return { tts : DEFAULT_TIME_TO_SLEEP_MS, reset : "false" , discovery: "false", mode: "prog", seqid: 0 }
}

app.route('/')
   .get(function (req, res) {
      res.status(400)
         .send("No Action");
   });

//idRouter.use('/:id', actionRouter);
app.use('/:id', idRouter);


idRouter.route('/')
   .get(function (req, res) {
      console.log("idRouter /")
      console.log("id:" + req.params.id)
//      res.json({
//         lights: 'on',
//         reset: 'false'
//      }) 
      res.status(404)
         .send("No Action");
   });

idRouter.route('/')
   .delete(function (req, res) {
      const id = req.params.id;
      console.log("Deleting "+id)

      if ((id in data)){

         delete data[id]
         //node = data[id]
         //if(node.lights){
         //   state[state_tag] = node.lights;
        // }
         rc = {}
         rc[id_tag] = id
         res.status(200)
         res.json(id)
         console.log(rc)

      } else {
         res.status(404)
         .send("Not Found");
      }
      res.end()
  });
 

idRouter.route('/lights')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Lights state for " + id + " (params) to " + req.body.state)

      //console.log(req.param.id)
      console.log("Setting ID:" + id)
      console.log("State:" + req.body.state)

      if (!(id in data)){
         console.log("Creating ID:" + id)
         data[id] = get_base_struct()
      }

      if(req.body.state){
         node = data[id]
         node[lights_tag] = req.body.state
//      } else {
//         node = {}
      }

      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);

      rc = {}
      rc[state_tag] = data[id].lights
      console.log(rc)
      res.json(rc)
      res.end()
  })

idRouter.route('/lights')
   .get( function (req, res){
      //res.setHeader('Content-Type', 'application/json');
      //console.log(req)

      const id = req.params.id;
      console.log("Getting Light state for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         if(node.hasOwnProperty("lights")){
         //if(node.lights){
            state[state_tag] = node.lights;
         }
         res.status(200)
         res.json(state)

      } else {
         res.status(404)
         .send("Not Found");
      }
      console.log(state)
      res.end()
  });

idRouter.route('/send-discovery')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Send Discovery state for " + id + " (params) to " + req.body.state)

      //console.log(req.param.id)
      console.log("ID:" + id)
      console.log("State:" + req.body.state)

      if (id in data){
         if(req.body.state){
            node = data[id]
            node[discovery_tag] = req.body.state

            state = {}
            state[state_tag] = node.discovery;
            res.json(state)
         }
      } else {
         res.status(404)
         .send("Not Found");
      }

      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
      res.end()
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting Send Discovery state for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         //if(node.discovery){
         if(node.hasOwnProperty("discovery")){
            state[state_tag] = node.discovery;
            res.json(state)
         }
      } else {
         res.status(404)
         .send("Not Found");
      }
      //console.log(state)
      res.end()
  });

idRouter.route('/reset')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Reset state for " + id + " (params) to " + req.body.state)

      //console.log(req.param.id)
      console.log("ID:" + id)
      console.log("State:" + req.body.state)

      state = {}
      if (id in data){
         if(req.body.state){
            node = data[id]
            node[reset_tag] = req.body.state

            state[state_tag] = node.reset
            res.json(state)
            console.log(state)
         }
      } else {
         res.status(404)
         .send("Not Found");
      }

      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
      //console.log(node)
      res.end()
  })
   .get( function (req, res){
      const id = req.params.id;
      //console.log("Getting Reset state for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         //if(node.reset){
         if(node.hasOwnProperty("reset")){
            state[state_tag] = node.reset;
         }
         console.log(state)
         res.json(state)
      } else {
         res.status(404)
         .send("Not Found");
      }
      console.log("Getting Reset state for " + id + ":" + state[state_tag])
      //console.log(res)
      res.end()
  });

idRouter.route('/seqid')
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting sequence ID for " + id)
      rc = {};
      if ((id in data)){
         node = data[id]
         if(node.hasOwnProperty("seqid")){
            console.log("Sequence ID for " + id + " " + node.seqid)
            rc[seqid_tag] = node.seqid;
         } else {
            console.log("Sequence ID not found")
            console.log("NODE")
            console.log(node)
         }
         res.json(rc)
      } else {
         res.status(404)
         .send("Not Found");
      }
      //console.log(state)
      res.end()
  });

idRouter.route('/seqid')
   .put( function (req, res){
       res.status(403)
       .send("Forbidden");
       res.end()
  });

/**
 * Returns the TTS variable if it is less than the time until the next event
 *    if it is greater than time to next event, then time to next event is returned
 *    If next event is not set, TTS is returned
 *    if both time to next event and TTS are smaller than the minimal value, the minimal value is returned
 */
idRouter.route('/tts')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Time To Sleep state for " + id + " (params) to " + req.body.value)

      //console.log(req.param.id)
      console.log("ID:" + id)
      console.log("Value:" + req.body.value)
      tts = req.body.value

      if (tts > MAX_TIME_TO_SLEEP_MS){
         tts = MAX_TIME_TO_SLEEP_MS
      } else if (tts < MIN_TIME_TO_SLEEP_MS){
         tts = MIN_TIME_TO_SLEEP_MS
      }

      if (id in data){
         if(req.body.value){
            node = data[id]
            node[tts_tag] = tts

            state = {} 
            state[value_tag] = node.tts;
            res.json(state)
         }
      } else {
         res.status(404)
         .send("Not Found");
      }

//      console.log(node)
      res.end()
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting Time To Sleep value for " + id)
      state = {};

      /* 
       * If TTS is set, us that, if it is not set, the calculate it based on ttme
       */
      if ((id in data)){
         node = data[id]
//         if(node.hasOwnProperty("tts")){
//            state[value_tag] = node.tts;
//         } else if(node.hasOwnProperty("ne")){
//            ne = node.ne
//         }
         if(node.hasOwnProperty(ne_tag)){
            console.log("Using the NE to calculate TTS")
            //console.log(node)
            ms_to_ne = node.nextevent
   
            if(node.hasOwnProperty(tts_tag)){
               tts = node.tts
            } else {
               tts = MIN_TIME_TO_SLEEP_MS
            }

            var now = new Date().getTime()
            console.log("Now:" + now)
            console.log("NE:" +ms_to_ne)
            var ttne = Number(ms_to_ne) - Number(now)
            console.log("ttne:" + ttne )

            if(ttne < tts){
               state[value_tag] = ttne 
            } else {
               state[value_tag] = tts
            }
         } else if (node.hasOwnProperty("tts")){
            console.log("No NE, so using TTS")
            state[value_tag] = node.tts
         }

         if(MIN_TIME_TO_SLEEP_MS > state[value_tag]){
            state[value_tag] = MIN_TIME_TO_SLEEP_MS
         }

         console.log(state)
         res.json(state)
      } else {
         res.status(404)
         .send("Not Found");
      }
      res.end()
  });

idRouter.route('/nextevent')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Time To Next Event for " + id + " (params) to " + req.body.ne)

      //console.log(req.param.id)
      console.log("ID:" + id)
      ms_to_ne = req.body.ne
      console.log("Value:" + ms_to_ne)

      var now = new Date().getTime()
      console.log("Now:" + now)
      var target = Number(now) + Number(ms_to_ne)
      console.log("Target:" + target)

      if (id in data){
         if(req.body.ne){
            node = data[id]
            node[ne_tag] = target

            state = {} 
            state[value_tag] = target;
            console.log(state)
            res.json(state)
         }
      } else {
         res.status(404)
         .send("Not Found");
      }

//      console.log(node)
      res.end()
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting time to  Next Event value for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         if(node.hasOwnProperty(ne_tag)){

//            var now = new Date().getTime()
//            console.log("Now:" + now)
//            var ttt = Number(node.nextevent) - Number(now)
//            console.log("Time To Target:" + ttt)

            state[value_tag] = node[ne_tag];
         }
         console.log(state)
         res.json(state)
      } else {
         res.status(404)
         .send("Not Found");
      }
      res.end()
  });


idRouter.route('/mode')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Mode state for " + id + " (params) to " + req.body.mode)

      console.log("ID:" + id)
      console.log("State:" + req.body.mode)

      if (id in data){
         if(req.body.mode){
            node = data[id]
            node[mode_tag] = req.body.mode

            rc = {}
            rc[mode_tag] = node.mode
            res.json(rc)
         }
      } else {
         res.status(404)
         .send("Not Found");
      }

      res.end()
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting Mode for " + id)
      rc = {};
      if ((id in data)){
         node = data[id]
         //if(node.mode){
         if(node.hasOwnProperty("mode")){
            rc[mode_tag] = node.mode;
         }
         res.json(rc)
      } else {
         res.status(404)
         .send("Not Found");
      }

      res.end()
  });

idRouter.route('/status')
   .get(function (req, res){
      //res.status(200).send('hello id ' + req.params.id);
      const id = req.params.id;
      console.log("Getting status for id: " + id)
      node = {}

      if (id in data){
         node = data[id] 

         data[id][seqid_tag] = node.seqid + 1

         rc = {}
         rc[lights_tag] = node.lights;
         rc[reset_tag] = node.reset;
         rc[discovery_tag] = node.discovery;
         rc[ne_tag] = node.ne;
         rc[tts_tag] = node.tts;
         rc[mode_tag] = node.mode;
         rc[seqid_tag] = node.seqid;
         res.json(rc)

         console.log(rc)

         data[id][reset_tag] = "false"; 
         data[id][discovery_tag] = "false" 
        
      } else {
         //data[id] = {}
         res.status(404)
         .send("Not Found");
      }
      //console.log(node)
      //res.json(node)


      //res.setHeader("Content-Type", "application/json");
      res.end()

      //Reset to false after called once
    //  data[id][reset_tag] = "false"; 
     // data[id][discovery_tag] = "false"; 
      //console.log(node)
  });


app.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})
