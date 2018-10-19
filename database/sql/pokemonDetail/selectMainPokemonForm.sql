select p.pokemon_id, p.name, d.p_desc, s.species
from pokemon p, pokemon_desc d, species s
where p.pokemon_id = d.pokemon_id
and p.pokemon_id = s.pokemon_id
and p.pokemon_id = $1;