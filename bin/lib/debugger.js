var StackTrace = require('stacktrace-js')

let handler = {
  apply (cible, thisArg, listArg) {
    console.info('')
    console.info('->', ...listArg)
    let trace = StackTrace.getSync()
    let frame = trace[1]
    console.info('')
    console.info('in ' + frame.getFileName() + ' line ' + frame.getLineNumber() + ', col ' + frame.getColumnNumber());
    console.info('Called in ' + frame.getFunctionName() + ' function.')
    console.info('')
  }
}
console.log = new Proxy (console.log, handler)
module.exports = function (msg) {
  // console.log(msg)
  console.trace(msg)
}
// module.exports.debug = function (msg){
//   let logLineDetails = ((new Error().stack).split("at ")[3]).trim();
//   console.log('DEBUG', new Date().toUTCString(), logLineDetails, msg);
// }

// module.exports.smallLog = function (methodName) {
//   const originalMethod = console[methodName];
//   console[methodName] = (...args) => {
//     let initiator = 'unknown place';
//     try {
//       throw new Error();
//     } catch (e) {
//       if (typeof e.stack === 'string') {
//         let isFirst = true;
//         for (const line of e.stack.split('\n')) {
//           const matches = line.match(/^\s+at\s+(.*)/);
//           if (matches) {
//             if (!isFirst) { // first line - current function
//                             // second line - caller (what we are looking for)
//               initiator = matches[1];
//               break;
//             }
//             isFirst = false;
//           }
//         }
//       }
//     }
//     originalMethod.apply(console, [...args, '\n', `  at ${initiator}`]);
//   };
// }
