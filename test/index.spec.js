const assert = require('assert');
const middleware = require('../source/index.js');

describe('Specs for arguments passed to middleware functions', function () {
  it('should throw if receives something else than array as arguments', function () {
    assert.throws(() => middleware(1, 2));
  });

  it('should return a function when called with empty array', function () {
    assert.equal(typeof middleware([]), 'function', 'middleware returns function');
  });

  it('should return a function when called with array containing any type of arguments', function () {
    assert.equal(typeof middleware([1, function(){}, null, undefined, '']), 'function', 'middleware returns function');
  });
});

describe('Specs for function returned by middleware creator', function () {
  it('should throw if middleware was created passing array containing other than functions', function () {
    assert.throws(middleware([1, function(){}, null, undefined]), 'Array contains other values than functions');
  });

  it('should execute first middleware function if middleware was created using only functions', function (done) {
    middleware([
      function(){
        assert.ok('middleware executed');
        done();
      }
    ])();
  });

  it('should pass initial value to first middleware', function (done) {
    const initialValue = {};
    middleware([function(data){
      assert.strictEqual(data, initialValue, 'middleware receives initial value');
        done();
      }
    ])(initialValue);
  });

  it('should pass values from one middleware to another', function () {
    const initialmiddlewareValue = {};
    const firstmiddlewareValue = {};
    const secondmiddlewareValue = {};
    middleware([function(data, next){
      assert.strictEqual(data, initialmiddlewareValue, 'receives initial value');
      next(firstmiddlewareValue);
    }, function(data, next){
      assert.strictEqual(data, firstmiddlewareValue, 'receives value passed from the first middleware');
      next(secondmiddlewareValue);
    }, function(data){
      assert.strictEqual(data, secondmiddlewareValue, 'receives value passed from the second middleware');
    }], initialmiddlewareValue);
  });

  it('should pass error to last middleware', function (done) {
    const errorObject = new Error('Error has occurred');
    middleware([function(data, next){
        throw errorObject;
      }, function(data, error){
        assert.fail('it should not be executed when precedent middleware throws error');
      }, function(data, error){
        assert.equal(data, undefined, 'receives undefined data value');
        assert.strictEqual(error, errorObject, 'error is received in last middleware');
        done();
      }
    ])(0);
  });

  it('should not pass any error when middleware not throw one', function (done) {
    middleware([function(data, next){
        next(data);
      }, function(data, error){
        assert.equal(error, undefined, 'receives undefined error if prev middlewares did not throw error');
        done();
      }
    ])(0);
  });
});

/*
 *
 * TESTS
 *
 */
middleware([
  (data, next) => next(data),
  data => console.log('Spec 1: data reaches the last middleware / ' + data)
])(0); // Last middleware receives data = 0

middleware([
  (data, next) => next(data),
  (data, next) => next(data+1),
  data => console.log('Spec 2: data is transformed between middlewares reaching last one / ' + data)
])(0); // Last middleware receives data = 1

middleware([
  (data, next) => next(data),
  (data, next) => setTimeout(function(){
    next(data+100);
  }, 2000),
  data => console.log('Spec 3: async functions get executed and data reaches last middleware / ' + data)
])(1); // Last middleware receives data = 101
