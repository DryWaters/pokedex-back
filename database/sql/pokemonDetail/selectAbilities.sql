SELECT name, short_effect, slot, is_hidden
    FROM pokemon_abils pa, abilities a
        WHERE pa.pokemon_id = ${pokemonId}
        AND pa.ability_id = a.abil_id