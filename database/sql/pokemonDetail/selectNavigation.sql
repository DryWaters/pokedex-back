SELECT p.pokemon_id, p.name AS pokemon_name
    FROM pokemon p
        WHERE p.pokemon_id = ${pokemonId}