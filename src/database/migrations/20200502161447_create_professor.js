
exports.up = function(knex) {
    return knex.schema.createTable('professor', function(table){
        table.increments().primary();
        table.string('nome');
        table.string('especialidade');
        table.string('email');
        table.string('telefone');
        table.string('senha');
        table.boolean('ativo');
        table.integer('escola_id');
  
        
        table.foreign('escola_id').references('id').inTable('escola')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('professor');
  };
  