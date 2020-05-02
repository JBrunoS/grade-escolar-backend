
exports.up = function(knex) {
    return knex.schema.createTable('disciplinas', function(table){
        table.increments().primary();
        table.string('nome_disciplina');
        table.integer('carga_horaria');
        table.integer('professor_id');
        table.integer('nivel_id');
        table.integer('escola_id');
  
        table.foreign('escola_id').references('escola.id');
        table.foreign('professor_id').references('professor.id');
        table.foreign('nivel_id').references('niveis.id');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('disciplinas');
  };
  