#!/bin/sh
java -jar jsrun.jar app/run.js -a -t=templates/tangram/ -d=../../www/js ../../source/src/tangram-base.js
java -jar jsrun.jar app/run.js -a -t=templates/tangram/ -d=../../www/js ../../source/src/tangram-component.js
