import Interceptor from '../../src/interceptor';
import ResponseInterceptorChain from '../../src/response-interceptor-chain';

class StubResponse {
  constructor() {
    this.successes = [];
    this.failures = [];
    this.recoveredAt = [];
  }

  addSuccess(value) {
    this.successes.push(value);
    return this;
  }

  addFailure(value) {
    this.failures.push(value);
    return this;
  }

  addRecoveredAt(value) {
    this.recoveredAt.push(value);
    return this;
  }

  getSuccesses() {
    return this.successes;
  }

  getFailures() {
    return this.failures;
  }

  getRecoveredAt() {
    return this.recoveredAt;
  }
}

class TestInterceptor extends Interceptor {
  constructor(index) {
    super();
    this.index = index;
  }

  getIndex() {
    return this.index;
  }
}

class Accept extends TestInterceptor {
  response(res, accept, reject) {
    accept(res.addSuccess(super.getIndex()));
  }
}

class Reject extends TestInterceptor {
  response(res, accept, reject) {
    reject(res.addFailure(super.getIndex()));
  }

  responseError(error, accept, reject) {
    reject(error.addFailure(super.getIndex()));
  }
}

class Recover extends TestInterceptor {
  response(res, accept, reject) {
    accept(res.addSuccess(super.getIndex()));
  }

  responseError(error, accept, reject) {
    accept(error.addRecoveredAt(super.getIndex()));
  }
}

describe('ResponseInterceptorChain', () => {
  describe('run', () => {
    it('should accept the response unchanged when no interceptors are given', (next) => {
      const stub = new StubResponse();
      const chain = new ResponseInterceptorChain(
        [],
        (accepted) => {
          expect(accepted).to.equal(stub);
          expect(accepted.getSuccesses()).to.be.empty;
          expect(accepted.getFailures()).to.be.empty;
          next();
        },
        (rejected) => {
          expect.fail(rejected, stub, 'Expected response to be accepted but was rejected');
          next();
        }
      );

      chain.run(stub);
    });

    it('should accept the response modified by the given interceptors', (next) => {
      const stub = new StubResponse();
      const chain = new ResponseInterceptorChain(
        [new Accept(1), new Accept(2)],
        (accepted) => {
          expect(accepted.getSuccesses()).to.have.members([1, 2]);
          next();
        },
        (rejected) => {
          expect.fail(rejected, stub, 'Expected response to be accepted but was rejected');
          next();
        }
      );

      chain.run(stub);
    });

    it('should hop back into the next interceptor after a failure', (next) => {
      const stub = new StubResponse();
      const chain = new ResponseInterceptorChain(
        [new Accept(1), new Reject(2), new Reject(3), new Recover(4), new Accept(5)],
        (accepted) => {
          expect(accepted.getSuccesses()).to.have.members([1, 4, 5]);
          expect(accepted.getRecoveredAt()).to.have.members([4, 4]);
          expect(accepted.getFailures()).to.have.members([2, 3, 3]);
          next();
        },
        (rejected) => {
          expect.fail(rejected, stub, 'Expected response to be accepted but was rejected');
          next();
        }
      );
      chain.run(stub);
    });
  });
});
