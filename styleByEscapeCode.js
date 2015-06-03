var starters = {
    1: { 'font-weight': 'bold' },
    3: { 'font-variant': 'italic' },
    4: { 'text-decoration': 'underline' },
    30: { color: 'black' },
    31: { color: 'red' },
    32: { color: 'green' },
    33: { color: 'yellow' },
    34: { color: 'blue' },
    35: { color: 'magenta' },
    36: { color: 'cyan' },
    37: { color: 'white' },
    90: { color: 'gray' },
    40: { background: 'black' },
    41: { background: 'red' },
    42: { background: 'green' },
    43: { background: 'yellow' },
    45: { background: 'blue' },
    46: { background: 'cyan' },
    47: { background: 'white' },
}

var breakers = {
    22: { 'font-weight': 'normal' },
    23: { 'font-variant': 'italic' },
    24: { 'text-decoration': 'none' },
    39: { color: 'inherit' },
    49: { background: 'inherit' }
}

var styleByEscapeCode = function(code) {
    code = +code
    var style = starters[code]

    if (!style) {
	style = breakers[code]
	if (style) style.breaker = true
    }
    
    if (!style) {
	style = { breaker: true }
    }

    return style
}

module.exports = styleByEscapeCode
