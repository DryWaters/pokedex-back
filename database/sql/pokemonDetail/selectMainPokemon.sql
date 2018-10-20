select p.pokemon_id, p.name as pokemon_name, d.p_desc, s.species, 
p.hp, p.attack, p.defense, p.special_attack, p.special_defense, p.speed,
p.image_id
from pokemon p, pokemon_desc d, species s
where p.pokemon_id = $1 and
d.pokemon_id = $1 and
s.pokemon_id = $1;