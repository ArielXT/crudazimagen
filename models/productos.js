const mongoose = require('mongoose');
const productoSchema = new mongoose.Schema({
    producto:{
        type: String,
        required: true,
    },
    marca:{
        type: String,
        required: true,
    },
    tipo:{
        type: String,
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    precio:{
        type: Number,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    date:{
        type:Date,
        required: true,
        default:Date.now,
    },
});
module.exports = mongoose.model('productos', productoSchema);