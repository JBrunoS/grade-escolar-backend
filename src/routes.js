const express = require('express')
const { celebrate, Segments, Joi} = require('celebrate')

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
const ObservacaoProfessorApp = require('./controllers/obsController')
const Message = require('./controllers/messageControler')

const routes = express.Router()

routes.post('/message/:escola_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        escola_id: Joi.number().required(),
    }),
    
}), Message.create)
routes.get('/message/:escola_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        escola_id: Joi.number().required(),
    }),
}), Message.index)
routes.get('/message/professor/:escola_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        escola_id: Joi.number().required(),
    }),
}), Message.getMessageProfessor)

routes.get('/message/aluno/:escola_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        escola_id: Joi.number().required(),
    }),
}), Message.getMessageAluno)

routes.post('/recupera', RecuperaSenha.index)

routes.get('/grade', GradeController.index)
routes.get('/grade/professor/:id', GradeController.getHoraProfessor)
routes.get('/grade/nivel/:nivel_id/turma/:turma_id/turno/:turno_id', GradeController.filtred)
routes.post('/grade', GradeController.create)
routes.delete('/grade/:id', GradeController.delete)
routes.delete('/delete/grade/:escola_id', GradeController.deleteAll)


routes.get('/turmas', TurmasController.index)
routes.get('/turmas/count', TurmasController.count)
routes.post('/turmas', TurmasController.create)
routes.get('/turmas/nivel/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurmasController.getTurmaByNivel)

routes.get('/turmas/turno/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurmasController.getTurmaByTurno)

routes.get('/turmas/:nivel/:turno', TurmasController.getTurmaByNivelTurno)

routes.delete('/turmas/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurmasController.delete)

routes.put('/turmas/edit/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurmasController.put)

routes.get('/escola/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), EscolaController.index);

routes.post('/escola', EscolaController.getByEmail);
routes.post('/new/escola', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        email: Joi.string().required().email(),
        telefone: Joi.string().required().max(11),
        cnpj: Joi.string().required().length(14),
        endereco: Joi.string().required(),
        cidade: Joi.string().required(),
        uf: Joi.string().required().length(2),
        senha: Joi.string().required().min(8),
    })
}), EscolaController.create);
routes.put('/escola/:id', EscolaController.put);


routes.get('/niveis', NiveisController.index)
routes.get('/niveis/count', NiveisController.count)
routes.post('/niveis', NiveisController.create)
routes.put('/niveis/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), NiveisController.put)

routes.get('/niveis/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), NiveisController.filterProfessor)

routes.get('/turnos', TurnosController.index)
routes.post('/turnos', TurnosController.create)
routes.get('/turnos/turma/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurnosController.getByTurma)

routes.get('/turnos/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurnosController.filterByProfessor)

routes.get('/turnos/disciplinas/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurnosController.filterByDisciplina)

routes.put('/turno/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), TurnosController.put)

routes.get('/disciplinas', DisciplinasController.index)
routes.get('/disciplinas/count', DisciplinasController.count)
routes.get('/disciplinas/name', DisciplinasController.getDisciplinaByName)
routes.post('/disciplinas', DisciplinasController.create)
routes.get('/disciplinas/nivel/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}),  DisciplinasController.getDisciplinaByNivel)

routes.get('/disciplinas/turma/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}),  DisciplinasController.filterByTurma)

routes.get('/disciplinas/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), DisciplinasController.filterByProfessor)

routes.put('/disciplinas/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), DisciplinasController.put)

routes.delete('/disciplinas/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), DisciplinasController.delete)

routes.get('/professor', ProfessorController.index);
routes.get('/professor/count', ProfessorController.count);
routes.post('/login', ProfessorController.getByEmail);
routes.post('/professor', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        email: Joi.string().required().email(),
        especialidade: Joi.string().required(),
        telefone: Joi.string().required().max(11),
        senha: Joi.string().required().min(8),
        dias: Joi.array().required(),
    }),
    
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown()
}), ProfessorController.create);
routes.delete('/professor/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), ProfessorController.delete)

routes.put('/professor/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), ProfessorController.put)

routes.get('/professor/inatives', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown()
}), ProfessorController.getProfessorInative)

routes.get('/professor/disciplina/nivel/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown(),

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), ProfessorController.getProfessorByNivel)

routes.get('/professor/disciplina/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown(),

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), ProfessorController.getProfessorByDisciplina)

routes.get('/disponibilidade/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown(),

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), ProfessorController.getProfessorByDay)

routes.get('/disponibilidade', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown()
}), DisponibilidadeController.index)

routes.get('/details/disciplina/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown(),

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), DetailsController.disciplinas)

routes.get('/details/professor/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown(),

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),
}), DetailsController.professores)

routes.get('/obs/:grade_id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        grade_id: Joi.number().required(),
    }),
}), ObservacaoProfessorApp.index)

routes.post('/obs', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.number().required(),
    }).unknown()
}), ObservacaoProfessorApp.create)

module.exports = routes;