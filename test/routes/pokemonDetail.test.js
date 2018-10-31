const request = require('supertest');
const app = require('../../app');

const POKEMON = require('../../constants/pokemonConstants');

const errorResult = {
  'error': 'Invalid id',
  'expected id': {
    'id': `1-${POKEMON.NUMBER_OF_POKEMON}`,
  },
};

QUnit.module('Pokemon Details Endpoint Testing');

QUnit.test('Valid Pokemon Request (no forms), /pokemon/1', (assert) => {
  const expectedResult = {
    "previous": {
      "id": 807,
      "name": "Zeraora"
    },
    "next": {
      "id": 2,
      "name": "Ivysaur"
    },
    'id': 1,
    'name': 'Bulbasaur',
    'description': 'Bulbasaur can be seen napping in bright sunlight. ' +
      'There is a seed on its back. By soaking up the sun\'s rays, ' +
      'the seed grows progressively larger.',
    'species': 'Seed',
    'forms': [
      {
        'name': 'Bulbasaur',
        'types': [
          'grass',
          'poison',
        ],
        'weaknesses': [
          {
            'type': 'fire',
            'multiplier': '2.000',
          },
          {
            'type': 'ice',
            'multiplier': '2.000',
          },
          {
            'type': 'flying',
            'multiplier': '2.000',
          },
          {
            'type': 'psychic',
            'multiplier': '2.000',
          },
        ],
        'abilities': [
          {
            'name': 'Overgrow',
            'description': 'Strengthens grass moves to ' +
              'inflict 1.5× damage at 1/3 max HP or less.',
            'hidden': false,
          },
          {
            'name': 'Chlorophyll',
            'description': 'Doubles speed during strong sunlight.',
            'hidden': true,
          },
        ],
        'stats': {
          'hp': 45,
          'attack': 49,
          'defense': 49,
          'special-attack': 65,
          'special-defense': 65,
          'speed': 45,
        },
        'image_path': '/sprites/pokemon/large/1.png',
      },
    ],
    'evolutions': {
      '1': [
        {
          'id': 1,
          'name': 'Bulbasaur',
          'types': [
            'grass',
            'poison',
          ],
          'image_path': '/sprites/pokemon/small/1.png',
        },
      ],
      '2': [
        {
          'id': 2,
          'name': 'Ivysaur',
          'types': [
            'grass',
            'poison',
          ],
          'image_path': '/sprites/pokemon/small/2.png',
        },
      ],
      '3': [
        {
          'id': 3,
          'name': 'Venusaur',
          'types': [
            'grass',
            'poison',
          ],
          'image_path': '/sprites/pokemon/small/3.png',
        },
      ],
    },
  };

  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/1')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '1196')
    .expect(200)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body, expectedResult,
        'JSON does not equal, actual: ' + response.body +
        ' expected: ' + expectedResult);
    })
    .catch((error) => {
      assertAsync();
      assert.ok(false, 'FAIL /pokemon/1, with error' + error);
    });
});

QUnit.test('Valid Pokemon detail with forms, /pokemon/3', (assert) => {
  const expectedResult = {
    'previous': {
      'id': 2,
      'name': 'Ivysaur',
    },
    'next': {
      'id': 4,
      'name': 'Charmander',
    },
    'id': 3,
    'name': 'Venusaur',
    'description': 'There is a large flower on Venusaur\'s back. ' +
      'The flower is said to take on vivid colors if it gets plenty ' +
      'of nutrition and sunlight. The flower\'s aroma soothes the' +
      ' emotions of people.',
    'species': 'Seed',
    'forms': [
      {
        'name': 'Venusaur',
        'types': [
          'grass',
          'poison',
        ],
        'weaknesses': [
          {
            'type': 'fire',
            'multiplier': '2.000',
          },
          {
            'type': 'ice',
            'multiplier': '2.000',
          },
          {
            'type': 'flying',
            'multiplier': '2.000',
          },
          {
            'type': 'psychic',
            'multiplier': '2.000',
          },
        ],
        'abilities': [
          {
            'name': 'Overgrow',
            'description': 'Strengthens grass moves to inflict 1.5× ' +
              'damage at 1/3 max HP or less.',
            'hidden': false,
          },
          {
            'name': 'Chlorophyll',
            'description': 'Doubles speed during strong sunlight.',
            'hidden': true,
          },
        ],
        'stats': {
          'hp': 80,
          'attack': 82,
          'defense': 83,
          'special-attack': 100,
          'special-defense': 100,
          'speed': 80,
        },
        'image_path': '/sprites/pokemon/large/3.png',
      },
      {
        'name': 'Mega Venusaur',
        'types': [
          'grass',
          'poison',
        ],
        'weaknesses': [
          {
            'type': 'fire',
            'multiplier': '2.000',
          },
          {
            'type': 'ice',
            'multiplier': '2.000',
          },
          {
            'type': 'flying',
            'multiplier': '2.000',
          },
          {
            'type': 'psychic',
            'multiplier': '2.000',
          },
        ],
        'abilities': [
          {
            'name': 'Thick Fat',
            'description': 'Halves damage from fire and ice moves.',
            'hidden': false,
          },
        ],
        'stats': {
          'hp': 80,
          'attack': 100,
          'defense': 123,
          'special-attack': 122,
          'special-defense': 120,
          'speed': 80,
        },
        'image_path': '/sprites/pokemon/large/10051.png',
      },
    ],
    'evolutions': {
      '1': [
        {
          'id': 1,
          'name': 'Bulbasaur',
          'types': [
            'grass',
            'poison',
          ],
          'image_path': '/sprites/pokemon/small/1.png',
        },
      ],
      '2': [
        {
          'id': 2,
          'name': 'Ivysaur',
          'types': [
            'grass',
            'poison',
          ],
          'image_path': '/sprites/pokemon/small/2.png',
        },
      ],
      '3': [
        {
          'id': 3,
          'name': 'Venusaur',
          'types': [
            'grass',
            'poison',
          ],
          'image_path': '/sprites/pokemon/small/3.png',
        },
      ],
    },
  };

  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/3')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '1705')
    .expect(200)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body, expectedResult,
        'JSON does not equal, actual: ' + response.body +
        ' expected: ' + expectedResult);
    })
    .catch((error) => {
      assertAsync();
      assert.ok(false, 'FAIL /pokemon/3, with error' + error);
    });
});

QUnit.test('Valid Pokemon detail w/ evolutions, /pokemon/133', (assert) => {
  const expectedResult = {
    'previous': {
      'id': 132,
      'name': 'Ditto',
    },
    'next': {
      'id': 134,
      'name': 'Vaporeon',
    },
    'id': 133,
    'name': 'Eevee',
    'description': 'Eevee has an unstable genetic makeup that suddenly' +
      ' mutates due to the environment in which it lives. Radiation from' +
      ' various stones causes this Pokémon to evolve.',
    'species': 'Evolution',
    'forms': [
      {
        'name': 'Eevee',
        'types': [
          'normal',
        ],
        'weaknesses': [
          {
            'type': 'fighting',
            'multiplier': '2.000',
          },
        ],
        'abilities': [
          {
            'name': 'Run Away',
            'description': 'Ensures success fleeing from wild battles.',
            'hidden': false,
          },
          {
            'name': 'Adaptability',
            'description': 'Increases the same-type attack bonus ' +
              'from 1.5× to 2×.',
            'hidden': false,
          },
          {
            'name': 'Anticipation',
            'description': 'Notifies all trainers upon entering battle ' +
              'if an opponent has a super-effective move, self-destruct,' +
              ' explosion, or a one-hit KO move.',
            'hidden': true,
          },
        ],
        'stats': {
          'hp': 55,
          'attack': 55,
          'defense': 50,
          'special-attack': 45,
          'special-defense': 65,
          'speed': 55,
        },
        'image_path': '/sprites/pokemon/large/133.png',
      },
    ],
    'evolutions': {
      '1': [
        {
          'id': 133,
          'name': 'Eevee',
          'types': [
            'normal',
          ],
          'image_path': '/sprites/pokemon/small/133.png',
        },
      ],
      '2': [
        {
          'id': 134,
          'name': 'Vaporeon',
          'types': [
            'water',
          ],
          'image_path': '/sprites/pokemon/small/134.png',
        },
        {
          'id': 135,
          'name': 'Jolteon',
          'types': [
            'electric',
          ],
          'image_path': '/sprites/pokemon/small/135.png',
        },
        {
          'id': 136,
          'name': 'Flareon',
          'types': [
            'fire',
          ],
          'image_path': '/sprites/pokemon/small/136.png',
        },
        {
          'id': 196,
          'name': 'Espeon',
          'types': [
            'psychic',
          ],
          'image_path': '/sprites/pokemon/small/196.png',
        },
        {
          'id': 197,
          'name': 'Umbreon',
          'types': [
            'dark',
          ],
          'image_path': '/sprites/pokemon/small/197.png',
        },
        {
          'id': 470,
          'name': 'Leafeon',
          'types': [
            'grass',
          ],
          'image_path': '/sprites/pokemon/small/470.png',
        },
        {
          'id': 471,
          'name': 'Glaceon',
          'types': [
            'ice',
          ],
          'image_path': '/sprites/pokemon/small/471.png',
        },
        {
          'id': 700,
          'name': 'Sylveon',
          'types': [
            'fairy',
          ],
          'image_path': '/sprites/pokemon/small/700.png',
        },
      ],
      '3': null,
    },
  };

  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/133')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '1813')
    .expect(200)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body, expectedResult,
        'JSON does not equal, actual: ' + response.body +
        ' expected: ' + expectedResult);
    })
    .catch((error) => {
      assertAsync();
      assert.ok(false, 'FAIL /pokemon/133, with error' + error);
    });
});


QUnit.test('Invalid ID Pokemon Request, /pokemon/-1', (assert) => {
  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/-1')
    .expect('Content-Type', /json/)
    .expect('Content-Length', JSON.stringify(errorResult)
      .length.toString())
    .expect(404)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body, errorResult,
        'JSON does not equal, actual: ' + response.body +
        ' expected: ' + errorResult);
    })
    .catch((error) => {
      assertAsync();
      assert.ok(false, 'FAIL /pokemon/-1' + error);
    });
});

QUnit.test('Invalid empty ID Pokemon Request, /pokemon/808', (assert) => {
  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/' + POKEMON.NUMBER_OF_POKEMON + 1)
    .expect('Content-Type', /json/)
    .expect('Content-Length', JSON.stringify(errorResult)
      .length.toString())
    .expect(404)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body, errorResult,
        'JSON does not equal, actual: ' + response.body +
        ' expected: ' + errorResult);
    })
    .catch((error) => {
      assertAsync();
      assert.ok(false, 'FAIL /pokemon/808' + error);
    });
});

QUnit.test('Invalid character for ID, /pokemon/!', (assert) => {
  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/!')
    .expect('Content-Type', /json/)
    .expect('Content-Length', JSON.stringify(errorResult)
      .length.toString())
    .expect(404)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body, errorResult,
        'JSON does not equal, actual: ' + response.body +
        ' expected: ' + errorResult);
    })
    .catch((error) => {
      assertAsync();
      assert.ok(false, 'FAIL /pokemon/!' + error);
    });
});

QUnit.test('Should wrap to last pokemon, /pokemon/1', (assert) => {
  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/1')
    .expect(200)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body.previous, {
        id: 807,
        name: 'Zeraora'
      }, 'Should equal last pokemon');
    });
});

QUnit.test('Should wrap to first pokemon, /pokemon/807', (assert) => {
  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/807')
    .expect(200)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body.next, {
        id: 1,
        name: 'Bulbasaur'
      }, 'Should equal first pokemon');
    });
});

QUnit.test('Should have previous, /pokemon/500', (assert) => {
  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/500')
    .expect(200)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body.previous, {
        id: 499,
        name: 'Pignite'
      } , 'Should equal Pignite');
    });
});

QUnit.test('Should have next, /pokemon/500', (assert) => {
  const assertAsync = assert.async();
  request(app)
    .get('/pokemon/500')
    .expect(200)
    .then((response) => {
      assertAsync();
      assert.deepEqual(response.body.next, {
        id: 501,
        name: 'Oshawott'
      } , 'Should equal Oshawott');
    });
});
