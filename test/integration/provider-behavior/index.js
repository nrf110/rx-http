import basicBehavior from './basic';
import authBehavior from './auth';

export default function shouldBehaveLikeaProvider() {
  describe('request', () => {
    basicBehavior();
  });
}
