.PHONY: install clean all run

all: \
	public/build/Graphics.js \
	public/build/GraphicsTest.js \
	public/build/GraphicsLib.js

run: all
	npm test

install:
	npm install

public/build/GraphicsTest.js: public/build/Graphics.js javascript/Driver.js
	mkdir -p $(@D)
	cat $^ > $@

libraries = \
			public/lib/pixi.js \
			node_modules/@pixi/graphics-extras/dist/browser/graphics-extras.js \
			public/lib/victor/build/victor.js

public/build/GraphicsLib.js: public/build/Graphics.js
	mkdir -p $(@D)
	echo -e 'const GraphicsCore = (function() {\n' > $@
	cat $^ >> $@
	echo -e '\nreturn GraphicsCore;\n}());' >> $@

public/build/Graphics.js: $(libraries) javascript/GraphicsCore.js javascript/Utils.js \
	build/AllEntities.js
	mkdir -p $(@D)
	cat $^ > $@

entity_files = javascript/entities/*

build/AllEntities.js: javascript/Entity.js javascript/CommonEntity.js $(entity_files)
	mkdir -p $(@D)
	cat $^ > $@

clean:
	rm build/*
	rm public/build/*
