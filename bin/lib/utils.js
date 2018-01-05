
let capitalize = function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
let escape = function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
module.exports = {
  capitalize,
  escape
}