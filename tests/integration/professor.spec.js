const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('Professor', () => {
    beforeEach(async () => {
        //await connection.migrate.rollback();
        await connection.migrate.latest();
    })

    afterAll(async () => {
        await connection.destroy();
    })

    it('Should be able to create a new professor', async () => {
        const response = await request(app)
        .post('/professor')
        .set('Authorization', 1)
        .send({
            nome : "Seu Miguel Sousa",
            telefone : "85987306182",
            especialidade : "Arte",
            email : "joa0@joao.com",
            senha : "absdc5609",
            dias : [1, 2]
        })

        console.log(response.body)
    });
    
});
