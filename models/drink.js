// Load required packages
var mongoose = require('mongoose');

// Define our drink schema
var DrinkSchema = new mongoose.Schema({
    name: String,
    type: String,
    quantity: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Drink', DrinkSchema);