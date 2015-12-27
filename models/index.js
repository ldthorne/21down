var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/under21');

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

var Place = mongoose.model('Place', placeSchema);


module.exports = {
	Place: Place
}