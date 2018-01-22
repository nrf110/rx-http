import XHRProvider from './xhr';

const provider = (() => {
  // TODO: Implement FetchProvider and use feature-detection to determine which to use
  return XHRProvider;
})();

export default provider;
