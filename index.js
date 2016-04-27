var through = require('through2')
var styleByEscapeCode = require('./styleByEscapeCode.js')

function inliner(style) {
    return Object.keys(style).map(function(k) {
	if (style[k]) {
	    return k + ': ' + style[k] + ';'
	}
    }).join(' ')
}

function classifier(style, prefix) {
    return Object.keys(style).map(function(k) {
	if (style[k]) {
	    return prefix + k + '-' + style[k]
	}
    }).join(' ')
}

function getReplacer(opts) {
   return function replaceColor(match, offset, str) {
	var res = ""
	var styles = match.slice(2, -1).split(';').map(styleByEscapeCode)

        var breakers = []
        var colors = []

        styles.forEach(function(style) {
            if (style.breaker) breakers.push(style)
            else colors.push(style)
        })

	if (breakers.length && opts.remains > 0) {
	    res += "</span>".repeat(breakers.length)
	    opts.remains -= breakers.length
	}

	if (colors.length) {
	    colors.forEach(function(style) {
		res += '<span ' + 
                    (opts.style === 'inline' ?
                     'style="' + inliner(style) :
                     'class="' + classifier(style, opts.prefix)) +
                    '">'
		opts.remains += 1
	    })
	}

	return res;
    }
}



module.exports = function(opts) {
    var rg = new RegExp("\u001b\\[[0-9;]*m", 'g')
    
    opts = opts || {}
    opts.style = opts.style === 'class' ? 'class' : 'inline'
    opts.prefix = opts.prefix || 'ansi2html-'
    opts.remains = 0

    var replacer = getReplacer(opts)


    function onEnd(done) {
	if (opts.remains) {
	    this.push('</span>'.repeat(opts.remains))
	    opts.remains = 0
	}	
	done()
    }    
    
    function onChunk(buf, _, next) {
	this.push(buf.toString().replace(rg, replacer))
	next()
    }
    
    return through(onChunk, onEnd)
}
