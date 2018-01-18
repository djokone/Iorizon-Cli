
let capitalize = function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
let escape = function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

let forEach = function (iterator, callback) {
  if (Array.isArray(iterator)) {
    let i = 0
    for (let iterate of iterator) {
      callback(iterate, i)
      i++
    }  
  } else {
    for (let iterate in iterator) {
      let data = iterator[iterate]
      let key = iterate
      callback(data, key)
    }
  }
}
module.exports = {
  capitalize,
  escape,
  forEach
}