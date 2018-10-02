CREATE TABLE public.pokemon_types (
  pokemon_id INTEGER, 
  type_id INTEGER, 
  slot INTEGER, 
  CONSTRAINT pokemon_types_pkey PRIMARY KEY (pokemon_id, slot))