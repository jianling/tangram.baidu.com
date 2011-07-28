#!/bin/bash
ant -f export.xml
mv src/ui_release_src_only.js src/tangram-component.js
mv src/ui_release_src.js src/tangram-base.js
