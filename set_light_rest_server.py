#!/usr/bin/python

import getopt, sys
import requests



#/db5/lights/on
#/db5/lights/off
#/db5/status/lights
#/db5/status/vcc
#/db5/admin/reset

def usage():
   print(sys.argv[0] + "  [-l light_state] [-h host] [--reset] [-s lights|vcc]")

end_point = None
host = "192.168.0.124"
port = 3000
id = ""
command = None


try:
   opts, args = getopt.getopt(sys.argv[1:], "?l:h:p:s:i:", ["help", "lights=", "host=", "port=", "reset", "status=", "id="])

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
      elif o in ("--reset"):
         command = "PUT"
         end_point = "/admin/reset"
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

if not end_point or not id:
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

   url = "http://" + host +":"+ str(port) + "/" + id + end_point
   print(command + " URL:" + url)

   if command == "GET":
      r = requests.get(url )
   elif command == "PUT":
      r = requests.put(url )

   data = r.json()
   print(data)
except requests.exceptions.ConnectionError as e:
   print("Unable to connect to " + str(url))
except Exception as e:
   print("Exception thrown:" + str(e))
   import traceback
   print(traceback.format_exc())
   usage()
   sys.exit(2)

   


