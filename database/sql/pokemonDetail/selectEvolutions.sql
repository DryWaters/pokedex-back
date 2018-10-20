select p.pokemon_id, p.name, p.image_id
from pokemon p
where p.pokemon_id = $1