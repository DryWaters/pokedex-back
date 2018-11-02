SELECT normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy
    FROM damage_stats
        WHERE type_1 = ${type1}
        AND type_2 = ${type2};