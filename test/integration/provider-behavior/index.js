import basicBehavior from './basic';
import methodOverrideBehavior from './method-override';
import errorBehavior from './error';
import authBehavior from './auth';
import chunkedBehavior from './chunked';
import progressBehavior from './progress';

export default function shouldBehaveLikeaProvider() {
  describe('request', () => {
    basicBehavior();
    methodOverrideBehavior();
    errorBehavior();
    authBehavior();
    chunkedBehavior();
    progressBehavior();
  });
}
