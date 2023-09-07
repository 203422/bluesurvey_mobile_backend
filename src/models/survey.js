const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const surveySchema = Schema({

    idUser: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]

})

module.exports = mongoose.model('Survey', surveySchema);