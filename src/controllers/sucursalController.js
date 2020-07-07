'user strict'

//IMPORTS
var Sucursal = require('../models/sucursal')
var Empresa = require("../models/empresa")
var jwt = require("../services/jwt")

function crearSucursal(req, res) {
    var sucursal = new Sucursal();
    var params = req.body

    if (params.nombre) {
        sucursal.nombre = params.nombre
        sucursal.empresa = params.empresa

        sucursal.save((err, saveSucursal) => {
            if (err) return res.status(500).send({ message: 'Error' })
            if (!saveSucursal) return res.status(404).send({ message: 'Sucursal no guardada' })
            if (saveSucursal) {
                Empresa.findByIdAndUpdate(params.empresa, { $inc: { numeroSucursales: 1 } }, { new: true }, (err, empresaEditada) => {
                    if (err) return res.status(500).send({ message: 'Error' })
                    if (!empresaEditada) return res.status(404).send({ message: 'Sucursal no guardada' })
                    return res.status(200).send({ sucursal: saveSucursal, numeroSucursales: empresaEditada.numeroSucursales })
                })
            }
        })
    } else {
        res.status().send({ message: 'Rellene todos los datos necesarios' })
    }
}

function asignarEmpleados(req, res) {
    var sucursalId= req.params.idSucursal;
    var rolUsuario = req.user.rol;
    var params = req.body

    if(rolUsuario === "ROL_EMPRESA"){
        Sucursal.findByIdAndUpdate(sucursalId, { $push: {empleado: {nombre: params.nombre, departamento: params.departamento, puesto: params.puesto}} }, {new: true}, (err, asignado)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion de asignacion'})

            if(!asignado) return res.status(404).send({ message: 'Error al asignar el Empleado'})
            return res.status(200).send({ asignado })
        })
    }else{
        if(rolUsuario != 'ROL_EMPRESA'){
        return res.status(500).send({ message: 'Solo la empresa tiene esta funcion'})
        }
    }

}

function editarSucursal(req, res){
    var sucursalId = req.params.idSucursal
    var params = req.body
    var empresa = req.empresa

    Sucursal.find({ empresa: empresa.sub }, (err, sucursal) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!sucursal) return res.status(404).send({ message: "No hay sucursales en la empresa" })
        if (sucursal) {
            Sucursal.findByIdAndUpdate(sucursalId, { nombre: params.nombre }, { new: true }, (err, sucursalEditada) => {
                if (err) return res.status(500).send({ message: 'Error' })
                if (!sucursalEditada) return res.status(404).send({ message: 'sucursal no guardada' })
                return res.status(200).send({ sucursal: sucursalEditada })
            })
        }
    });
}

function eliminarSucursal(req, res){
    var sursalId = req.params.idSucursal
    var empresa = req.empresa


    Sucursal.find({ empresa: empresa.sub }, (err, sucursales) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (!sucursales) return res.status(404).send({ message: "No hay Sucursales en la empresa" })
        if (sucursales) {
            Sucursal.findByIdAndDelete(sursalId, (err, sucursalEliminada) => {
                if (err) return res.status(500).send({ message: 'Error' })
                if (!sucursalEliminada) return res.status(404).send({ message: 'Sucursal no guardada' })
                if (sucursalEliminada) {
                    Empresa.findByIdAndUpdate(empresa.sub, { $inc: { numeroSucursales: -1 } }, { new: true }, (err, empresaEditada) => {
                        if (err) return res.status(500).send({ message: 'Error' })
                        if (!empresaEditada) return res.status(404).send({ message: 'Sucursal no guardada' })
                        return res.status(200).send({ SucursalEliminada: sucursalEliminada, numeroSucursales: empresaEditada.numeroSucursales })
                    })
                }
            })
        }
    });
}

function mostrarSucursalId(req, res){
    var sucursalId = req.params.idSucursal;
        var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_EMPRESA"){
        Sucursal.findById(sucursalId,(err, verSucursal)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verSucursal) return res.status(404).send({ message: 'No se a podido mostrar la Sucursal'})

            return res.status(200).send({ sucursal: verSucursal})
        }).populate('empresa')
    }else{
        if(rolUsuario != 'ROL_EMPRESA'){
        return res.status(500).send({ message: 'Solo la empresa tiene esta funcion'})
        }
    }
}

function mostrarSucursalNombre(req, res){
    var sucursalNombre = req.params.nombreSucursal;
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_EMPRESA"){
        Sucursal.find({nombre:{$regex: sucursalNombre}},(err, verSucursalN)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verSucursalN) return res.status(404).send({ message: 'No se a podido mostrar el Nombre de la sucursal'})

            return res.status(200).send({ sucursal: verSucursalN})
        })
    }else{
        if(rolUsuario != 'ROL_EMPRESA'){
        return res.status(500).send({ message: 'Solo la empresa tiene esta funcion'})
        }
    }
}

function mostrarTodos(req, res){
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_EMPRESA"){
        Sucursal.find((err, verTodos)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verTodos) return res.status(404).send({ message: 'No se a podido mostrar todas las Sucursales'})
    
            return res.status(200).send( { sucursal: verTodos})
        })
    }else{
        if(rolUsuario != 'ROL_EMPRESA'){
        return res.status(500).send({ message: 'Solo la empresa tiene esta funcion'})
        }
    }
}

function listarSucursal(req, res){
    var rolUsuario = req.user.rol;

    if(rolUsuario === "ROL_EMPRESA"){
        Sucursal.find({}, (err, sucursales)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(sucursales){
                res.send({sucursales});
            }else{
                res.send({message: 'Sin registros'});
            }
        }).populate('empresa', 'producto');
    }else{
        if(rolUsuario != 'ROL_EMPRESA'){
        return res.status(500).send({ message: 'Solo la empresa tiene esta funcion'})
        }
    }   
}


module.exports = {
    crearSucursal,
    asignarEmpleados,
    editarSucursal,
    eliminarSucursal,
    mostrarSucursalId,
    mostrarSucursalNombre,
    mostrarTodos,
    listarSucursal
}