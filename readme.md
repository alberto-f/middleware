# Middleware

One of the smallest middleware implementations out there.

No dependencies to other libraries. Works in node and the browser. Handles asynchronous and synchronous functions.

## Middleware pattern
Benefits of using the middleware pattern:
- decouple the sender from it receiver
- allows single responsability principle
- allows open/closed principle

## Usage

```javascript
import middleware from 'middleware';

/*
 * Declare middleware functions
 */
async function authenticateMiddleware(request, next){
  const isAuthenticated = await userIsAuthenticated(request)
  if(isAuthenticated) {
    next(firstMiddlewareValue);
  } else {
    throw 'Not authorised user';
  }
}

async function authorizeMiddleware(request, next){
  const isAuthorized = await authorized(request)
  if(isAuthorized) {
    next(request);
  } else {
    throw 'Not authorised user';
  }
}

/*
 * Create chain of middlewares to execute
 */
const middlewareRunner = middleware([
  authenticatedMiddleware,
  authorizedMiddleware,
  function(data, error){
    // Code
  }
]);

middlewareRunner(request);
```
