import MethodOverride from './method-override';
import BodyTransformer from './body-transformer';
import XSRF from './xsrf';
import ErrorHandling from './error-handling';

export default {
  MethodOverride: new MethodOverride(),
  BodyTransformer: new BodyTransformer(),
  XSRF: new XSRF(),
  ErrorHandling: new ErrorHandling()
};
