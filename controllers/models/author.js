const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AuthorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: false
    }
},{
    strict: true,
    versionKey: false
});

module.exports = mongoose.models['author'] || mongoose.model('author', AuthorSchema);