const _ = require('lodash');


function getValueOfAllParents(fun, obj) {
  let clazz = obj;
  const parentValues = [];
  while (clazz) {
    if (_.has(clazz, fun)) {
      parentValues.push(clazz[fun]());
      clazz = Object.getPrototypeOf(clazz);
    } else {
      clazz = null;
    }
  }
  return _.reduceRight(parentValues, (result, el) => _.assign(result, el), {});
}


module.exports = {
  getValueOfAllParents,
};
