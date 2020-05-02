
exports.up = function(knex) {
  return knex.schema.createTable('grade', function(table){
      table.increments().primary()
      table.integer('disciplina_id')
      table.integer('professor_id')
      table.integer('turma_id')
      table.integer('nivel_id')
      table.integer('turno_id')
      table.integer('dia')
      table.time('horario')
      table.integer('escola_id')

      table.foreign('escola_id').references('escola.id');
      table.foreign('nivel_id').references('nivel.id');
      table.foreign('turno_id').references('turno.id');
      table.foreign('turma_id').references('turma.id');
      table.foreign('professor_id').references('professor.id');
      table.foreign('disciplina_id').references('disciplina.id');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('grade')
};
