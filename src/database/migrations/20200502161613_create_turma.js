
exports.up = function(knex) {
    return knex.schema.createTable('turmas', function(table){
        table.increments().primary();
        table.string('nome_turma');
        table.integer('nivel_id');
        table.integer('turno_id');
        table.integer('escola_id');
  
        table.foreign('escola_id').references('escola.id');
        table.foreign('nivel_id').references('nivel.id');
        table.foreign('turno_id').references('turno.id');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('turmas');
  };
  