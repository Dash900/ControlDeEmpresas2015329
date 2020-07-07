'user strict'

//IMPORTS
var Empresa = require('../models/empresa')
var Sucursal = require('../models/sucursal')
var bcrypt = require("bcrypt-nodejs")
var jwt = require("../services/jwt")

function crearEmpresa(req, res) {
    var empresa = new Empresa();
    var params = req.body;

    if(params.nombre && params.password){
        empresa.nombre = params.nombre;
        empresa.email = params.email;
        empresa.rol = 'ROL_EMPRESA';

        Empresa.find(
            { email: empresa.nombre }
        ).exec((err, empresas) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' })
            if (empresas && empresas.length >= 1) {
                return res.status(500).send({ message: 'La empresa ya existe' })
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    empresa.password = hash
                    empresa.save((err, empresaGuardada) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar' })
                        if (empresaGuardada) {
                            return res.status(200).send({ empresa: empresaGuardada })
                        } else {
                            res.status(404).send({ message: 'No se ha podido registrar' })
                        }
                    })
                })
            }
        })
    } else {
        res.status(200).send({ message: "Rellene los datos necesarios" })
    }
}

function eliminarEmpresa(req, res){
    var empresaId = req.params.idEmpresa;


        if(empresaId != req.user.sub){
            return res.status(500).send({message: 'No tiene los permisos para actualizar esta empresa'})
        }

        Empresa.findByIdAndDelete(empresaId,(err, eliminarEmpresa)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!eliminarEmpresa) return res.status(404).send({ message: 'No se a podido eliminar la Empresa'})

            return res.status(200).send( { empresa: eliminarEmpresa})
        })

}

function editarEmpresa(req, res){
    var empresaId = req.params.idEmpresa;
    var params = req.body

    delete params.password
    delete params.numeroSucursales

        if(empresaId != req.user.sub){
            return res.status(500).send({message: 'No tiene los permisos para actualizar esta empresa'})
        }

        Empresa.findByIdAndUpdate(empresaId, params, { new: true }, (err, empresaActualizada)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion' })
            if(!empresaActualizada) return res.status(404).send({ message: 'No se a podido actualizar los datos de la Empresa'})

            return res.status(200).send({ empresa: empresaActualizada })

        })
}

function mostrarEmpresaId(req, res){
    var empresaId = req.params.idEmpresa;

    Empresa.findById(empresaId,(err, verEmpresa)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verEmpresa) return res.status(404).send({ message: 'No se a podido mostrar la Empresa'})

            return res.status(200).send({ empresa: verEmpresa})
        }).populate('producto')
}

function mostrarEmpresaNombre(req, res){
    var empresaNombre = req.params.nombreEmpresa;

        Empresa.find({nombre:{$regex: empresaNombre}},(err, verEmpresaN)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion'})
            if(!verEmpresaN) return res.status(404).send({ message: 'No se a podido mostrar el Nombre de la empresa'})

            return res.status(200).send({ empresa: verEmpresaN})
        })
}

function mostrarTodos(req, res){

    Empresa.find((err, verTodos)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion'})
        if(!verTodos) return res.status(404).send({ message: 'No se a podido mostrar todas las Empresas'})

        return res.status(200).send( { empresas: verTodos})
    })
}

function loginEmpresa(req, res){
    var params = req.body;

    Empresa.findOne({ email: params.email }, (err, empresa) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (empresa) {
            bcrypt.compare(params.password, empresa.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({ token: jwt.createToken(empresa) })
                    } else {
                        empresa.password = undefined
                        return res.status(200).send({ empresa: empresa })
                    }
                } else {
                    return res.status(404).send({ message: 'No se ha podido identificar la empresa' })
                }
            })
        } else {
            return res.status(404).send({ message: 'No ha podido ingresar' })
        }
    })
}



module.exports={
    crearEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    mostrarEmpresaId,
    mostrarEmpresaNombre,
    mostrarTodos,
    loginEmpresa
}