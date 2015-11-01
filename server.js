// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Drink = require('./models/drink');

// Conncet to the drinklocker MongoDB
mongoose.connect('mongodb://localhost:27017/drinklocker');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
    res.json({message: 'You are running dangerously low on drinks! Really!!'});
});

// Create a new route with the prefix /drinks
var drinksRoute = router.route('/drinks');

// Create endpoint /api/drinks for POSTS
drinksRoute.post(function(req, res) {
    // Create a new instance of the Drink model
    var drink = new Drink();
    
    //Set the beer Properties that came from the POST data
    drink.name = req.body.name;
    drink.type = req.body.type;
    drink.quantity = req.body.quantity;
    
    //Save the beer and check for errors
    drink.save(function(err) {
        if(err)
            res.send(err);
        
        res.json({message: 'Drink added to the locker!', data: drink});
    });
});

// Create endpoint /api/drinks for GET
drinksRoute.get(function(req, res) {
    // Use the Drink model to find all beer
    Drink.find(function(err, drinks) {
        if(err)
            res.send(err);
        
        res.json(drinks);
    });
});

// Create a new route with the /drinks/:drink_id prefix
var drinkRoute = router.route('/drinks/:drink_id');

// Create endpoint /api/drinks/:drink_id for GET
drinkRoute.get(function(req, res) {
    // Use the drink model to find a specific drink
    Drink.findById(req.params.drink_id, function(err, drink) {
        if(err)
            res.send(err);
        
        res.json(drink);
    });
});

// Create endpoint /api/drinks/:drink_id for PUT
drinkRoute.put(function(req, res) {
    // Use the Drink model to find a specific drink
    Drink.findById(req.params.drink_id, function(err, drink) {
        if(err)
            res.send(err);
        
        // Update the existing drink quantity
        drink.quantity = req.body.quantity;
        
        // Save the drink and check for errors
        drink.save(function(err) {
            if(err)
                res.send(err)
                
            res.json(drink);
        });
    });
});

// Create endpoint /api/drinks/:drink_id for DELETE
drinkRoute.delete(function(req, res) {
    // Use the Drink model to find a specific Drink and remove it
    Drink.findByIdAndRemove(req.params.drink_id, function(err) {
        if(err)
            res.send(err);
        
        res.json({message: 'Drink removed from the locker!'});
    });
});



// Register all our routes with /api
app.use('/api', router);

//Start the server
app.listen(port);
console.log('Insert Drink on port ' + port);