select p.pokemon_id, p.name, t.name, p.image_id
from types t, pokemon p
left outer join pokemon_types pt on pt.pokemon_id = p.pokemon_id
where p.pokemon_id = $1 and
pt.type_id = t.type_id;