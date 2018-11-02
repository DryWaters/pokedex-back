SELECT p.pokemon_id, p.name, evolve_1, evolve_2, evolve_3
    FROM pokemon p
        LEFT OUTER JOIN evolutions e ON p.evol_id = e.evolution_id
            WHERE p.species_id = ${pokemonId}
                ORDER BY pokemon_id;