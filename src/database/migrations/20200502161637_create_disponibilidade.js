
exports.up = function(knex) {
    return knex.schema.createTable('disponibilidade', function(table){
        table.increments().primary()
        table.integer('dia')
        table.integer('professor_id')
        table.integer('escola_id')
        
        table.foreign('escola_id').references('escola.id')
        table.foreign('professor_id').references('professor.id')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('disponibilidade');
  };
  