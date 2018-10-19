select p.pokemon_id, p.name, evolve_1, evolve_2, evolve_3
from pokemon p
left outer join evolutions e on p.evol_id = e.evolution_id
where p.species_id = $1
order by pokemon_id;