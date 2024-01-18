#!/usr/bin/python

import getopt, sys
import requests

def usage():
   print(sys.argv[0] + " [-v] [-l light_state] [-h host]")

try:
   opts, args = getopt.getopt(sys.argv[1:], "?l:vh:", ["help", "lights=", "host="])
except getopt.GetoptError as err:
   # print help information and exit:
   print(err)  # will print something like "option -a not recognized"
   usage()
#   sys.exit(2)

status = None
command = None
host = "192.168.0.124"
port = 3000
for o, a in opts:
   if o in ("-l", "--lights="):
      command = "db5/light"
      status = a
   elif o in ("-v", "--vcc="):
      command = "admin"
      status = "vcc"
   elif o in ("-h", "--host="):
      host = a
   else:
      print("o=" + str(o) + " a=" + str(a))
      assert False, "unhandled option"

if not command or not status:
   usage()
   sys.exit()



import http.client


headers = {}

end_point = "/"+command+"/" + status
url = "http://" + host +":"+ str(port) + end_point

print("URL:" + url)

try:

   if status in ["on", "off"]:
      r = requests.put(url )
   else:
      r = requests.get(url )

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

   


