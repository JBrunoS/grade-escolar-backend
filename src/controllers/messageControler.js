const connection = require('../database/connection')

module.exports = {
    async index (request, response){
        const { escola_id } = request.params;

        const result  = await connection('message')
        .where('escola_id', escola_id)
        .select('*');

        return response.json(result);

    },

    async getMessageProfessor(request, response){
        const { escola_id } = request.params;

        const result  = await connection('message')
        .where({
            'escola_id': escola_id,
            'professor': true
        })
        .select('*')
        .orderBy('id', 'desc');

        return response.json(result);
    },
    
    async getMessageAluno(request, response){
        const { escola_id } = request.params;

        const result  = await connection('message')
        .where({
            'escola_id': escola_id,
            'aluno': true
        })
        .select('*');

        return response.json(result);
    },

    async create (request, response){
        const { escola_id } = request.params;
        const { descricao, professor, aluno, file } = request.body;

        await connection('message')
        .insert({
            descricao, 
            professor,
            aluno,
            file,
            escola_id
        })

        return response.status(204).send();
    }
}