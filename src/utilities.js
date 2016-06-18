function isFile(value) {
  return toString.call(value) === '[object File]';
}

function isFormData(value) {
  return toString.call(value) === '[object FormData]';
}

function isBlob(value) {
  return toString.call(value) === '[object Blob]';
}
