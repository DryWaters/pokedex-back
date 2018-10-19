select pokemon.pokemon_id as id, 
  pokemon.name, 
  pokemon.image_id,
  types.name as types_name
  from pokemon
    INNER JOIN pokemon_types ON pokemon_types.pokemon_id = pokemon.pokemon_id 
    INNER JOIN types ON types.type_id = pokemon_types.type_id 
      where pokemon.pokemon_id  >= $1 and
      pokemon.pokemon_id <= $2 
        ORDER BY pokemon.pokemon_id