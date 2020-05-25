
exports.up = function(knex) {
  return knex.schema.createTable('message', function(table){
      table.increments().primary();
      table.string('descricao');
      table.boolean('professor')      
      table.boolean('aluno')
      table.binary('file')
      table.integer('escola_id')

      table.foreign('escola_id').references('escola.id')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('message');
};
