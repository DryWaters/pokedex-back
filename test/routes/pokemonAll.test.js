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

QUnit.module('Pokemon Endpoint Testing');

QUnit.test('Valid Single Pokemon Request, /pokemon?id=1&range=1', (assert) => {
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

QUnit.test('Valid Range of Pokemon, /pokemon?id=5&range=5', (assert) => {
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

QUnit.test('Invalid ID Pokemon Request, /pokemon?id=0&range=1', (assert) => {
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

QUnit.test('Invalid ID Pokemon Request, /pokemon?id=-1&range=1', (assert) => {
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

QUnit.test('Invalid Range Pokemon Request, /pokemon?id=1&range=0', (assert) => {
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

QUnit.test('Invalid Character ID Pokemon Request, ' +
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

QUnit.test('Invalid Characters ID Pokemon Request, ' +
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

QUnit.test('Invalid Characters Range Pokemon Request, ' +
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

QUnit.test('Exceeds ID Pokemon Request, ' +
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

QUnit.test('Exceeds Range Pokemon Request, ' +
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

QUnit.test('Empty Pokemon Request, /pokemon/', (assert) => {
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
