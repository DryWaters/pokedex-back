SELECT p.pokemon_id, p.name AS pokemon_name, d.p_desc, s.species, 
p.hp, p.attack, p.defense, p.special_attack, p.special_defense, p.speed,
p.image_id
    FROM pokemon p, pokemon_desc d, species s
        WHERE p.pokemon_id = ${pokemonId}
        AND d.pokemon_id = ${pokemonId}
        AND s.pokemon_id = ${pokemonId};