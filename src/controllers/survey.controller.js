const Survey = require('../models/survey');
const Question = require('../models/question');

const createSurvey = async (req, res) => {
    const { title, description } = req.body;

    if (!!!title || !!!description) {
        res.status(400).json({
            message: 'Todos los campos son requeridos'
        });

        return;
    }

    try {

        const survey = Survey({ title, description, idUser: req.user.id })
        const newSurvey = await survey.save();
        res.status(200).json(newSurvey);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error al crear la encuesta'
        })
    }
}

const createQuestion = async (req, res) => {
    const { typeQuestion, question, answers } = req.body;

    if (!!!typeQuestion || !!!question || !!!answers) {
        res.status(400).json({
            message: 'Todos los campos son requeridos'
        });

        return;
    }

    try {

        const survey = await Survey.findById({ _id: req.params.id })
        if(!survey) {
            return res.status(404).json({
                message: 'Encuesta no encontrada'
            })
        }

        const newQuestion = Question({ typeQuestion, question, answers, idUser: req.user.id, idSurvey: req.params.id })
        const questionSaved = await newQuestion.save();

        const updatedSurvey = await Survey.findByIdAndUpdate(
            req.params.id, 
            { $push: { questions: questionSaved._id } }, 
            { new: true })

        res.status(200).json(updatedSurvey);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error al crear la pregunta'
        });
    }

}

const getSurveys = async (req, res) => {

    const surveys = await Survey.find({ idUser: req.user.id }).populate('questions')
    if (surveys) {
        res.status(200).json(surveys)
    } else {
        res.status(404).json({
            message: 'Encuestas no encontradas'
        });
    }

}

const getSurveyById = async (req, res) => {

    const survey = await Survey.findById({ _id: req.params.id }).populate('questions');
    if (survey) {
        console.log(survey)
        res.status(200).json(survey)
    } else {
        res.status(404).json({
            message: 'Encuesta no encontrada'
        });
    }
}

const updateSurvey = async (req, res) => {

    const { id } = req.params;
    const { title, description } = req.body;
    
    try {
        
        const surveyUpdated = await Survey.findByIdAndUpdate(id, { title, description }, {new: true})
        res.status(200).json(surveyUpdated)

    } catch (error) {
        res.status(500).json('Error al actualizar la encuesta')
    }

}

const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { question, answers } = req.body;

    try {

        const questionUpdated = await Question.findByIdAndUpdate( id, {question, answers}, {new: true})
        res.status(200).json(questionUpdated)
        
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la pregunta'
        });
    }
    
}

const deleteSurvey = async (req, res) => {

    const { id } = req.params;  

    try {

        const deleteSurvey = await Survey.findByIdAndDelete(id);

        if(!deleteSurvey) {
            return res.status(404).json({
                message: 'Encuesta no encontrada'
            })
        }

        const deleteQuestion =  await Question.deleteMany({idSurvey: id})
        if(!deleteQuestion) {
            return res.status(404).json({
                message: 'Preguntas no encontradas'
            })
        }

        res.status(200).json({
            message: 'Encuesta eliminada'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error al eliminar la encuesta'
        })
    }

}

module.exports = { createSurvey, createQuestion, getSurveyById, getSurveys, updateSurvey, updateQuestion, deleteSurvey }