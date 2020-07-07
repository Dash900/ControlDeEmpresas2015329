'use strict'

var express = require("express")
var EmpresaController = require("../controllers/empresaController")
var md_auth = require("../middlewares/authenticated")

//SUBIR IMAGEN
var multiparty = require('connect-multiparty')

//RUTAS
var api = express.Router()
api.post('/crear-empresa', EmpresaController.crearEmpresa);
api.put('/editar', md_auth.ensureAuth,EmpresaController.editarEmpresa)
api.delete('/borrar/:idEmpresa', md_auth.ensureAuth, EmpresaController.eliminarEmpresa)
api.get('/mostrar-idEmpresa/:idEmpresa',  md_auth.ensureAuth, EmpresaController.mostrarEmpresaId)
api.get('/mostrar-nombreEmpresa/:nombreEmpresa', md_auth.ensureAuth, EmpresaController.mostrarEmpresaNombre)
api.get('/mostrar-todas', md_auth.ensureAuth,  EmpresaController.mostrarTodos)
api.post('/login', EmpresaController.loginEmpresa)


module.exports = api;