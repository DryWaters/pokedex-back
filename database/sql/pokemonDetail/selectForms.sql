select p.pokemon_id, p.name as pokemon_name, t.type_id, pt.slot, t.name as type_name, a.name as ability_name, is_hidden, 
p.hp, p.attack, p.defense, p.special_attack, p.special_defense, p.speed,
p.image_id
from types t, abilities a, pokemon p
left outer join pokemon_types pt on pt.pokemon_id = p.pokemon_id
left outer join pokemon_abils pa on pa.pokemon_id = p.pokemon_id
where p.pokemon_id = $1 and
pt.type_id = t.type_id and
pa.ability_id = a.abil_id;