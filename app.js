const http = require('http');
//var fs = require('fs');
const express = require('express')
const app = express()
//const bodyParser = require('body-parser');

//DEFAULT_TIME_TO_SLEEP_MS = 60 * 60 * 1000
DEFAULT_TIME_TO_SLEEP_MS = 60 * 1000

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
PUT /mode { mode: deep}
GET /mode 
*/

//const hostname = '192.168.0.124';
const hostname = '';
const port = 4000;
//const port = 0;

const lights_tag = 'lights';
const reset_tag = "reset";
const discovery_tag = "discovery";
const tts_tag = "tts";
const state_tag = "state";
const value_tag = "value";
const id_tag = "id";

var data = {}

function get_base_struct() {
   return { tts : DEFAULT_TIME_TO_SLEEP_MS, reset : "false" , discovery: "false", mode: "prog"}
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
      console.log("ID:" + id)
      console.log("State:" + req.body.state)

      if (!(id in data)){
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
         if(node.lights){
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
         if(node.discovery){
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

      if (id in data){
         if(req.body.state){
            node = data[id]
            node[reset_tag] = req.body.state

            state = {}
            state[state_tag] = node.reset
            res.json(state)
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
      console.log("Getting Reset state for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         if(node.reset){
            state[state_tag] = node.reset;
         }
         res.json(state)
      } else {
         res.status(404)
         .send("Not Found");
      }
      //console.log(state)
      res.end()
  });

idRouter.route('/tts')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Time To Sleep state for " + id + " (params) to " + req.body.value)

      //console.log(req.param.id)
      console.log("ID:" + id)
      console.log("Value:" + req.body.value)

      if (id in data){
         if(req.body.value){
            node = data[id]
            node[tts_tag] = req.body.value

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
      if ((id in data)){
         node = data[id]
         if(node.tts){
            state[value_tag] = node.tts;
         }
         console.log(state)
         res.json(state)
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

         rc = {}
         rc[lights_tag] = node.lights;
         rc[reset_tag] = node.reset;
         rc[discovery_tag] = node.discovery;
         rc[tts_tag] = node.tts;
         res.json(rc)

         console.log(rc)

         data[id][reset_tag] = "false"; 
         data[id][discovery_tag] = "false"; 
        
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
