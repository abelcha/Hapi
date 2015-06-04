#!/bin/bash
counter=$1
while [ $counter -gt 0 ]
do
	curl "http://127.0.0.1:8080/api/intervention/18200?x=sd"
	let counter-=1
done