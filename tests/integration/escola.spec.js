const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('Escola', () => {
    beforeEach(async () => {
        // await connection.migrate.rollback();
        await connection.migrate.latest();
    })

    afterAll(async () => {
        await connection.destroy();
    })

    

    it('Should be able to create a new school', async () => {
        const response = await request(app)
        .post('/new/escola')
        .send({
            nome: "KKKKKK",
            email: "monteiro@monteiro.com",
            telefone: "987306182",
            cnpj: "12222200010200",
            endereco: "rua 1",
            cidade: "Maranguape",
            uf: "CE",
            senha: "12345699"
        });

        console.log(response.body);
    });
    

    it('Should be Able to log in a specific school', async () => {
        const response = await request(app)
        .post('/escola')
        .send({
            email: "monteiro@monteiro.com",
            senha: "12345699"
        });

        console.log(response.body)
    });

    it('Should Be able to list a specific school', async () => {
        const response = await request(app)
        .get(`/escola/${1}`);

        console.log(response.body)
    });

    it('Should be able to edit a specific school', async () => {
        const response = await request(app)
        .put(`/escola/${1}`)
        .send({
            nome: "Bruno Sousa Lopes",
            email: "monteiro@monteiro.com",
            telefone: "987306182",
            cnpj: "12222200010200",
            endereco: "rua 1Antonio Sabino",
            cidade: "Maranguape",
            uf: "CE",
            senha: "12345678"
        });

        console.log(response.body)
    });
    
    
    
});
