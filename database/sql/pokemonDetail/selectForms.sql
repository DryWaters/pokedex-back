SELECT pokemon_id, p.name AS pokemon_name, p.hp, p.attack, p.defense, p.special_attack, p.special_defense, p.speed, p.image_id
    FROM pokemon p
        WHERE p.pokemon_id = ${pokemonId}