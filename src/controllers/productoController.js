'use strict'

var Empresa = require("../models/empresa")
var Sucursal = require("../models/sucursal")

function agregarProducto(req, res) {
    var empresaId = req.params.idEmpresa
    var params = req.body
    var existe = true

    Empresa.findById(empresaId, (err, empresa) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!empresa) return res.status(404).send({ message: "Error al encontrar empresa" })
        if (empresa) {
            for (var i = 0; i < empresa.productos.length; i++) {
                if (!(empresa.productos[i].nombreProducto == params.nombre)) {
                    existe = false
                }
            }
            if (existe == false) {
                Empresa.findOneAndUpdate(empresaId, { $push: { productos: { nombreProducto: params.nombre, cantidad: params.cantidad } } }, { new: true }, (err, empresaActualizada) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion" })
                    if (!empresaActualizada) return res.status(404).send({ message: "Error al guardar producto" })
                    return res.status(200).send({ empresa: empresaActualizada })
                })
            } else {
                return res.status(500).send({ message: "El producto ya existe" })
            }
        }
    })
}

function editarProducto(req, res) {
    var empresaId = req.params.idEmpresa
    var params = req.body
    var productoId = req.params.idProducto
    var productoActualizado = {}
    var nombreProductoEmpresa
    var nombreProductoEmpresa2

    if (params.nombre) {
        productoActualizado["productos.$.nombreProducto"] = params.nombre
    }
    if (params.cantidad) {
        productoActualizado["productos.$.cantidad"] = params.cantidad
    }
    if (Object.keys(productoActualizado).length > 0) {
        Empresa.findById(empresaId, (err, empresaE) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" })
            if (!empresaE) return res.status(404).send({ message: "Error al encontrar empresa" })
            if (empresaE) {
                for (var i = 0; i < empresaE.productos.length; i++) {
                    if (empresaE.productos[i].nombreProducto == params.nombre) {
                        nombreProductoEmpresa = empresaE.productos[i].nombreProducto
                    }
                    if (empresaE.productos[i]._id == productoId) {
                        nombreProductoEmpresa2 = empresaE.productos[i].nombreProducto
                    }
                }
                if (!(nombreProductoEmpresa)) {
                    console.log(nombreProductoEmpresa2)
                    Empresa.findOneAndUpdate({ _id: empresaId, "productos._id": productoId }, productoActualizado, { new: true }, (err, productoActualizado) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion" })
                        if (!productoActualizado) return res.status(404).send({ message: "Error al editar producto" })
                        if (productoActualizado) {
                            Sucursal.update({ empresa: empresaId, "productos.nombreProducto": nombreProductoEmpresa2 }, { "productos.$.nombreProducto": params.nombre }, { new: true }, (err, sucursalActualizada) => {
                                if (err) return res.status(500).send({ message: 'error en la peticion' })
                                if (!sucursalActualizada) return res.status(404).send({ message: 'No se pudo actualizar la sucursal' })
                                return res.status(200).send({ empresa: productoActualizado })
                            })
                        }
                    })
                } else {
                    return res.status(500).send({ message: "Ya existe un producto con este nombre" })
                }
            }
        })
    } else {
        return res.status(400).send({ message: "Rellene los campos necesarios" })
    }
}
    
function eliminarProducto(req, res) {
    var empresaId = req.params.idEmpresa
    var productoId = req.params.idProducto

    Empresa.update({ _id: empresaId }, { $pull: { productos: { _id: productoId } } }, (err, productoEliminado) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!productoEliminado) return res.status(404).send({ message: "Error al eliminar producto" })
        return res.status(200).send({ message: "Producto eliminado con exito" })
    })
}

function productoSucursal(req, res) {
    var productoId = req.params.idProducto
    var sucursalId = req.params.idSucursal
    var empresaId = req.params.idEmpresa
    var params = req.body
    var productEmpresaId
    var cantidadEmpresa
    var nombreProductoEmpresa
    var asignar = true

    if (params.cantidad) {
        Empresa.findById(empresaId, (err, empresaE) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" })
            if (!empresaE) return res.status(404).send({ message: "Error al encontrar empresa" })
            if (empresaE) {
                for (var i = 0; i < empresaE.productos.length; i++) {
                    if (empresaE.productos[i]._id == productoId) {
                        productEmpresaId = empresaE.productos[i]._id
                        cantidadEmpresa = empresaE.productos[i].cantidad
                        nombreProductoEmpresa = empresaE.productos[i].nombreProducto
                    }
                }
                if (cantidadEmpresa == 0 || cantidadEmpresa < params.cantidad) {
                    return res.status(500).send({ message: "No se puede realizar esta accion, los productos no alcanzan" })
                } else if (cantidadEmpresa >= params.cantidad) {

                    Sucursal.findById(sucursalId, (err, sucursa) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion" })
                        if (!sucursa) return res.status(404).send({ message: "Error al encontrar sucursal" })
                        if (sucursa) {
                            for (var i = 0; i < sucursa.productos.length; i++) {
                                if (sucursa.productos[i].nombreProducto == nombreProductoEmpresa) {
                                    asignar = false
                                }
                            }
                            if (asignar == true) {
                                Sucursal.findOneAndUpdate({ "_id": sucursalId }, { $push: { productos: { nombreProducto: nombreProductoEmpresa, cantidad: params.cantidad } } }, { new: true }, (err, sucursalActualizada) => {
                                    if (err) return res.status(500).send({ message: "Error en la peticion" })
                                    if (!sucursalActualizada) return res.status(404).send({ message: "Error al guardar producto" })
                                    Empresa.findOneAndUpdate({ _id: empresaId, "productos._id": productEmpresaId }, { $inc: { "productos.$.cantidad": params.cantidad * -1 } }, { new: true }, (err, productoActualizado) => {
                                        if (err) return res.status(500).send({ message: "Error en la peticion" })
                                        if (!productoActualizado) return res.status(404).send({ message: "Error al editar producto" })
                                        return res.status(200).send({ sucursal: sucursalActualizada })
                                    })
                                })
                            } else {
                                return res.status(500).send({ message: "Este producto ya existe" })
                            }
                        }
                    })
                }
            }
        })
    }
}

function verProductosEmpresa(req, res) {
    var empresaId = req.params.idEmpresa

    Empresa.findById(empresaId, (err, empresaE) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!empresaE) return res.status(404).send({ message: "Error al encontrar empresa" })
        return res.status(200).send({ productos: empresaE.productos })
    })
}

function verProductosSucursal(req, res) {
    var sucursalId = req.params.idSucursal
    var empresaId = req.params.idEmpresa

    Sucursal.findOne({ "_id": sucursalId, empresa: empresaId }, (err, sucursalActualizada) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!sucursalActualizada) return res.status(404).send({ message: "Error al mostrar productos" })
        return res.status(200).send({ productos: sucursalActualizada.productos })
    })
}

function nombreProductoEmpresa(req, res) {
    var empresaId = req.params.idEmpresa
    var params = req.body
    var acum = []

    Empresa.findById(empresaId, (err, empresaE) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!empresaE) return res.status(404).send({ message: "Error al encontrar empresa" })
        if (empresaE) {
            for (var i = 0; i < empresaE.productos.length; i++) {
                if (empresaE.productos[i].nombreProducto == params.nombre) {
                    acum.push(empresaE.productos[i])
                }
            }
            return res.status(200).send({ productos: acum })
        }
    })
}

function nombreProductoSucursal(req, res) {
    var sucursalId = req.params.idSucursal
    var params = req.body
    var acum = []

    Sucursal.findById(sucursalId, (err, sucursalEncontrada) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!sucursalEncontrada) return res.status(404).send({ message: "Error al encontrar sucursal" })
        if (sucursalEncontrada) {
            for (var i = 0; i < sucursalEncontrada.productos.length; i++) {
                if (sucursalEncontrada.productos[i].nombreProducto == params.nombre) {
                    acum.push(sucursalEncontrada.productos[i])
                }
            }
            return res.status(200).send({ productos: acum })
        }
    })
}

function stockEmpresa(req, res) {
    var empresaId = req.params.idEmpresa
    var params = req.body
    var acum = []

    Empresa.findById(empresaId, (err, empresaE) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!empresaE) return res.status(404).send({ message: "Error al encontrar empresa" })
        if (empresaE) {
            for (var i = 0; i < empresaE.productos.length; i++) {
                if (empresaE.productos[i].cantidad == params.cantidad) {
                    acum.push(empresaE.productos[i])
                }
            }
            return res.status(200).send({ productos: acum })
        }
    })
}

function stockSucursal(req, res) {
    var sucursalId = req.params.idSucursal
    var params = req.body
    var acum = []

    Sucursal.findById(sucursalId, (err, sucursalEncontrada) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!sucursalEncontrada) return res.status(404).send({ message: "Error al encontrar sucursal" })
        if (sucursalEncontrada) {
            for (var i = 0; i < sucursalEncontrada.productos.length; i++) {
                if (sucursalEncontrada.productos[i].cantidad == params.cantidad) {
                    acum.push(sucursalEncontrada.productos[i])
                }
            }
            return res.status(200).send({ productos: acum })
        }
    })
}

module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProducto,
    productoSucursal,
    verProductosEmpresa,
    verProductosSucursal,
    nombreProductoEmpresa,
    nombreProductoSucursal,
    stockEmpresa,
    stockSucursal
}