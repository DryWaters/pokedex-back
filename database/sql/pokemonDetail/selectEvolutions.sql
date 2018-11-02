SELECT p.pokemon_id, p.name, p.image_id
    FROM pokemon p
        WHERE p.pokemon_id = ${pokemonId}