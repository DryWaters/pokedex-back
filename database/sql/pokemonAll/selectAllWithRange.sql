SELECT pokemon.pokemon_id AS id, 
  pokemon.name, 
  pokemon.image_id,
  types.name AS types_name
  FROM pokemon
    INNER JOIN pokemon_types ON pokemon_types.pokemon_id = pokemon.pokemon_id 
    INNER JOIN types ON types.type_id = pokemon_types.type_id 
      WHERE pokemon.pokemon_id IN (${id:csv})
        ORDER BY pokemon.pokemon_id