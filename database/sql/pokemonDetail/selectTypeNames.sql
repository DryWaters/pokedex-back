select name, slot
from pokemon_types pt, types t
where pt.pokemon_id = $1
and pt.type_id = t.type_id