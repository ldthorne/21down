var express = require('express');
var router = express.Router();
var models = require('../models');
var Place = models.Place;
var User = models.User;
var path = require('path');
module.exports = router;

function findOrCreate(model, properties) {
    return model.findOne({googleId: properties.googleId}).exec().then(function(instance) {
        if (instance){
            return instance; // --> promise for found instance  
        } 
        else{
            return model.create(properties); // --> promise for created instance
        }
    });
}

router.get("/", function(req, res, next) {
    res.render("index")
});
router.get("/getIp", function(req,res,next){
    res.send(req.ip)
})
router.get("/addReview", function(req,res,next){
    res.render("addReview")
})

router.post("/add", function(req, res, next) {
    var placesStr = req.body.places;
    var places = JSON.parse(placesStr)
    var allPlaces = [];
    places.forEach(function(place) {
        if (!place.rating) {
            place.rating = []
        }
        var placeProps = {
            name: place.name,
            geometry: place.geometry,
            googleId: place.googleId,
            placeId: place.placeId,
            location: place.location,
            googleRating: place.googleRating,
            priceLevel: place.priceLevel,
            rating: place.rating
        }
        allPlaces.push(placeProps)
    });

    var allPlacesAdded = [];

    allPlaces.forEach(function(place) {
        findOrCreate(Place, place)
            .then(function(placeAdded) {
                allPlacesAdded.push(placeAdded);
                if(allPlacesAdded.length === allPlaces.length){
                    res.send(allPlacesAdded)
                }
            })
            .then(null, next)
    })
})
