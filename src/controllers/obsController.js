const connection = require('../database/connection')

module.exports  = {
    async index (request, response) {
        const escola_id = request.headers.authorization;
        const { grade_id } =request.params;

        const observacao = await connection('observacao')
        .where({'grade_id': grade_id,'escola_id': escola_id})
        .select('*')
        .orderBy('id', 'desc');

        return response.json(observacao);
    },

    async create (request, response){
        const escola_id = request.headers.authorization;
        const {descricao, data, hora, grade_id} = request.body;

        const incident = await connection('observacao').insert({
            descricao,
            data,
            hora,
            grade_id,
            escola_id
        })

        return response.status(204).send();
    }
}