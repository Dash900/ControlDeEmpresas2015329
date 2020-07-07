'use strict'

var express = require ("express")
var ProductoController = require("../controllers/productoController")
var md_auth = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();
api.post('/agregar-producto/:idEmpresa', md_auth.ensureAuth, ProductoController.agregarProducto)
api.put('/editar-producto/:idEmpresa/:idProducto', md_auth.ensureAuth, ProductoController.editarProducto)
api.delete('/eliminar-producto/:idEmpresa/:idProducto', md_auth.ensureAuth, ProductoController.eliminarProducto)
api.put('/producto-sucursal/:idEmpresa/:idProducto/:idSucursal', md_auth.ensureAuth, ProductoController.productoSucursal)
api.get('/ver-productosEmpresa/:idEmpresa', md_auth.ensureAuth, ProductoController.verProductosEmpresa)
api.get('/ver-productosSucursal/:idSucursal/:idEmpresa', md_auth.ensureAuth, ProductoController.verProductosSucursal)
api.get('/ver-nombreProductoEmpresa/:idEmpresa', md_auth.ensureAuth, ProductoController.nombreProductoEmpresa)
api.get('/ver-nombreProductoSucursal/:idSucursal', md_auth.ensureAuth, ProductoController.nombreProductoSucursal)
api.get('/stock-empresa/:idEmpresa', md_auth.ensureAuth, ProductoController.stockEmpresa)
api.get('/stock-sucursal/:idSucursal', md_auth.ensureAuth, ProductoController.stockSucursal)

module.exports = api;