const connection = require('../database/connection')

module.exports = {
    async index(request, response){
        const escola_id = request.headers.authorization;
    
        const professor = await connection('professor')
        .where({'escola_id': escola_id, 'ativo': 1})
        .select('professor.*')

        return response.json(professor);
    },

    async count (request, response){
        const escola_id = request.headers.authorization;

        const [total] = await connection('professor')
        .where('escola_id', escola_id)
        .count()

        return response.json(total)
    },

    async getProfessorInative(request, response){
        const escola_id = request.headers.authorization;
        const professor = await connection('professor')
        .where({'escola_id': escola_id, 'ativo': 0})
        .select('*');
        
        return response.json(professor);
    },

    async getProfessorByNivel(request, response){
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const professor = await connection('disciplinas')
        .join('professor', 'professor.id', '=', 'disciplinas.professor_id' )
        .where({
            'disciplinas.nivel_id': id,
            'disciplinas.escola_id' : escola_id,
            'professor.ativo': 1,
            
        })
        .select('professor.*', 'disciplinas.nome_disciplina');
        
        return response.json(professor);
    },

    async getProfessorByDisciplina(request, response) {
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        

        const professor = await connection('disciplinas')
        .join('professor', 'professor.id', '=', 'disciplinas.professor_id' )
        .where({
            'disciplinas.id': id,
            'disciplinas.escola_id' : escola_id,
            'professor.ativo': 1,
            
        })
        .select('professor.*', 'disciplinas.nome_disciplina');
        
        return response.json(professor);
    },

    async getProfessorByDay(request, response) {
        const escola_id = request.headers.authorization;
        const { id } = request.params;

        const professor = await connection('professor')
        .join('disponibilidade', 'disponibilidade.professor_id', '=', 'professor.id')
        .where({
            'professor.id' : id,
            'disponibilidade.escola_id' : escola_id
        })
        .select('professor.*', 'disponibilidade.*')

        return response.json(professor)
    },


    async create(request, response){
        const {nome, especialidade, telefone, email, senha} = request.body;
        const { dias } = request.body;
        const escola_id = request.headers.authorization;

        
        const user = await connection('professor')
        .where({'email': email, 'escola_id': escola_id})
        .select('*')
        .first();
        
        
        if (!user) {
            await connection('professor').insert({
                nome, 
                especialidade,
                telefone,
                ativo : 1,
                email,  
                senha,
                escola_id
            });

            const id = await connection('professor')
                .where('email', email)
                .select('id')
                .first()

                const professor_id = id.id
                

            for (let index = 0; index < dias.length; index++) {
                const dia = dias[index];
                
                
                await connection('disponibilidade').insert({
                  dia, 
                  professor_id,
                  escola_id
                })
            }
            return response.status(204).send();
        }
        return response.status(400).json({error: 'There is someone using this e-mail'})
        
    },

    async delete(request, response) {
        const { id } = request.params;
        const escola_id = request.headers.authorization;

        const user = await connection('professor')
        .innerJoin('grade', 'professor.id', 'grade.professor_id')
        .innerJoin('disciplinas', 'professor.id', 'disciplinas.professor_id')
        .where({'professor.id': id, 'professor.escola_id': escola_id})
        .select('professor.escola_id', 'professor.email')
        .first();

        if (!user) {

            const professor = await connection('professor')
            .where('id', id)
            .select('escola_id', 'id')
            .first();

            if (professor.escola_id != escola_id) {
                return response.status(401).json({ error: 'Não foi possível excluir esse usuário' })
            }
            
            await connection('disponibilidade')
            .where('professor_id', professor.id) 
            .delete();

            await connection('professor').where('id', id).delete();
    
            return response.status(204).send();
        }

        return response.status(401).json({error: "Olá, não foi possível atender ao pedido porque o professor está vinculado a disciplinas. "})
        
        
    },

    async put(request, response) {
        const { id } = request.params;
        const escola_id = request.headers.authorization;
        const {nome, especialidade, ativo, email, senha} = request.body;
        const { dias } = request.body;
        

        const user = await connection('professor')
        .where({'id': id, 'escola_id': escola_id})
        .update({
            "nome" : nome, 
            "especialidade" : especialidade, 
            "ativo" : ativo, 
            "email": email, 
            "senha":senha
        })



        if (!user) {
            return response.status(401).json({ error: 'Usuário não encontrado, hein!' })
        }

        await connection('disponibilidade')
        .where('professor_id', id)
        .delete();

        const userID = await connection('professor')
        .where('id', id)
        .select('id')
        .first();

        const professor_id = userID.id;

        for (let index = 0; index < dias.length; index++) {
            const dia = dias[index];
            
            
            await connection('disponibilidade').insert({
              dia, 
              professor_id,
              escola_id
            })
        }

        

        return response.json(user);
    }
}