import fileinput
from dateutil.parser import parse


for line in fileinput.input():
	x = line.split(' ')
	date = ("{:%d/%m - %H:%M:%S}".format(parse(x[0])))
	# if (len(x) > 1):
	# 	method = (x[3].split('=')[1])
	# 	path = (x[4].split('=')[1])
	# 	print(date, method, path)
	# else:
	print(date, x[:1])