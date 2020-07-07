'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta_IN6BM'

exports.createToken = (empresa) => {
    var payload = {
        sub: empresa._id,
        nombre: empresa.nombre,
        email: empresa.email,
        numeroSucursales: empresa.numeroSucursales,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }

    return jwt.encode(payload, secret)
}