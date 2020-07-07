/*
 *
 * Middleware implementation
 *
 */
const _nextErrorHandler = (fn, data, arrayOfFunctions) => {
  try {
    fn(data, arrayOfFunctions);
  } catch (e) {
    const length = arrayOfFunctions.length;
    if(length <= 1) {
      throw e;
    }

    // Executed last middleware passing the error
    arrayOfFunctions[length-1](undefined, e);
  }
}

const _next = (data, arrayWithFunctions) => {
  const [fn, ...restOfFunctions] = arrayWithFunctions;

  restOfFunctions.length === 0
    ? fn(data) // last middleware does not received 'next' function
    : fn(data, (response) => _next(response, restOfFunctions))
};

function middleware(functionArray){
  if(!Array.isArray(functionArray)){
    throw `expected an Array of functions but got ${JSON.stringify(functionArray)}`;
  }

  return data => _nextErrorHandler(_next, data, functionArray)
}

module.exports = middleware;
