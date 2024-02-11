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

PUT /id/lights { state: on}
GET /id/lights 
PUT /id/tts { value: 666}
GET /id/tts 
PUT /id/discovery { state: true}
GET /id/discovery 
PUT /id/reset { state: true}
GET /id/reset 
*/

//const hostname = '192.168.0.124';
const hostname = '';
const port = 4000;
//const port = 0;

const lights_tag = "lights";
const reset_tag = "reset";
const discovery_tag = "discovery";
const tts_tag = "tts";
//const state_tag = "state";

var data = {}

function get_base_struct() {
   return { tts : DEFAULT_TIME_TO_SLEEP_MS, reset : "false" , discovery: "false"}
}

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
      res.status(200)
         .send("No Action");
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
      } else {
         node = {}
      }


      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
      console.log(node)
      res.json(node)
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting Light state for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         if(node.lights){
            state[lights_tag] = node.lights;
         }
      }
      console.log(state)
      res.json(state)
  });

idRouter.route('/send-discovery')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Send Discovery state for " + id + " (params) to " + req.body.state)

      //console.log(req.param.id)
      console.log("ID:" + id)
      console.log("State:" + req.body.state)

      if (!(id in data)){
         data[id] = get_base_struct()
      }

      if(req.body.state){
         node = data[id]
         node[discovery_tag] = req.body.state
      }

      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
      console.log(node)
      res.json(node)
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting Send Discovery state for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         if(node.discovery){
            state[discovery_tag] = node.discovery;
         }
      }
      console.log(state)
      res.json(state)
  });

idRouter.route('/reset')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Reset state for " + id + " (params) to " + req.body.state)

      //console.log(req.param.id)
      console.log("ID:" + id)
      console.log("State:" + req.body.state)

      if (!(id in data)){
         data[id] = get_base_struct()
      }

      if(req.body.state){
         node = data[id]
         node[reset_tag] = req.body.state
      }

      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
      console.log(node)
      res.json(node)
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting Reset state for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         if(node.reset){
            state[reset_tag] = node.reset;
         }
      }
      console.log(state)
      res.json(state)
  });

idRouter.route('/tts')
   .put( function (req, res){

      const id = req.params.id;
      console.log("Setting Time To Sleep state for " + id + " (params) to " + req.body.value)

      //console.log(req.param.id)
      console.log("ID:" + id)
      console.log("Value:" + req.body.value)

      if (!(id in data)){
         data[id] = get_base_struct()
      }

      if(req.body.value){
         node = data[id]
         node[tts_tag] = req.body.value
      }

      console.log(node)
      res.json(node)
  })
   .get( function (req, res){
      const id = req.params.id;
      console.log("Getting Time To Sleep value for " + id)
      state = {};
      if ((id in data)){
         node = data[id]
         if(node.tts){
            state[tts_tag] = node.tts;
         }
      }
      console.log(state)
      res.json(state)
  });



//idRouter.route('/tts')
//   .put( function (req, res){
//      console.log("Setting Time to Sleep state for " + req.body.id + " to " + req.body.value)
//      console.log(req.body.id)
//      console.log(req.body.value)
//
//      if (!(req.body.id in data)){
//         data[req.body.id] = get_base_struct()
//      }
//      node = data[req.body.id]
//      node["tts"] = req.body.value
//
//      //res.status(200).send("set time to sleep for " + req.params.id + " " + req.params.value);
//      res.json(node)
//  })
//   .get( function (req, res){
//      console.log("Getting Time to Sleep state for " + req.body.id)
//      tts = {};
//      if ((req.body.id in data)){
//         node = data[req.body.id]
//         if(node.tts){
//            tts["tts"] = node.tts;
//         }
//      }
//      console.log(tts)
//      res.json(tts)
//  });

idRouter.route('/status')
   .get(function (req, res){
      //res.status(200).send('hello id ' + req.params.id);
      const id = req.params.id;
      console.log("Getting status for id: " + id)
      node = {}
      if (id in data){
         node = data[id] 
      } else {
         data[id] = {}
      }
      console.log(node)
      res.json(node)

      //Reset to false after called once
      data[id][reset_tag] = "false"; 
      data[id][discovery_tag] = "false"; 
      console.log(node)
  });

//idRouter.route('/status/:metric')
//   .get(function (req, res){
////      res.status(200).send('status id ' + req.params.id + " metric:" + req.params.metric);
//      console.log('status id ' + req.params.id + " metric:" + req.params.metric);
//      rc = {}
//      if (req.params.id in data){
//         node = data[req.params.id] 
//         if (req.params.metric in node){
//            node[req.params.metric] 
//            console.log(node)
//            rc = { [req.params.metric] : node[req.params.metric] }
//
//            if(data[req.params.metric] == true){
//               data[req.params.metric] = false
//            }
//         }
//      }
//      res.json(rc)
//  });
//
//idRouter.route('/lights/:state')
//   .put(function (req, res){
//      if (!(req.params.id in data)){
//         data[req.params.id] = get_base_struct()
//      }
 //     node = data[req.params.id]
//      node["lights"] = req.params.state
//
//      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
//      res.json(data)
//      console.log('status id ' + req.params.id + " lights:" + req.params.state);
//  });
//
//idRouter.route('/tts/:tts')
//   .put(function (req, res){
//      if (!(req.params.id in data)){
//         data[req.params.id] = get_base_struct()
//      }
//      node = data[req.params.id]
//      node["tts"] = req.params.tts
//
//      res.json(data)
//      console.log('status id ' + req.params.id + " tts:" + req.params.tts);
//  });
//
//idRouter.route('/admin/reset')
//   .put(function (req, res){
//      if (!(req.params.id in data)){
//         data[req.params.id] = get_base_struct()
//      }
//      node = data[req.params.id]
//      node["reset"] = "true"
//
//      res.json(data)
//      console.log('reset id ' + req.params.id);
//  });
//
//idRouter.route('/admin/send-discovery')
//   .put(function (req, res){
//      if (!(req.params.id in data)){
//         data[req.params.id] = get_base_struct()
//      }
//      node = data[req.params.id]
//      node["discovery"] = "true"
//
//      res.json(data)
//      console.log('discovery id ' + req.params.id);
//  });
//

app.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})
