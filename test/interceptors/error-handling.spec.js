import Interceptors from '../../src/interceptors';
import Response from '../../src/response';

function failed(message, next) {
  return function(err) {
    throw new Error(message);
  };
}

describe('ErrorHandling', () => {
  describe('response', () => {
    it('should reject a non 20x status', (next) => {
      const mockResponse = {
        status: 400,
        statusText: 'Not Found',
        getAllResponseHeaders: function() {
          return {};
        }
      }
      const res = new Response(mockResponse, null, null, null);

      Interceptors.ErrorHandling.response(res, failed("Shouldn't call accept", next), (rejected) => {
        expect(rejected).to.equal(res);
        next();
      });
    });

    it('should accept a 20x status', (next) => {
      const mockResponse = {
        status: 204,
        statusText: 'Not Found',
        getAllResponseHeaders: function() {
          return {};
        }
      }
      const res = new Response(mockResponse, null, null, null);

      Interceptors.ErrorHandling.response(res, (transformed) => {
        expect(transformed).to.equal(res);
        next();
      }, failed("Shouldn't call reject", next));
    });
  });
});
