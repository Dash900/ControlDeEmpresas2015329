'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var SucursalSchema = Schema({
    nombre: String,
    empresa: {type: Schema.ObjectId, ref: 'empresa'},
    numeroEmpleados: Number,
    productos: [{
        nombreProducto: String,
        cantidad: Number
    }],
    empleado:[{
        nombre: String,
        departamento: String,
        puesto: String
    }]
})

module.exports = mongoose.model('sucursal', SucursalSchema)