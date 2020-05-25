const connection = require('../database/connection')

module.exports = {
    async index (request, response) {
        const escola_id = request.headers.authorization;

        const grade = await connection('grade')
        .where('escola_id', escola_id)
        .select('*')
        .orderBy('dia')
        .orderBy('horario_inicio')

        return response.json(grade);
    },

    async create (request, response) {
        const { 
            disciplina_id, 
            professor_id, 
            turma_id, 
            nivel_id, 
            turno_id, 
            dia, 
            horario_inicio, 
            horario_fim,
            } = request.body;
        
        const escola_id = request.headers.authorization;

        const grade = await connection('grade')
        .where({
            'disciplina_id' : disciplina_id,
            'professor_id' : professor_id,
            'turma_id' : turma_id,
            'nivel_id' : nivel_id,
            'turno_id' : turno_id,
            'dia' : dia,
            'horario_inicio' : horario_inicio,
            'horario_fim': horario_fim
        })
        .select('*')
        .first();

        const dias = await connection('grade')
            .where('dia', dia)    
            .where('horario_inicio', '<=', horario_inicio)
            .where('horario_fim', '>=', horario_inicio)
            .where('professor_id', professor_id)
            .select('*')
            .first();

        console.log(dias);
        
        const disponibilidade = await connection('disponibilidade')
            .where({
                'dia' : dia,
                'professor_id': professor_id
            })
            .select('*')
            .first()


        const professor = await connection('grade')
            .where('dia', dia)    
            .where('horario_inicio', '<=', horario_inicio)
            .where('horario_fim', '>=', horario_inicio)
            .where('turma_id', turma_id)
            
            .select('*')
            .first();
        
        if (!disponibilidade) {
            return response.status(401).json('O professor não está na escola esse dia');
        }

        if (grade) {
            return response.status(401).json('Já existe um registro com as mesmas informações');
        }

        if(dias){
            return response.status(401).json('Há conflito de horário do professor');
        }

        if (professor) {
            return response.status(401).json('Já existe uma disciplina cadastrada nesse horário');
        }

        if (!grade && !dias && !professor && disponibilidade) {
            await connection('grade')
                    .insert({
                        disciplina_id, 
                        professor_id,   
                        turma_id, 
                        nivel_id, 
                        turno_id, 
                        dia, 
                        horario_inicio, 
                        horario_fim,
                        escola_id
                    })
    
                    return response.json(horario_inicio + ':' + horario_fim)
        }
    },

    async filtred (request, response) {
        const escola_id = request.headers.authorization;
        const {nivel_id, turma_id, turno_id} = request.params;

        const grade = await connection('grade')
        .innerJoin('disciplinas', 'grade.disciplina_id', 'disciplinas.id')
        .innerJoin('professor', 'grade.professor_id', 'professor.id')
        .where({
            'grade.escola_id': escola_id,
            'grade.nivel_id': nivel_id,
            'grade.turma_id': turma_id,
            'grade.turno_id': turno_id
        })
        .select('grade.*', 'professor.nome', 'disciplinas.nome_disciplina')
        .orderBy('horario_inicio')

        return response.json(grade);
    },

    async getHoraProfessor(request, response){
        const escola_id = request.headers.authorization
        const { id } = request.params

        const grade = await connection('grade')
        .innerJoin('disciplinas', 'grade.disciplina_id', 'disciplinas.id')
        .innerJoin('professor', 'grade.professor_id', 'professor.id')
        .innerJoin('turmas', 'grade.turma_id', 'turmas.id')
        .where({
            'grade.escola_id' : escola_id,
            'grade.professor_id': id
        })

        .select('grade.*', 'professor.nome', 'disciplinas.nome_disciplina', 'turmas.nome_turma')
        .orderBy(['grade.dia', 'grade.horario_inicio'])


        const obs = await connection('grade')
        .innerJoin('observacao', 'grade.id', 'observacao.grade_id')
        .where({
            'grade.escola_id' : escola_id,
            'grade.professor_id': id
        })
        .select('observacao.*')
        .orderBy('observacao.id', 'desc')

        const data = { grade, obs};
        return response.json(grade)
    },

    async delete(request, response) {
        const {id} = request.params;
        

        const data =  await connection('grade')
        .innerJoin('escola', 'grade.escola_id', 'escola.id')
        .where({
            'grade.id': id,
        })
        .select('grade.*', 'escola.senha')
        .first();


        if (!data) {
            return response.status(401).json({ error: 'Esse usuário não está cadastrado na banco de dados' })
        }
        
        await connection('grade').where('id', id).delete();
        
        

        return response.json(data)
    },

    async deleteAll(request, response) {
        const { escola_id } = request.params;

        await connection('grade')
        .where('grade.escola_id', escola_id)
        .delete()

        return response.json({message : 'Grade resetada!'});
    }
}