const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligartorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo debe ser unico'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img:{
        type: String
    },
    rol:{
        type: String,
        required: true
        //enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },

});

UsuarioSchema.methods.toJSON = function(){
    //quito la version --v y el password. Los demas parametros quedan en usuario
    const {__v, password, ...usuario} = this.toObject();
    return usuario;
}
module.exports = model('Usuario', UsuarioSchema);

