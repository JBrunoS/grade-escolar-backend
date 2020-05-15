const express = require('express')

const ProfessorController = require('./controllers/professorController')
const EscolaController = require('./controllers/escolaController')
const NiveisController = require('./controllers/nivelController')
const TurnosController = require('./controllers/turnoController')
const DisciplinasController = require('./controllers/disciplinaController')
const TurmasController = require('./controllers/turmaController')
const GradeController = require('./controllers/gradeController')
const DisponibilidadeController = require('./controllers/disponibilidadeController')
const DetailsController = require('./controllers/detailsController')
const RecuperaSenha = require('./mail/recuperaSenha')

const routes = express.Router()


routes.post('/recupera', RecuperaSenha.index)

routes.get('/grade', GradeController.index)
routes.get('/grade/professor/:id', GradeController.getHoraProfessor)
routes.get('/grade/nivel/:nivel_id/turma/:turma_id/turno/:turno_id', GradeController.filtred)
routes.post('/grade', GradeController.create)
routes.delete('/grade/:id', GradeController.delete)

routes.get('/turmas', TurmasController.index)
routes.get('/turmas/count', TurmasController.count)
routes.post('/turmas', TurmasController.create)
routes.get('/turmas/nivel/:id', TurmasController.getTurmaByNivel)
routes.get('/turmas/turno/:id', TurmasController.getTurmaByTurno)
routes.get('/turmas/:nivel/:turno', TurmasController.getTurmaByNivelTurno)
routes.delete('/turmas/:id', TurmasController.delete)
routes.put('/turmas/edit/:id', TurmasController.put)

routes.get('/escola', EscolaController.index);
routes.post('/escola', EscolaController.getByEmail);
routes.post('/new/escola', EscolaController.create);


routes.get('/niveis', NiveisController.index)
routes.get('/niveis/count', NiveisController.count)
routes.post('/niveis', NiveisController.create)
routes.put('/niveis/:id', NiveisController.put)
routes.get('/niveis/:id', NiveisController.filterProfessor)

routes.get('/turnos', TurnosController.index)
routes.post('/turnos', TurnosController.create)
routes.get('/turnos/turma/:id', TurnosController.getByTurma)
routes.get('/turnos/:id', TurnosController.filterByProfessor)
routes.get('/turnos/disciplinas/:id', TurnosController.filterByDisciplina)
routes.put('/turno/:id', TurnosController.put)

routes.get('/disciplinas', DisciplinasController.index)
routes.get('/disciplinas/count', DisciplinasController.count)
routes.get('/disciplinas/name', DisciplinasController.getDisciplinaByName)
routes.post('/disciplinas', DisciplinasController.create)
routes.get('/disciplinas/nivel/:id', DisciplinasController.getDisciplinaByNivel)
routes.get('/disciplinas/turma/:id', DisciplinasController.filterByTurma)
routes.get('/disciplinas/:id', DisciplinasController.filterByProfessor)
routes.put('/disciplinas/:id', DisciplinasController.put)
routes.delete('/disciplinas/:id', DisciplinasController.delete)

routes.get('/professor', ProfessorController.index);
routes.get('/professor/count', ProfessorController.count);
routes.post('/login', ProfessorController.getByEmail);
routes.post('/professor', ProfessorController.create);
routes.delete('/professor/:id', ProfessorController.delete)
routes.put('/professor/:id', ProfessorController.put)
routes.get('/professor/inatives', ProfessorController.getProfessorInative)
routes.get('/professor/disciplina/nivel/:id', ProfessorController.getProfessorByNivel)
routes.get('/professor/disciplina/:id', ProfessorController.getProfessorByDisciplina)

routes.get('/disponibilidade/:id', ProfessorController.getProfessorByDay)
routes.get('/disponibilidade', DisponibilidadeController.index)

routes.get('/details/disciplina/:id', DetailsController.disciplinas)
routes.get('/details/professor/:id', DetailsController.professores)

module.exports = routes;