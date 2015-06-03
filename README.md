ansi2html
========

![Dependencies](https://david-dm.org/marinintim/ansi2html.svg)

It is a stream to transform terminal color sequences to html tags.

## Usage
```
var ansi2html = require('ansi2html')

var s = Readable()
s.push('\u001b\[32m;Hello, Github')
s.push(null)

s.pipe(ansi2html()).pipe(process.stdout)
// will output <span style="color: green;">Hello, Github</span>
```

## Options

There is a couple of options to trigger. Pass them as first argument to `ansi2html`

```
var mySuperStream = ansi2html({ style: 'class', prefix: 'mySuperPrefix-' })
s.pipe(mySuperStream).pipe(process.stdout)
// will output <span class="mySuperPrefix-color-green">Hello, Github</span>
```

`style`: 'inline' | 'class'. Inline is default and will apply styles, well, inline.
Class instead only adds classes to span, you should style them. Classes are named
with this pattern: `prefix-property-value`.

`prefix`: `ansi2html-` | String. Has effect only with `style: 'class'`.


## Why

This module was written to help with @marinintim/webify-workshop
