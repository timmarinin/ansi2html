var assert = require('assert')
var Readable = require('stream').Readable
var bl = require('bl')
var ansi2html = require('..')

function expect(expected, done) {
    return bl(function(err, buf) {
	if (err) throw err
	assert.equal(buf.toString(), expected)
	done()
    })
}

describe('ansi2html basic abilities', function() {
    it('should pipe transparently if no escape color codes are presented', function(done) {
	var s = Readable()
	s.push('Hello world')
	s.push(null)
	s
	    .pipe(ansi2html())
	    .pipe(expect('Hello world', done))
    })
    
    it('should close spans when no reset code is presented', function(done) {
	var s = Readable()
	s.push('\u001b\[31mHello world')
	s.push(null)
	s
	    .pipe(ansi2html())
	    .pipe(expect('<span style="color: red;">Hello world</span>', done))
    })

    it('should transform color sequences to inline styled spans by default', function(done) {
	var s = Readable()
	s.push('\u001b\[31;42mHello world\u001b\[m')
	s.push(null)
	s
	    .pipe(ansi2html())
	    .pipe(expect('<span style="color: red;"><span style="background: green;">Hello world</span></span>', done))

    })
})

describe('ansi2html configuration abilities', function() {
    it('should tranform color sequences to class styled spans if passed option style:class', function(done) {
	var s = Readable()
	s.push('\u001b\[32mHello world')
	s.push(null)
	s
	    .pipe(ansi2html({ style: 'class' }))
	    .pipe(expect('<span class="ansi2html-color-green">Hello world</span>', done))
    })

    it('should add prefix to classes', function(done) {
	var s = Readable()
	s.push('\u001b\[32mHello world')
	s.push(null)
	s
	    .pipe(ansi2html({ style: 'class', prefix: 'somePrefix-' }))
	    .pipe(expect('<span class="somePrefix-color-green">Hello world</span>', done))
    })
})

describe('ansi2html complex strings handling', function() {
    it('should correctly stop color span when there is a breaker', function(done) {
	var s = Readable()
	s.push('Hello \u001b\[32mworld\u001b\[m!')
	s.push(null)

	s
	    .pipe(ansi2html())
	    .pipe(expect('Hello <span style="color: green;">world</span>!', done))
    })
})
