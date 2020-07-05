
exports.up = function(knex) {
    return knex.schema.createTable('disciplinas', function(table){
        table.increments().primary();
        table.string('nome_disciplina');
        table.integer('carga_horaria');
        table.integer('escola_id');
  
        table.foreign('escola_id').references('escola.id');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('disciplinas');
  };
  