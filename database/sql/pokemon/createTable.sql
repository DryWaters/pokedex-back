CREATE TABLE public.pokemon (
  pokemon_id INTEGER PRIMARY KEY, 
  name CHARACTER VARYING(50), 
  image_id INTEGER UNIQUE)