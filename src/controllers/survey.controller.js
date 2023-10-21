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

    if (!!!typeQuestion || !!!question) {
        res.status(400).json({
            message: 'Todos los campos son requeridos'
        });

        return;
    }

    try {

        const survey = await Survey.findById({ _id: req.params.id })
        if (!survey) {
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

        const surveyUpdated = await Survey.findByIdAndUpdate(id, { title, description }, { new: true })
        res.status(200).json(surveyUpdated)

    } catch (error) {
        res.status(500).json('Error al actualizar la encuesta')
    }

}

const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { question, answers } = req.body;

    try {

        const questionUpdated = await Question.findByIdAndUpdate(id, { question, answers }, { new: true })
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

        if (!deleteSurvey) {
            return res.status(404).json({
                message: 'Encuesta no encontrada'
            })
        }

        const deleteQuestion = await Question.deleteMany({ idSurvey: id })
        if (!deleteQuestion) {
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

const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    const { idSurvey } = req.body;

    try {
        const deleteQuestion = await Question.findByIdAndDelete(id);


        if (!deleteQuestion) {
            return res.status(404).json({
                message: 'Pregunta no encontrada'
            });
        }

        const updatedSurvey = await Survey.findByIdAndUpdate(
            idSurvey,
            { $pull: { questions: id } },
            { new: true }
        );

        res.status(200).json(updatedSurvey);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error al eliminar la pregunta'
        })
    }
}

const saveAnswers = async (req, res) => {

    const { responses } = req.body;
    console.log(responses);

    try {

        for (const openResponse of responses.open) {
            const question = await Question.findById(openResponse.questionId);
            if (question) {
                question.answers.push({ answer: openResponse.answer });
                await question.save();
            }
        }

        // Itera a través de las respuestas de preguntas de opción única y actualiza el modelo correspondiente
        for (const singleOptionResponse of responses.singleOption) {
            const question = await Question.findById(singleOptionResponse.questionId);
            if (question) {
                const answerIndex = question.answers.findIndex((a) => a.answer === singleOptionResponse.answer);
                if (answerIndex !== -1) {
                    question.answers[answerIndex].count += 1;
                    await question.save();
                }
            }
        }

        // Itera a través de las respuestas de preguntas de opción múltiple y actualiza el modelo correspondiente
        for (const multipleOptionResponse of responses.multipleOption) {
            const question = await Question.findById(multipleOptionResponse.questionId);
            if (question) {
                multipleOptionResponse.answers.forEach((selectedAnswer) => {
                    const answerIndex = question.answers.findIndex((a) => a.answer === selectedAnswer);
                    if (answerIndex !== -1) {
                        question.answers[answerIndex].count += 1;
                    }
                });
                await question.save();
            }
        }

        res.status(200).json({
            'message': 'Respuestas guardadas exitosamente'
        })

    } catch (error) {
        res.status(500).json({
            'error': 'Eror al guardar las respuestas'
        });
        console.log(error);
    }

}

module.exports = { createSurvey, createQuestion, getSurveyById, getSurveys, updateSurvey, updateQuestion, deleteSurvey, deleteQuestion, saveAnswers }