var express = require('express');
var app = express();

function isURL(str) {
     var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     var url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
}

var nextid = 0;
var urlmapping = {};

function store(url) {
	var key = nextid.toString();
	urlmapping[key] = url;
	nextid ++;
	return key;
}

function fetch(k) {
	return urlmapping[k];
}

app.get(/new\/(.*)/, function (req, res) {
	var url = req.params[0];
	if (isURL(url)){
		var k = store(url);
		res.send({"original_url": url,"short_url":"https://fcc-shorturl-fingerection.c9users.io/"+k});
	}
	else {
		res.send({"error":"URL invalid"});
	}
});

app.get(/(\d+)/, function(req, res) {
	var key = req.params[0];
	var url = fetch(key);
	res.redirect(url);
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
  console.log('Example app listening on port'+port);
});