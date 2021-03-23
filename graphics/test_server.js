'use strict';
const express = require('express');
const app = express();
const port = 3000;

// host files in /public
app.use('/public', express.static(__dirname + '/public/'));
app.get('/pixi.js.map', (req, res) => {
	res.sendFile(__dirname + '/public/lib/pixi.js.map');
});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
