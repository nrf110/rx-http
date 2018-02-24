import basicBehavior from './basic';
import errorBehavior from './error';
import authBehavior from './auth';
import chunkedBehavior from './chunked';
import progressBehavior from './progress';
import uploadBehavior from './upload';

export default function shouldBehaveLikeaProvider() {
  describe('request', () => {
    basicBehavior();
    errorBehavior();
    authBehavior();
    chunkedBehavior();
    // progressBehavior();
    // uploadBehavior();
  });
}
