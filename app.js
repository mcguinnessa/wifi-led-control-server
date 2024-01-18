const http = require('http');
var fs = require('fs');

//const hostname = '127.0.0.1';
const hostname = '192.168.0.124';
const port = 3000;


led_state = {
   lights: "off",
   reset: "false"
}

const server = http.createServer((req, res) => {


  res.setHeader('Content-Type', 'text/plain');
  if( req.method === 'GET') {
     if (req.url === '/') {
        res.end('<h1>Hello World</h1>');
     }else if (req.url === '/admin/vcc') {
        res.end('<h1>VCC Status</h1>');
     }else if (req.url === '/db5/light/status') {
        console.log("REQ:"+JSON.stringify(led_state))
        res.end(JSON.stringify(led_state));
     } else{
        res.end("Doh");
     }
  
  } else if( req.method === 'PUT') {
     if (req.url === '/db5/light/off') {
        led_state["lights"] = "off";
     }else if (req.url === '/db5/light/on') {
        led_state["lights"] = "on";
     } else {
        res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
     }
     console.log(JSON.stringify(led_state))
     //res.end("<h1>Light Status</h1>\n<lights>"+led_state+"</lights>");
     res.end(JSON.stringify(led_state));
  }

//  res.statusCode = 200;
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
