import { isObject } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import Interceptor from '../interceptor';

export default class BodyTransformer extends Interceptor {
  request(request, accept, reject) {
    const body = request.body();

    if (isObject(body) && !isFile(body) && !isFormData(body) && !isBlob(body)) {
      const json = JSON.stringify(body);

      request.body(json);
    }

    accept(request);
  }
}
