const connection = require('../database/connection')

module.exports = {
    async index(request, response){
        const {id} = request.params;

        const escola = await connection('escola')
        .where('id', id)
        .select('*')
        .first();

        return response.json(escola);
    },

    async create (request, response){
        const { nome, email, telefone, cnpj, endereco, cidade, uf, senha} = request.body;

        const escola = await connection('escola')
        .where('email', email)
        .select('*')
        .first();

        if (!escola) {
            const data = await connection('escola').insert({ 
                nome, 
                email,  
                telefone,
                cnpj,
                endereco, 
                cidade, 
                uf,
                senha
            });
            
            return response.json( data.nome )
        }

        return response.status(401).json({ error: 'Esse email já está cadastrado.'})

        
    },

    async put (request, response) {
        const { nome, email, telefone, cnpj, endereco, cidade, uf, senha} = request.body;
        const { id } = request.params;

        const escola = await connection('escola')
        .where('id', id)
        .update({
            'nome': nome,
            'email': email,
            'telefone': telefone,
            'cnpj': cnpj,
            'endereco': endereco,
            'cidade': cidade,
            'uf': uf,
            'senha': senha
        })

        if (!escola) {
            return response.status(401).json({ error : 'Não foi possível alterar os dados'})
        }
        console.log(escola)
        return response.json(escola);
    },

    async getByEmail(request, response){
        const { email, senha } = request.body;

        const escola = await connection('escola')
        .where({'email': email, 'senha': senha})
        .select('*')
        .first()
        

        if (!escola) {
            return response.status(400).json({ error : 'This email is not longer valid'});
        }

        return response.json(escola)
    },
    
}