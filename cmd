#!/usr/bin/env python3.5

import requests
import optparse
import time
parser = optparse.OptionParser()

parser.add_option('-l', '--live', action="store_true", dest="live", default=False)
parser.add_option('-s', '--staging', action="store_true", dest="staging", default=False)
parser.add_option('-c', '--cache', action="store_true", dest="cache", default=False)
options, args = parser.parse_args()

#print( 'Query string:', options, args)

if (options.live):
	baseUrl = "http://edison.services/api/"
elif (options.staging):
	baseUrl = "http://edsx-dev.herokuapp.com/api/"
else:
	baseUrl = "http://127.0.0.1:8080/api/"

q = dict()
for i in range(1, len(args)):
	x = (args[i].split("="))
	q[x[0]] = x[1]	
print(args[0], options, q)
if (options.cache):
	q['cache'] = True
q['x'] = "Ie1W4k2iw02029b5CFfwKgPSK3MkFrbq"
q['login'] = "CMD"
ts = time.time()
res = requests.get(baseUrl + args[0], params=q)
print(res,  '<Time [' +str(round(time.time() - ts, 3)) + ']>')
print(res.text)