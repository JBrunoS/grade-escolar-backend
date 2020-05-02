
exports.up = function(knex) {
    return knex.schema.createTable('turnos', function(table){
        table.increments().primary();
        table.string('turno');
        table.int('escola_id');
  
        table.foreign('escola_id').references('escola.id');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('turnos');
  };
  