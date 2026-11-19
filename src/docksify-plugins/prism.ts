// Docsify's bundle exposes its Prism as window.Prism before dist/main.js runs.
// The language components reference the free identifier `Prism`, so they
// register against that instance. Do not import 'prismjs' itself (second copy).
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-groovy'
import 'prismjs/components/prism-makefile'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-hcl'
import 'prismjs/components/prism-yaml'
