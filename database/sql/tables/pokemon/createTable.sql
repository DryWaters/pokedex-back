CREATE TABLE public.pokemon (
  pokemon_id INTEGER PRIMARY KEY, 
  name CHARACTER VARYING(100),
  species_id INTEGER,
  image_id INTEGER,
  evol_id INTEGER,
  hp INTEGER,
  attack INTEGER,
  defense INTEGER,
  special_attack INTEGER,
  special_defense INTEGER,
  speed INTEGER)