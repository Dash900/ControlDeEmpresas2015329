'use strict'

//VARIABLES GLOBALES
const express = require("express")
const app = express()
const bodyParser = require("body-parser")

//CARGA DE RUTAS
var empresa_routes = require("./src/routes/empresaRoutes")
var sucursal_routes = require("./src/routes/sucursalRoutes")
var producto_routes = require("./src/routes/productoRoutes")

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//CABECERAS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Acces-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

//RUTAS 
app.use('/api',empresa_routes, sucursal_routes, producto_routes)

//EXPORTAR
module.exports = app;