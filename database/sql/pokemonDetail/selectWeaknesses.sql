select *
from damage_stats
where type_1 = $1
and type_2 = $2;