CREATE TABLE public.pokemon_abils (
  pokemon_id INTEGER, 
  ability_id INTEGER, 
  is_hidden BOOLEAN, 
  slot INTEGER,
  CONSTRAINT pokemon_abils_pkey PRIMARY KEY (pokemon_id, slot))