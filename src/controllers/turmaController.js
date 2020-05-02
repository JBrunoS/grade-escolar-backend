const connection = require('../database/connection')

module.exports = {
    async index (request, response) {
        const escola_id  = request.headers.authorization;

        const turmas = await connection('turmas')
        .innerJoin('niveis', 'turmas.nivel_id', 'niveis.id')
        .innerJoin('turnos', 'turmas.turno_id', 'turnos.id')
        .where('turmas.escola_id', escola_id)
        .select('turmas.*', 'niveis.nome_nivel', 'turnos.turno')
        .orderBy('turmas.nome_turma','niveis.nome_nivel' ,'turnos.turno')
        

        return response.json(turmas);
    },

    async count (request, response){
        const escola_id = request.headers.authorization;

        const [total] = await connection('turmas')
        .where('escola_id', escola_id)
        .count()

        return response.json(total)
    },

    async create (request, response) {
        const { nome_turma, nivel_id, turno_id } = request.body;
        const escola_id = request.headers.authorization;

        await connection('turmas')
        .insert({
            nome_turma,
            nivel_id,
            turno_id,
            escola_id
        })

        return response.json({ nome_turma });
    },

    async getTurmaByNivelTurno (request, response) {
        const escola_id = request.headers.authorization;
        const {nivel, turno } = request.params;

       const turmas = await connection('turmas')
        .innerJoin('niveis', 'turmas.nivel_id', 'niveis.id')
        .innerJoin('turnos', 'turmas.turno_id', 'turnos.id')
        .where({
            'turmas.escola_id': escola_id,
            'turmas.turno_id' : turno,
            'turmas.nivel_id' : nivel,
            
        })
        .select('turmas.*', 'niveis.nome_nivel', 'turnos.turno')
        .orderBy('turmas.nome_turma','niveis.nome_nivel' ,'turnos.turno') 

        return response.json(turmas) 
    },

    async getTurmaByNivel(request, response) {
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const turmas = await connection('turmas')
        .innerJoin('niveis', 'turmas.nivel_id', 'niveis.id')
        .innerJoin('turnos', 'turmas.turno_id', 'turnos.id')
        .where({
            'turmas.escola_id' : escola_id,
            'turmas.nivel_id' : id
        })
        .select('turmas.*', 'niveis.nome_nivel', 'turnos.turno')
        .orderBy('turmas.nome_turma','niveis.nome_nivel' ,'turnos.turno')

        return response.json(turmas)
    },

    async getTurmaByTurno(request, response) {
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const turmas = await connection('turmas')
        .innerJoin('niveis', 'turmas.nivel_id', 'niveis.id')
        .innerJoin('turnos', 'turmas.turno_id', 'turnos.id')
        .where({
            'turmas.escola_id' : escola_id,
            'turmas.turno_id' : id
        })
        .select('turmas.*', 'niveis.nome_nivel', 'turnos.turno')
        .orderBy('turmas.nome_turma','niveis.nome_nivel' ,'turnos.turno')

        return response.json(turmas)
    },

    async delete (request, response) {
        const { id } = request.params;
        const escola_id = request.headers.authorization;

        const user = await connection('turmas')
        .innerJoin('grade', 'turmas.id', 'grade.turma_id')
        .where({'turmas.id': id, 'turmas.escola_id': escola_id})
        .select('*')
        .first();

        if (!user) {
            const turma = await connection('turmas')
            .where({
                'id': id,
                'escola_id': escola_id
            })
            .select('*')
            .first();

            if (turma) {
                await connection('turmas')
                .where('id', id)
                .delete();

                return response.status(204).send();
            }
            return
        }

        return response.status(401).json({error: "Olá, não foi possível atender ao pedido porque a turma está vinculada na grade horária."})
    },

    async put(request, response) {
        const { id } = request.params;
        const escola_id = request.headers.authorization;
        const { nome_turma, nivel_id, turno_id } = request.body;

        const user = await connection('turmas')
        .where({'id': id, 'escola_id': escola_id})
        .update({
            "nome_turma" : nome_turma, 
            "nivel_id" : nivel_id, 
            "turno_id" : turno_id, 
        })

        if (!user) {
            return response.status(401).json({ error: 'Usuário não encontrado, hein!' })
        }

        return response.json(user);
    },

    

}