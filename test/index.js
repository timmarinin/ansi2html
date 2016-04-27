var path = require('path')
var test = require('tape')
var fs = require('fs')
var Readable = require('stream').Readable
var bl = require('bl')
var ansi2html = require('..')

function expect(expected, t) {
    return bl(function(err, buf) {
	if (err) throw err
	t.equal(buf.toString(), expected, 'html equals expected')
    })
}


test('should pipe transparently if no escape color codes are presented', function(t) {
    t.plan(1)
    var s = Readable()
    s.push('Hello world')
    s.push(null)
    s
	.pipe(ansi2html())
	.pipe(expect('Hello world', t))
})

test('should close spans when no reset code is presented', function(t) {
    t.plan(1)
    var s = Readable()
    s.push('\u001b\[31mHello world')
    s.push(null)
    s
	.pipe(ansi2html())
	.pipe(expect('<span style="color: red;">Hello world</span>', t))
})

test('should transform color sequences to inline styled spans by default', function(t) {
    t.plan(1)
    var s = Readable()
    s.push('\u001b\[31;42mHello world\u001b\[m')
    s.push(null)
    s
	.pipe(ansi2html())
	.pipe(expect('<span style="color: red; background: green;">Hello world</span>', t))

})

test('should tranform color sequences to class styled spans if passed option style:class', function(t) {
    t.plan(1)
    var s = Readable()
    s.push('\u001b\[32mHello world')
    s.push(null)
    s
	.pipe(ansi2html({ style: 'class' }))
	.pipe(expect('<span class="ansi2html-color-green">Hello world</span>', t))
})

test('should add prefix to classes', function(t) {
    t.plan(1)
    var s = Readable()
    s.push('\u001b\[32mHello world')
    s.push(null)
    s
	.pipe(ansi2html({ style: 'class', prefix: 'somePrefix-' }))
	.pipe(expect('<span class="somePrefix-color-green">Hello world</span>', t))
})

test('should correctly stop color span when there is a breaker', function(t) {
    t.plan(1)
    var s = Readable()
    s.push('Hello \u001b\[32mworld\u001b\[m!')
    s.push(null)

    s
	.pipe(ansi2html())
	.pipe(expect('Hello <span style="color: green;">world</span>!', t))
})

test('should correctly handle reset if there was no color set', function(t) {
    t.plan(1)
    var s = fs.createReadStream(path.join(__dirname, 'fixture.txt'), 'utf8')
    s
        .pipe(ansi2html())
        .pipe(expect([
            'start',
            '<span style="font-weight: bold; color: blue;">this is blue</span>',
            'normal',
            '<span style="font-weight: bold; color: blue;">blue again</span>',
        ].join('\n') + '\n', t))
})
