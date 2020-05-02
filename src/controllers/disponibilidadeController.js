const connection = require('../database/connection')

module.exports = {
    async index (request, response) {
        const escola_id = request.headers.authorization;

        const disponibilidade = await connection('disponibilidade')
        .where({'escola_id': escola_id})
        .select('*');

        return response.json(disponibilidade);
    }
}