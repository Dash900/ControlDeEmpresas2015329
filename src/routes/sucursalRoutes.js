'use strict'

var express = require("express")
var SucursalController = require("../controllers/sucursalController")
var md_auth = require("../middlewares/authenticated")


//SUBIR IMAGEN
var multiparty = require('connect-multiparty')

//RUTAS
var api = express.Router()
api.post('/crear-sucursal', md_auth.ensureAuth, SucursalController.crearSucursal);
api.put('/asignar-empleado/:idSucursal', SucursalController.asignarEmpleados)
api.put('/editar-sucursal/:idSucursal', md_auth.ensureAuth, SucursalController.editarSucursal)
api.delete('/eliminar-sucursal/:idSucursal',  md_auth.ensureAuth, SucursalController.eliminarSucursal)
api.get('/mostrar-id/:idSucursal', md_auth.ensureAuth,  SucursalController.mostrarSucursalId)
api.get('/mostrar-nombreS/:nombreSucursal', md_auth.ensureAuth,  SucursalController.mostrarSucursalNombre)
api.get('/mostrar-todasC',  md_auth.ensureAuth, SucursalController.mostrarTodos)
api.get('/listar',  md_auth.ensureAuth, SucursalController.listarSucursal)


module.exports = api;