const connection = require('../database/connection')

module.exports = {
    async index (req, res) {
        const escola_id = req.headers.authorization;

        const turnos = await connection('turnos')
        .where('escola_id', escola_id)
        .select('*');

        return res.json(turnos);
    },

    async create (req, res) {
        const escola_id = req.headers.authorization;
        const { turno } = req.body;

        const tr = await connection('turnos')
        .where({
            'turno': turno,
            'escola_id' : escola_id
        })
        .select('*')
        .first()

        if (!tr) {
            await connection('turnos')
            .insert({
                turno,
                escola_id
            })
    
            res.status(204).send();
        }

        return res.status(401).json({error : 'Esse turno já está cadastrado!'})
        

    },

    async getByTurma (request, response) {
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const turmas = await connection('turnos')
        .innerJoin('turmas', 'turmas.turno_id', 'turnos.id')
        .where({
            'turnos.escola_id' : escola_id,
            'turmas.id' : id
        })
        .select('*')

        return response.json(turmas)
    },

    async put (request, response) {
        const escola_id = request.headers.authorization;
        const {id} = request.params;
        const {turno} = request.body;


        await connection('turnos')
        .where({'id': id, 'escola_id': escola_id})
        .update({
            'turno': turno
        })

        return response.status(204).send();
    },

    async filterByProfessor(request, response){
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const professores = await connection('turnos')
        .innerJoin('grade', 'turnos.id', 'grade.nivel_id')
        .innerJoin('professor', 'grade.professor_id', 'professor.id')
        .where({
            'turnos.id' : id,
            'turnos.escola_id': escola_id
        })
        .select('*')
        .groupBy('professor.id')

        return response.json(professores)
    }, 

    async filterByDisciplina(request, response){
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const disciplina = await connection('turnos')
        .innerJoin('grade', 'turnos.id', 'grade.nivel_id')
        .innerJoin('disciplinas', 'grade.disciplina_id', 'disciplinas.id')
        .innerJoin('professor', 'grade.professor_id', 'professor.id')
        .where({
            'turnos.id' : id,
            'turnos.escola_id': escola_id
        })
        .select('*')
        .groupBy('disciplinas.id')

        return response.json(disciplina)
    },     
}