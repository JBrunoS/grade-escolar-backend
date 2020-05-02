const connection = require('../database/connection')

module.exports = {
    async index (request, response) {
        const escola_id = request.headers.authorization;

        const niveis = await connection('niveis')
        .where('escola_id', escola_id)
        .select('*')

        return response.json(niveis);
    },

    async count (request, response){
        const escola_id = request.headers.authorization;

        const [total] = await connection('niveis')
        .where('escola_id', escola_id)
        .count()

        return response.json(total)
    },

    async create (request, response) {
        const escola_id = request.headers.authorization;
        const { nome_nivel } = request.body;

        await connection('niveis')
        .insert({
            nome_nivel,
            escola_id
        })

        response.status(204).send();

    },

    async put (request, response) {
        const escola_id = request.headers.authorization;
        const {id} = request.params;
        const {nome_nivel} = request.body;

        await connection('niveis')
        .where({'id': id, 'escola_id': escola_id})
        .update({
            'nome_nivel': nome_nivel
        })

        return response.status(204).send();
    },

    async filterProfessor (request, response){
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const professores = await connection('niveis')
        .innerJoin('grade', 'niveis.id', 'grade.nivel_id')
        .innerJoin('professor', 'grade.professor_id', 'professor.id')
        .where({
            'niveis.id' : id,
            'niveis.escola_id': escola_id
        })
        .select('*')

        return response.json(professores)
    }
}