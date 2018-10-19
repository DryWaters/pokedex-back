select normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy
from damage_stats
where type_1 = $1
and type_2 = $2;