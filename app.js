const http = require('http');
//var fs = require('fs');
const express = require('express')
const app = express()

//DEFAULT_TIME_TO_SLEEP_MS = 60 * 60 * 1000
DEFAULT_TIME_TO_SLEEP_MS = 60 * 1000

//mergeParams allows the next router to access params
var idRouter = express.Router({mergeParams: true}); 

/**
/db5/lights/on
/db5/lights/off
/db5/status/lights
/db5/status/vcc
/db5/admin/reset
*/

//const hostname = '192.168.0.124';
const hostname = '';
const port = 4000;
//const port = 0;

lights_tag = "lights";
reset_tag = "reset";

var data = {}

function get_base_struct() {
   return { tts : DEFAULT_TIME_TO_SLEEP_MS, reset : "false" , discovery: "false"}
}

//idRouter.use('/:id', actionRouter);
app.use('/:id', idRouter);

idRouter.route('/')
   .get(function (req, res) {
      console.log("idRouter /")
//      res.json({
//         lights: 'on',
//         reset: 'false'
//      }) 
      res.status(200)
         .send("No Action");
   });

idRouter.route('/status')
   .get(function (req, res){
      //res.status(200).send('hello id ' + req.params.id);
      rc = {}
      if (req.params.id in data){
         node = data[req.params.id] 
         console.log(node)
         rc = node
      } else {
         data[req.params.id] = {}
      }
      res.json(rc)

      //Reset to false after called once
      data[req.params.id]['reset'] = "false"; 
  });

idRouter.route('/status/:metric')
   .get(function (req, res){
//      res.status(200).send('status id ' + req.params.id + " metric:" + req.params.metric);
      console.log('status id ' + req.params.id + " metric:" + req.params.metric);
      rc = {}
      if (req.params.id in data){
         node = data[req.params.id] 
         if (req.params.metric in node){
            node[req.params.metric] 
            console.log(node)
            rc = { [req.params.metric] : node[req.params.metric] }
         }
      }
      res.json(rc)
  });

idRouter.route('/lights/:state')
   .put(function (req, res){
      if (!(req.params.id in data)){
         data[req.params.id] = get_base_struct()
      }
      node = data[req.params.id]
      node["lights"] = req.params.state

      //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
      res.json(data)
      console.log('status id ' + req.params.id + " lights:" + req.params.state);
  });

idRouter.route('/tts/:tts')
   .put(function (req, res){
      if (!(req.params.id in data)){
         data[req.params.id] = get_base_struct()
      }
      node = data[req.params.id]
      node["tts"] = req.params.tts

      res.json(data)
      console.log('status id ' + req.params.id + " tts:" + req.params.tts);
  });

idRouter.route('/admin/reset')
   .put(function (req, res){
      if (!(req.params.id in data)){
         data[req.params.id] = get_base_struct()
      }
      node = data[req.params.id]
      node["reset"] = "true"

      res.json(data)
      console.log('reset id ' + req.params.id);
  });

idRouter.route('/admin/discovery')
   .put(function (req, res){
      if (!(req.params.id in data)){
         data[req.params.id] = get_base_struct()
      }
      node = data[req.params.id]
      node["discovery"] = "true"

      res.json(data)
      console.log('discovery id ' + req.params.id);
  });


app.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})
