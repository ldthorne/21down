var express = require("express");
var app = express();
var swig = require("swig")
var bodyParser = require('body-parser');
var path = require("path");
var morgan = require("morgan")
var port = 3000;
var home = require("./routes/index.js")

app.listen(port, function(){
	console.log("listening at port "+ port)
})


//swig stuff--------------------------------------
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({ cache: false });
//------------------------------------------------

app.use(morgan('dev'));

// statically serve front-end dependencies
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

// serve any other static files
app.use(express.static(__dirname + '/public'));

// app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/",home);

