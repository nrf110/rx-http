import { methodOverride } from './method-override';
import { bodyTransformer } from './body-transformer';
import { xsrf } from './xsrf';
import { errorHandling } from './error-handling';

export default {
  MethodOverride: methodOverride,
  BodyTransformer: bodyTransformer,
  XSRF: xsrf,
  ErrorHandling: errorHandling
};
