select p.pokemon_id, p.name as pokemon_name
from pokemon p
where p.pokemon_id = $1