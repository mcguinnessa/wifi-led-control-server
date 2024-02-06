#!/usr/bin/python

import getopt, sys
import requests

#/db5/lights/on
#/db5/lights/off
#/db5/status/lights
#/db5/status/vcc
#/db5/admin/reset

def usage():
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-l light_state]")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [--reset]")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [--discovery]")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-t time_to_sleep] ")
   print(sys.argv[0] + " [-i id] [-h host] [-p port] [-s lights|reset|tts|vcc|all]")

end_point = None
routing_prefix = ""
host = None
port = None
id = ""
command = None

try:
   opts, args = getopt.getopt(sys.argv[1:], "?l:h:p:s:i:t:r:", ["help", "lights=", "host=", "port=", "routing-prefix=", "reset", "discovery", "status=", "id=", "tts="])

   for o, a in opts:
      if o in ("-l", "--lights="):
         end_point = "/lights/" + a
         command = "PUT"
      elif o in ("-s", "--status="):
         if "all" == a:
            end_point = "/status"
         else:
            end_point = "/status/" + a
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
         end_point = "/tts/" + a
      elif o in ("--reset"):
         command = "PUT"
         end_point = "/admin/reset"
      elif o in ("--discovery"):
         command = "PUT"
         end_point = "/admin/send-discovery"
      else:
         print("o=" + str(o) + " a=" + str(a))
         assert False, "unhandled option"

except getopt.GetoptError as err:
   # print help information and exit:
   print(err)  # will print something like "option -a not recognized"
   usage()
#   sys.exit(2)

#reset = False
#status = None

if not end_point or not id or not host or not port:
   usage()
   sys.exit()


import http.client

headers = {}

try:

#   url = "http://" + host +":"+ str(port)
#   if reset: 
#      end_point = "/admin/reset" 
#   else:
#      end_point = "/"+command+"/" + status

   url = "http://" + host +":"+ str(port) + "/" + routing_prefix + "/" + id + end_point
   print(command + " URL:" + url)

   if command == "GET":
      r = requests.get(url )
   elif command == "PUT":
      r = requests.put(url )

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

