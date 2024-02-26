#!/usr/bin/python

import getopt, sys
import requests

#/db5/lights
#/db5/status
#/db5/reset
#/db5/send-discovery


LIGHTS = "lights"
RESET = "reset"
TTS = "tts"
DISCOVERY = "discovery"
MODE = "mode"

#elements = ["lights", "reset", "tts", "discovery", "all"]
elements = [LIGHTS, RESET, TTS,  DISCOVERY, MODE, "all"]

def usage():

   el_str = "|".join(elements)
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-r routing_prefix] [-l light_state]")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-r routing_prefix] [--reset]")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-r routing_prefix] [--discovery]")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-r routing_prefix] [-t time_to_sleep] ")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-r routing_prefix] [-m prog|deep]")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-r routing_prefix] [-s "+ el_str+"]")

end_point = None
routing_prefix = None
host = None
port = "80"
id = ""
command = None


try:
   opts, args = getopt.getopt(sys.argv[1:], "?l:h:p:s:i:t:r:m:", ["help", "lights=", "host=", "port=", "routing-prefix=", "reset", "discovery", "status=", "id=", "tts=", "mode="])

   payload = {}
   for o, a in opts:
      if o in ("-l", "--lights="):
         end_point = "/lights"
         command = "PUT"

         if a in ( "on", "ON" , "1"):
            payload = { 'state': 'on' }
         else:
            payload = { 'state': 'off' }

      elif o in ("-s", "--status="):
         if "all" == a:
            end_point = "/status"
         elif LIGHTS == a:
            end_point = "/lights"
         elif TTS == a:
            end_point = "/tts"
         elif DISCOVERY == a:
            end_point = "/send-discovery"
         elif RESET == a:
            end_point = "/reset"
         elif MODE == a:
            end_point = "/mode"
        
         command = "GET"
      elif o in ("-h", "--host="):
         host = a
      elif o in ("-p", "--port="):
         port = a
      elif o in ("-i", "--id="):
         id = a
      elif o in ("-r", "--routing-prefix="):
         routing_prefix = a
      elif o in ("-t", "--tts="):
         command = "PUT"
         end_point = "/tts"
         payload = { 'value': a }
      elif o in ("-m", "--mode="):
         command = "PUT"
         end_point = "/mode"
         payload = { 'mode': a }

      elif o in ("--reset"):
         command = "PUT"
         end_point = "/reset"
         payload = { 'state': 'true' }
      elif o in ("--discovery"):
         command = "PUT"
         end_point = "/send-discovery"
         payload = { 'state': 'true' }
      elif o in ("-?"):
         print("Usage requested")
      else:
         print("o=" + str(o) + " a=" + str(a))
         assert False, "unhandled option"
except getopt.GetoptError as err:
   # print help information and exit:
   print(err)  # will print something like "option -a not recognized"
   usage()
   sys.exit(2)

if not end_point or not id or not host or not port:
   usage()
   sys.exit()


import http.client

headers = {'Content-type': 'application/json'}

try:

   url = "http://" + host +":"+ str(port) + ("/" + routing_prefix if routing_prefix else "") + "/" + id + end_point

   print(command + " URL:" + url)

   if command == "GET":
      r = requests.get(url )
   elif command == "PUT":
      print("payload:" + str(payload))
      r = requests.put(url , json=payload, headers=headers)
#      r = requests.put(url , params=payload, headers=headers)

   data = r.json()
   print(data)
except requests.exceptions.ConnectionError as e:
   print("Unable to connect to " + str(url))
   print("Error:" + str(e))

except requests.exceptions.JSONDecodeError:
   print("Unable to decode JSON response: " + str(r))
   sys.exit(2)
except Exception as e:
   print("Exception thrown:" + str(e))
   import traceback
   print(traceback.format_exc())
   usage()
   sys.exit(2)

