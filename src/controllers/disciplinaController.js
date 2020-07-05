const connection = require('../database/connection')

module.exports = {
    async index (request, response) {
        const escola_id = request.headers.authorization;

        const disciplinas = await connection('disciplinas')
        .where('disciplinas.escola_id', escola_id)
        .select('disciplinas.*')
        .orderBy('disciplinas.id')

        return response.json(disciplinas);
    },

    async count (request, response){
        const escola_id = request.headers.authorization;

        const [total] = await connection('disciplinas')
        .where('escola_id', escola_id)
        .count()

        return response.json(total)
    },

    async getDisciplinaByName (request, response) {
        const escola_id = request.headers.authorization;
        const { disciplina } = request.params;


        const disciplinas = await connection('disciplinas')
        .innerJoin('grade', 'disciplinas.id', 'grade.disciplina_id')
        .innerJoin('professor', 'grade.professor_id', 'professor.id')
        .where({
            'disciplinas.nome_disciplina': disciplina,
            'disciplinas.escola_id': escola_id
        })
        .select('professor.*')
        .groupBy('professor.id')

        return response.json(disciplinas);

        
    },

    async getDisciplinaByNivel (request, response){
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const disciplinas = await connection('disciplinas')
        .innerJoin('grade', 'disciplinas.id', 'grade.disciplina_id')

        .where({'disciplinas.escola_id': escola_id, 'grade.nivel_id': id})
        .select('disciplinas.*');

        return response.json(disciplinas);
    },

    async create (request, response) {
        const escola_id = request.headers.authorization;
        const { nome_disciplina, carga_horaria } = request.body;

        const disciplina = await connection('disciplinas')
        .where({'nome_disciplina': nome_disciplina})
        .select("*")
        .first();
        

        if (!disciplina) {
            await connection('disciplinas').insert({
                nome_disciplina,
                carga_horaria,
                escola_id
            })
          return response.status(204).send();
        }

        return response.status(404).json({error: "Já tem uma disciplina com esse mesmo"});
    },

    async put(request, response) {
        const { id } = request.params;
        const escola_id = request.headers.authorization;
        const { disciplina, carga_horaria } = request.body;

        const user = await connection('disciplinas')
        .where({'id': id, 'escola_id': escola_id})
        .update({
            "nome_disciplina": disciplina,
            "carga_horaria" : carga_horaria, 
        })

        if (!user) {
            return response.status(401).json({ error: 'Usuário não encontrado, hein!' })
        }

        return response.json(user);
    },

    async delete(request, response) {
        const { id } = request.params;
        const escola_id = request.headers.authorization;

        const user = await connection('disciplinas')
        .innerJoin('grade', 'disciplinas.id', 'grade.disciplina_id')
        .where({'disciplinas.id': id, 'disciplinas.escola_id': escola_id})
        .select('*')
        .first();

        if(!user){
            const disciplina = await connection('disciplinas')
            .where({'id': id, 'escola_id': escola_id})
            .select('*')
            .first();
        
        
            if (disciplina.escola_id != escola_id) {
                return response.status(401).json({ error: 'Não foi possível excluir esse usuário' })
            
            }
            await connection('disciplinas')
            .where('id', id)
            .delete();
        
            return response.status(204).send();
        }
        return response.status(401).json({error: "Olá, não foi possível atender ao pedido porque a disciplina está vinculada na grade horários. "})
        
    },

    async filterByProfessor(request, response){
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const professores = await connection('disciplinas')
        .innerJoin('professor', 'disciplinas.professor_id', 'professor.id')
        .where({
            'disciplinas.nome_disciplina' : id,
            'disciplinas.escola_id': escola_id
        })
        .select('professor.*')
        .groupBy('professor.id')

        return response.json(professores)
    },

    async filterByTurma(request, response){
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const professores = await connection('disciplinas')
        .innerJoin('grade', 'disciplinas.id', 'grade.disciplina_id')
        .innerJoin('turmas', 'grade.turma_id', 'turmas.id')
        .innerJoin('professor', 'grade.professor_id', 'professor.id')
        .where({
            'turmas.id' : id,
            'disciplinas.escola_id': escola_id
        })
        .select('disciplinas.*', 'professor.nome')
        .groupBy('disciplinas.id', 'professor.nome')

        return response.json(professores)
    }
}