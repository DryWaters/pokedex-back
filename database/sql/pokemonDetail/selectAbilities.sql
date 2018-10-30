select name, short_effect, slot, is_hidden
from pokemon_abils pa, abilities a
where pa.pokemon_id = $1 and
pa.ability_id = a.abil_id