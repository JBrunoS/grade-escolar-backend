
exports.up = function(knex) {
  return knex.schema.createTable('observacao', function(table){
      table.increments().primary()
      table.string('descricao')
      table.date('data')
      table.time('hora')
      table.integer('grade_id')
      table.integer('escola_id')

      table.foreign('grade_id').references('grade.id')
      table.foreign('escola_id').references('escola.id')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('observacao');
};
