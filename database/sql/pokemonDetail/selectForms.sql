select pokemon_id, p.name as pokemon_name, p.hp, p.attack, p.defense, p.special_attack, p.special_defense, p.speed, p.image_id
from pokemon p
where p.pokemon_id = $1