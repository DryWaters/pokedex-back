const request = require('supertest');
const app = require('../../app');

const POKEMON = require('../../constants/pokemonConstants');

const errorResult = {
  'error': 'Invalid search',
  'valid search queries': {
    'id': '1-807',
    'range': '(id + range - 1) < 807',
    'name': 'Not empty',
    'types': '1-18, 1-18',
    'ability': 'Not empty',
  },
};

QUnit.module('Pokemon Range Testing');

QUnit.test('Should return Bulbasaur for search valid single Pokemon request, ' +
    ' /pokemon?id=1&range=1', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 1,
        'name': 'Bulbasaur',
        'types': [
          'poison',
          'grass',
        ],
        'image_path': '/sprites/pokemon/large/1.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=1&range=1')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?id=1&range=1, with error' + error);
      });
});

QUnit.test('Should return 5 Pokemon with a search of valid range of Pokemon, ' +
    ' /pokemon?id=5&range=5', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 5,
        'name': 'Charmeleon',
        'types': [
          'fire',
        ],
        'image_path': '/sprites/pokemon/large/5.png',
      },
      {
        'id': 6,
        'name': 'Charizard',
        'types': [
          'fire',
          'flying',
        ],
        'image_path': '/sprites/pokemon/large/6.png',
      },
      {
        'id': 7,
        'name': 'Squirtle',
        'types': [
          'water',
        ],
        'image_path': '/sprites/pokemon/large/7.png',
      },
      {
        'id': 8,
        'name': 'Wartortle',
        'types': [
          'water',
        ],
        'image_path': '/sprites/pokemon/large/8.png',
      },
      {
        'id': 9,
        'name': 'Blastoise',
        'types': [
          'water',
        ],
        'image_path': '/sprites/pokemon/large/9.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=5&range=5')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?id=5&range=5, with error' + error);
      });
});

QUnit.test('Should return error:  Invalid ID Pokemon Request, ' +
    '/pokemon?id=0&range=1', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=0&range=1')
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
        assert.ok(false, 'FAIL /pokemon?id=0&range=1, with error' + error);
      });
});

QUnit.test('Should return error:  Invalid ID Pokemon Request, ' +
    '/pokemon?id=-1&range=1', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=-1&range=1')
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
        assert.ok(false, 'FAIL /pokemon?id=-1&range=1, with error' + error);
      });
});

QUnit.test('Should return error:  Invalid Range Pokemon Request, ' +
    '/pokemon?id=1&range=0', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=1&range=0')
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
        assert.ok(false, 'FAIL /pokemon?id=1&range=0, with error' + error);
      });
});

QUnit.test('Should return error:  Invalid Character ID Pokemon Request, ' +
    '/pokemon?id=A&range=0', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=A&range=0')
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
        assert.ok(false, 'FAIL /pokemon?id=A&range=0, with error' + error);
      });
});

QUnit.test('Should return error:  Invalid Characters ID Pokemon Request, ' +
    '/pokemon?id=Aads][a]&range=0', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=Aads][a]&range=0')
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
        assert.ok(false, 'FAIL /pokemon?id=Aads][a]&range=0, '+
          'with error' + error);
      });
});

QUnit.test('Should return error:  Invalid Characters Range Pokemon Request, ' +
    '/pokemon?id=1&range=aalkjsdS#*', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=1&range=aalkjsdS#*')
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
        assert.ok(false, 'FAIL /pokemon?id=1&range=aalkjsdS#*, '+
          'with error' + error);
      });
});

QUnit.test('Should return error:  Exceeds ID Pokemon Request, ' +
    '/pokemon?id=+1MaxID&range=1', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=' + (POKEMON.NUMBER_OF_POKEMON + 1) + '&range=1')
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
        assert.ok(false, 'FAIL /pokemon?id=+1MaxID&range=1, ' +
          'with error' + error);
      });
});

QUnit.test('Should return error: Exceeds Range Pokemon Request, ' +
    '/pokemon?id=800ID&range=10', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=800&range=10')
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
        assert.ok(false, 'FAIL /pokemon?id=800&range=10 ' +
          'with error' + error);
      });
});

QUnit.test('Should return error on empty Pokemon, /pokemon/', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon/')
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
        assert.ok(false, 'FAIL /pokemon/ with error' + error);
      });
});

QUnit.module('Pokemon search by name testing');

QUnit.test('Should return Venusaur for valid lowercase Pokemon name search, ' +
    '/pokemon?name=Venusaur', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 3,
        'name': 'Venusaur',
        'types': [
          'poison',
          'grass',
        ],
        'image_path': '/sprites/pokemon/large/3.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?name=Venusaur')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?name=Venusaur, with error' + error);
      });
});

QUnit.test('Should return Venusaur for valid all uppercase ' +
    'Pokemon name search, /pokemon?name=VENUSAUR', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 3,
        'name': 'Venusaur',
        'types': [
          'poison',
          'grass',
        ],
        'image_path': '/sprites/pokemon/large/3.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?name=VENUSAUR')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?name=VENUSAUR, with error' + error);
      });
});

QUnit.test('Should fail on blank Pokemon name search, ' +
    '/pokemon?name=', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?name=')
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
        assert.ok(false, 'FAIL /pokemon?name=, with error' + error);
      });
});

QUnit.test('Should return empty result for no name match, ' +
    '/pokemon?name=1', (assert) => {
  const expectedResult = {
    'pokemon': [],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?name=1')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?name=1, with error' + error);
      });
});

QUnit.module('Pokemon ability search by name testing');

QUnit.test('Should return Reshiram for valid lowercase ability name search, ' +
    '/pokemon?ability=bob', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 643,
        'name': 'Reshiram',
        'types': [
          'fire',
          'dragon',
        ],
        'image_path': '/sprites/pokemon/large/643.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?ability=bob')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?ability=bob, with error' + error);
      });
});

QUnit.test('Should return Reshiram for valid all uppercase ' +
    'ability name search, /pokemon?name=BOB', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 643,
        'name': 'Reshiram',
        'types': [
          'fire',
          'dragon',
        ],
        'image_path': '/sprites/pokemon/large/643.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?ability=BOB')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?ability=BOB, with error' + error);
      });
});

QUnit.test('Should fail on blank ability name search, ' +
    '/pokemon?ability=', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?ability=')
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
        assert.ok(false, 'FAIL /pokemon?ability=, with error' + error);
      });
});

QUnit.test('Should return empty result for no ability match, ' +
    '/pokemon?ability=1', (assert) => {
  const expectedResult = {
    'pokemon': [],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?ability=1')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?ability=1, with error' + error);
      });
});

QUnit.module('Pokemon search by types');

QUnit.test('Should return Marshadow for valid dual type search, ' +
    '/pokemon?types=2,8', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 802,
        'name': 'Marshadow',
        'types': [
          'fighting',
          'ghost',
        ],
        'image_path': '/sprites/pokemon/large/802.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=2,8')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?types=2,8, with error' + error);
      });
});

QUnit.test('Should return 45 Pokemon for valid single type search ' +
    '/pokemon?types=16', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=16')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.equal(response.body.pokemon.length, 45,
            'Returned Pokemon number does not equal, actual: ' +
            response.body.pokemon.length + ' expected: 45'
        );
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?types=16, with error' + error);
      });
});

QUnit.test('Should fail on blank types search, ' +
    '/pokemon?types=', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=')
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
        assert.ok(false, 'FAIL /pokemon?types=, with error' + error);
      });
});

QUnit.test('Should return empty result for no dual types match, ' +
    '/pokemon?types=1,4', (assert) => {
  const expectedResult = {
    'pokemon': [],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=1,4')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?types=1,4, with error' + error);
      });
});

QUnit.test('Should return empty result for triple types match, ' +
    '/pokemon?types=1,2,3', (assert) => {
  const expectedResult = {
    'pokemon': [],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=1,2,3')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?types=1,2,3, with error' + error);
      });
});

QUnit.test('Should fail on invalid single type search, ' +
    '/pokemon?types=-1', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=-1')
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
        assert.ok(false, 'FAIL /pokemon?types=-1, with error' + error);
      });
});

QUnit.test('Should fail on invalid dual type search, ' +
    '/pokemon?types=-1,20', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=-1,20')
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
        assert.ok(false, 'FAIL /pokemon?types=-1,20, with error' + error);
      });
});

QUnit.test('Should fail on invalid dual type search (space), ' +
    '/pokemon?types=1, 10', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=1, 10')
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
        assert.ok(false, 'FAIL /pokemon?types=-1, 10, with error' + error);
      });
});

QUnit.test('Should fail on single type search (above max), ' +
    '/pokemon?types=19', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?types=19')
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
        assert.ok(false, 'FAIL /pokemon?types=19, with error' + error);
      });
});

QUnit.module('Pokemon search by weaknesses');

QUnit.test('Should return valid weaknesses multiple search, ' +
    '/pokemon?weaknesses=2,4,6', (assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 459,
        'name': 'Snover',
        'types': [
          'grass',
          'ice',
        ],
        'image_path': '/sprites/pokemon/large/459.png',
      },
      {
        'id': 460,
        'name': 'Abomasnow',
        'types': [
          'grass',
          'ice',
        ],
        'image_path': '/sprites/pokemon/large/460.png',
      },
    ],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=2,4,6')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?weaknesses=2,4,6, with error' + error);
      });
});

QUnit.test('Should return 44 Pokemon for valid single weakness search ' +
    '/pokemon?weaknesses=16', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=16')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.equal(response.body.pokemon.length, 44,
            'Returned Pokemon number does not equal, actual: ' +
            response.body.pokemon.length + ' expected: 45'
        );
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?weaknesses=16, with error' + error);
      });
});

QUnit.test('Should fail on blank weaknesses search, ' +
    '/pokemon?weaknesses=', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=')
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
        assert.ok(false, 'FAIL /pokemon?weaknesses=, with error' + error);
      });
});

QUnit.test('Should return empty result for no dual weaknesses match, ' +
    '/pokemon?types=1,2', (assert) => {
  const expectedResult = {
    'pokemon': [],
  };

  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=1,2')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?weaknesses=1,2, with error' + error);
      });
});

QUnit.test('Should fail on invalid single weakness search, ' +
    '/pokemon?weaknesses=-1', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=-1')
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
        assert.ok(false, 'FAIL /pokemon?weaknesses=-1, with error' + error);
      });
});

QUnit.test('Should fail on invalid dual weakness search, ' +
    '/pokemon?weaknesses=-1,20', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=-1,20')
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
        assert.ok(false, 'FAIL /pokemon?weaknesses=-1,20, with error' + error);
      });
});

QUnit.test('Should fail on invalid dual weakness search (space), ' +
    '/pokemon?weaknesses=1, 10', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=1, 10')
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
        assert.ok(false, 'FAIL /pokemon?weaknesses=-1, 10, with error' + error);
      });
});

QUnit.test('Should fail on single weakness search (above max), ' +
    '/pokemon?weaknesses=19', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?weaknesses=19')
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
        assert.ok(false, 'FAIL /pokemon?weaknesses=19, with error' + error);
      });
});

QUnit.module('Pokemon search by all search types');

QUnit.test('Should return Bulbasaur for multiple valid search, ' +
    '/pokemon?id=1&range=1&name=bulb&ability=over&types=4,12&weaknesses=3',
(assert) => {
  const expectedResult = {
    'pokemon': [
      {
        'id': 1,
        'name': 'Bulbasaur',
        'types': [
          'poison',
          'grass',
        ],
        'image_path': '/sprites/pokemon/large/1.png',
      },
    ],
  };
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=1&range=1&name=bulb&ability=over' +
        '&types=4,12&weaknesses=3')
      .expect('Content-Type', /json/)
      .expect('Content-Length', JSON.stringify(expectedResult)
          .length.toString())
      .expect(200)
      .then((response) => {
        assertAsync();
        assert.deepEqual(response.body, expectedResult,
            'JSON does not equal, actual: ' + response.body +
            ' expected: ' + expectedResult);
      })
      .catch((error) => {
        assertAsync();
        assert.ok(false, 'FAIL /pokemon?id=1&range=1&name=bulb&ability=' +
          'over&types=4,12&weaknesses=3' + error);
      });
});

QUnit.test('Should fail when one search type is invalid, ' +
    '/pokemon?id=1&range=1&name=bulb&ability=over&types=4,19', (assert) => {
  const assertAsync = assert.async();
  request(app)
      .get('/pokemon?id=1&range=1&name=bulb&ability=over&types=4,19')
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
        assert.ok(false, 'FAIL /pokemon?id=1&range=1&name=bulb&' +
          'ability=over&types=4,19, with error' + error);
      });
});
