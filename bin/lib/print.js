var Table = require('cli-table-redemption')

class print extends Table {
  constructor (chars) {
    let chars = {
      'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
      'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 
      'bottom-right': '╝', 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
      'right': '║' , 'right-mid': '╢' , 'middle': '│'
    }

  }
}