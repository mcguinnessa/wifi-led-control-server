const http = require('http');
//var fs = require('fs');
const express = require('express')
const app = express()
//const bodyParser = require('body-parser');

//DEFAULT_TIME_TO_SLEEP_MS = 60 * 60 * 1000
DEFAULT_TIME_TO_SLEEP_MS = 60 * 1000

//mergeParams allows the next router to access params
//var idRouter = express.Router({mergeParams: true}); 

// middleware to read body, parse it and place results in req.body
app.use(express.json());             // for application/json
app.use(express.urlencoded({ extended: true }));       // for application/x-www-form-urlencoded

//var jsonParser = bodyParser.json()
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
/db5/lights/on
/db5/lights/off
/db5/status/lights
/db5/status/vcc
/db5/admin/reset

PUT /lights {id: db5, state: on}
GET /lights 
PUT /tts {id: db5, value: on}
GET /tts 
GET /lsc 
GET /vcc 
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
//app.use('/:id', idRouter);

//idRouter.route('/')
//   .get(function (req, res) {
//      console.log("idRouter /")
////      res.json({
////         lights: 'on',
////         reset: 'false'
////      }) 
//      res.status(200)
//         .send("No Action");
//   });

app.put('/discovery', function (req, res){
   console.log("Setting Discovery state for " + req.body.id + " to " + req.body.state)
   console.log(req.body.id)
   console.log(req.body.state)

   if (!(req.body.id in data)){
      data[req.body.id] = get_base_struct()
   }

   if(req.body.state){
      node = data[req.body.id]
      node["discovery"] = req.body.state
   }

   console.log(node)
   res.json(node)
});

app.get( '/discovery', function (req, res){
   console.log("Getting Discovery state for " + req.body.id)
   state = {};
   if ((req.body.id in data)){
      node = data[req.body.id]
      if(node.discovery){
         state["state"] = node.discovery;
      }
   }
   console.log(state)
   res.json(state)
});

//idRouter.route('/lights')
app.put('/lights', function (req, res){
   console.log("Setting Lights state for " + req.body.id + " to " + req.body.state)
   console.log(req.body.id)
   console.log(req.body.state)

   if (!(req.body.id in data)){
      data[req.body.id] = get_base_struct()
   }

   if(req.body.state){
      node = data[req.body.id]
      node["lights"] = req.body.state
   }

   //res.status(200).send("set lights for " + req.params.id + " " + req.params.state);
   console.log(node)
   res.json(node)
});

app.get( '/lights', function (req, res){
   console.log("Getting Light state for " + req.body.id)
   state = {};
   if ((req.body.id in data)){
      node = data[req.body.id]
      if(node.lights){
         state["state"] = node.lights;
      }
   }
   console.log(state)
   res.json(state)
});

//idRouter.route('/tts')
app.put( '/tts', function (req, res){
   console.log("Setting Time to Sleep state for " + req.body.id + " to " + req.body.value)
   console.log(req.body.id)
   console.log(req.body.value)

   if (!(req.body.id in data)){
      data[req.body.id] = get_base_struct()
   }
   node = data[req.body.id]
   node["tts"] = req.body.value

   //res.status(200).send("set time to sleep for " + req.params.id + " " + req.params.value);
   res.json(node)
})

app.get('/tts', function (req, res){
   console.log("Getting Time to Sleep state for " + req.body.id)
   tts = {};
   if ((req.body.id in data)){
      node = data[req.body.id]
      if(node.tts){
         tts["tts"] = node.tts;
      }
   }
   console.log(tts)
   res.json(tts)
});

app.put( '/reset', function (req, res){
   console.log("Setting Reset state for " + req.body.id + " to " + req.body.value)
   console.log(req.body.id)
   console.log(req.body.value)

   if (!(req.body.id in data)){
      data[req.body.id] = get_base_struct()
   }
   node = data[req.body.id]
   node["reset"] = req.body.value

   //res.status(200).send("set time to sleep for " + req.params.id + " " + req.params.value);
   res.json(node)
})

app.get('/reset', function (req, res){
   console.log("Getting Time to Sleep state for " + req.body.id)
   tts = {};
   if ((req.body.id in data)){
      node = data[req.body.id]
      if(node.state){
         tts["state"] = node.tts;
      }
   }
   console.log(tts)
   res.json(tts)
});


//idRouter.route('/status')
app.get('/status', function (req, res){
   //res.status(200).send('hello id ' + req.params.id);
   node = {}
   if (req.body.id in data){
      node = data[req.body.id] 
      console.log(node)
      //rc = node
   } else {
      data[req.params.id] = {}
   }
   res.json(node)

   //Reset to false after called once
   data[req.params.id]['reset'] = "false"; 
   data[req.params.id]['discovery'] = "false"; 
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
//      node = data[req.params.id]
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


app.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})
