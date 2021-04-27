.PHONY: install clean all run

all: public/build/Graphics.js public/build/GraphicsTest.js

run: all
	npm test

install:
	npm install

public/build/GraphicsTest.js: public/build/Graphics.js javascript/Driver.js
	mkdir -p $(@D)
	cat $^ > $@

public/build/Graphics.js: public/lib/pixi.js javascript/GraphicsCore.js build/AllEntities.js
	mkdir -p $(@D)
	cat $^ > $@

entity_files = javascript/entities/*

build/AllEntities.js: javascript/Entities.js $(entity_files)
	mkdir -p $(@D)
	cat $^ > $@

clean:
	rm build/*
	rm public/build/*
