const forEEach = (arr, cb) => {
  for (let i = 0; i < arr.length; i++) {
    cb(arr[i]);
  }
};

let arr = [1, 2, 3];
forEEach(arr, (i) => {
  console.log(i * 2);
});
