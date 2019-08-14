exports.validUsername = (nickname) => {
  return /^\w*$/.exec(nickname) !== null;
}

exports.findIndex = (arr, username) => {
  var len = arr.length;

  while (len--) {
    if (arr[len].username === username) {
      return len;
    }
  }

  return -1;
}
