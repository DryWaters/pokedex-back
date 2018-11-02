SELECT type_id, slot
    FROM pokemon_types pt
        WHERE pt.pokemon_id = ${pokemonId}