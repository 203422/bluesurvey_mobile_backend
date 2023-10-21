const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = Schema({
    idUser: {
        type: String,
        required: true,
    },

    idSurvey: {
        type: Schema.Types.ObjectId,
        ref: 'Survey'
    },

    typeQuestion: {
        type: String,
        enum: ['open', 'singleOption', 'multipleOption']
    },
    question: {
        type: String,
        required: true
    },
    answers: [
        {
            answer: String,
            count: {
                type: Number,
                default: 0,
            }
        }
    ],
})


module.exports = mongoose.model('Question', questionSchema);