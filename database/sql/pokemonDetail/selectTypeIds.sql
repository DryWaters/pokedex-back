select type_id, slot
from pokemon_types pt
where pt.pokemon_id = $1