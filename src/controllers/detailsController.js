const connection = require('../database/connection')

module.exports = {
    async disciplinas (request, response) {
        const {id} = request.params;
        const escola_id = request.headers.authorization;

        const incidents = await connection('disciplinas')
        .innerJoin('professor', 'disciplinas.professor_id', 'professor.id')
        .innerJoin('niveis', 'disciplinas.nivel_id', 'niveis.id')
        .where({'disciplinas.id': id, 'disciplinas.escola_id': escola_id})
        .select('disciplinas.*', 'professor.nome', 'niveis.nome_nivel')
        .first();
        

        return response.json(incidents);
    },

    async professores (request, response) {
        const {id} = request.params;
        const escola_id = request.headers.authorization;

        const incidents = await connection('professor')
        .innerJoin('disponibilidade', 'professor.id', 'disponibilidade.professor_id')
        .where({'professor.id': id, 'professor.escola_id': escola_id})
        .select('professor.*', 'disponibilidade.dia')

        
        return response.json(incidents);
    }, 

    
}