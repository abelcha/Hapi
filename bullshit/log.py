#!/usr/local/bin/python3
from dateutil.parser import parse
import fileinput

for line in fileinput.input():
	x = line.split(' ')
	if (x[0]):
		dt = parse(x[0])
		print('))>', dt)