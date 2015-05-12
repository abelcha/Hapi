#!/bin/bash
counter=$1
while [ $counter -gt 0 ]
do
	curl http://127.0.0.1:5000/jobs&
	let counter-=1
done