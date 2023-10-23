const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/authenticate');
const surveyController = require('../controllers/survey.controller');

const router = express.Router();

//Registro de usuario
router.post('/signup', userController.signUp);
//Inicio de sesión
router.post('/signin', userController.signIn);
//Obtener un usuario
router.get('/user', authenticate(), userController.getUser);
//Obtener todos los usuarios
router.get('/users', authenticate(), userController.getAllUsers);
//Crear encuestas
router.post('/surveys', authenticate(), surveyController.createSurvey);
//Crear preguntas
router.post('/surveys/questions/:id', authenticate(), surveyController.createQuestion);
//Obtener encuestas
router.get('/surveys', authenticate(), surveyController.getSurveys);
//Obtener encuesta por Id
router.get('/surveys/:id', authenticate(), surveyController.getSurveyById);
//Actualizar encuesta
router.put('/surveys/:id', authenticate(), surveyController.updateSurvey);
//Actualiar pregunta
router.put('/questions/:id', authenticate(), surveyController.updateQuestion);
//Eliminar encuestas
router.delete('/surveys/:id', authenticate(), surveyController.deleteSurvey);
//Eliminar pregunta
router.delete('/questions/:id', authenticate(), surveyController.deleteQuestion);
//Obtener encuestas para formulario
router.get('/form/:id', authenticate(false), surveyController.getSurveyById);
//Guardar respuestas de los usuarios
router.post('/form', authenticate(false), surveyController.saveAnswers);


module.exports = router;

