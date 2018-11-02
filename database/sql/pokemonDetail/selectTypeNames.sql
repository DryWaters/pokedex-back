SELECT name, slot
    FROM pokemon_types pt, types t
        WHERE pt.pokemon_id = ${pokemonId}
        AND pt.type_id = t.type_id