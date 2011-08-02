#!/bin/sh
java -jar jsrun.jar app/run.js -a -t=templates/tangram/ -d=../../src/js mycode/empty.js
java -jar jsrun.jar app/run.js -a -t=templates/tangram/ -d=../../src/js mycode/tangram-base.js
java -jar jsrun.jar app/run.js -a -t=templates/tangram/ -d=../../src/js mycode/tangram-component.js
