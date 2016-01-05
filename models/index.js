var mongoose = require('mongoose');
mongoose.connect('mongodb://ldthorne:testtest123@ds039155.mongolab.com:39155/under21');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '));

var placeSchema = new mongoose.Schema({
	name: {type: String, required: true},
	googleId: {type: String, required: true},
	placeId: {type: String, required: true},
	location: {type: String, required: true},
	googleRating: {type: Number},
	priceLevel: {type: Number},
	rating: [{type: Number}],
	geometry: {type: Object}
});

var userSchema = new mongoose.Schema({
	name: {type: String},
	email: {type: String, required: true},
	password: {type: String, required: true},
	reviews: [{type: Object, required: true, default:[]}]
});

var Place = mongoose.model('Place', placeSchema);
var User = mongoose.model('User', userSchema);


module.exports = {
	Place: Place,
	User: User
}