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
const port = 3000;
//const port = 0;

lights_tag = "lights";
reset_tag = "reset";

var data = {}


//lights_state = "off"

//state = {
//   lights: "off",
//   reset: 0
//}

function get_base_struct() {
   return { tts : DEFAULT_TIME_TO_SLEEP_MS, reset : "false" }
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

      //res.status(200).send("set lights for " + req.params.id );
      res.json(data)
      console.log('reset id ' + req.params.id);
  });

//actionRouter.route('/')
//   .get(function (req, res) {
//      res.status(200)
//         .send('hello actions from id '  +req.params.id);
//  })

//app.get('/:id/status', (req, res) => {
//   id = +req.params["id"]
//   console.log("getting status")
//   console.log("ID:"+id)
//   console.log("STATE:"+JSON.stringify(state))
//   //res.send(JSON.stringify(state))
//   res.send(req.params)
//})
//
//app.get('/:id/status/:element', (req, res) => {
//   id = +req.params["id"]
//   el = +req.params["element"]
//   console.log("getting status")
//   console.log("ID:"+id)
//   console.log("Element:"+element)
//   console.log("STATE:"+JSON.stringify(state))
//
//   if (!(id in data)){
//      data[id] = {element : 0}
//   }

//   //res.send(JSON.stringify(state))
//   res.send(req.params)
//})

//app.put('/:id/lights/:state', (req, res) => {
//   console.log("setting lights")
//   id = req.params["id"]
//   state = req.params["state"]
//   console.log("ID:"+id)
//   console.log("STATE:"+state)
//
//   if (!(id in data)){
//      data[id] = {}
//   }
//   node = data[id]
//   node["lights"] = state
//   
//   console.log("STATE:"+JSON.stringify(data))
//
//   res.send(JSON.stringify(data))
//})


//led_state = {
//   lights: state["lights"]
//}

//const server = http.createServer((req, res) => {


//  res.setHeader('Content-Type', 'text/plain');
//  if( req.method === 'GET') {
//     if (req.url === '/') {
//        res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
//     }else if (req.url === '/db5/status') {
//        console.log("REQ:"+JSON.stringify(state))
//        res.end(JSON.stringify(state));
//        state[reset] = 0
//     }else if (req.url === '/db5/status/vcc') {
//        res.end('<h1>VCC Status</h1>');
//     }else if (req.url === '/db5/status/lights') {
//        console.log("REQ:"+JSON.stringify(led_state))
//        res.end(JSON.stringify(led_state));
//     } else{
//        res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
//     }
//  
//  } else if( req.method === 'PUT') {
//     if (req.url === '/db5/lights/off') {
//        state[lights_tag] = "off";
//        //lights_state = "off"
//     }else if (req.url === '/db5/lights/on') {
//        state[lights_tag] = "on";
//        //lights_state = "on"
//     }else if (req.url === '/db5/admin/reset') {
//        //led_state[reset_tag] = "on";
//        state[reset] = 0
//     } else {
//        res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
//     }
//     console.log(JSON.stringify(state))
//
//     res.end(JSON.stringify(state));
//  }
//});

//server.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
//});

app.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})
