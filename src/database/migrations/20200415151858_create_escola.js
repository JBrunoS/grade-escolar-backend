
exports.up = function(knex) {
    return knex.schema.createTable('escola', function(table){
        table.increments().primary();
        table.string('nome').notNullable();
        table.string('email').notNullable();
        table.string('telefone').notNullable();
        table.string('cnpj').notNullable();
        table.string('endereco').notNullable();
        table.string('cidade').notNullable();
        table.string('uf').notNullable();
        table.string('senha').notNullable();
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('escola');
  };
  