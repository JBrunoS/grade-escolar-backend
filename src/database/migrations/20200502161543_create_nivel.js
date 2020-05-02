
exports.up = function(knex) {
    return knex.schema.createTable('niveis', function(table){
        table.increments().primary();
        table.string('nome_nivel');
        table.integer('escola_id');
  
        table.foreign('escola_id').references('escola.id');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('niveis');
  };
  