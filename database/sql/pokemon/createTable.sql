CREATE TABLE public.pokemon (
  pokemon_id INTEGER PRIMARY KEY, 
  name CHARACTER VARYING(100),
  species_id INTEGER,
  image_id INTEGER,
  description CHARACTER VARYING(500))