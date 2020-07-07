'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var EmpresaSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String,
    numeroSucursales: Number,
    productos: [{
        nombreProducto: String,
        cantidad: Number
    }]
})

module.exports = mongoose.model('empresa', EmpresaSchema)