// Import the dist builds: they inline their CSS, while the packages' src entries
// import .css files that nothing in index.html loads. Each one prepends itself to
// window.$docsify.plugins, so this module must load after config.ts.
import './docsify-global';
import 'docsify/dist/plugins/search.min.js';
import 'docsify-pagination/dist/docsify-pagination.min.js';
import 'docsify-copy-code/dist/docsify-copy-code.min.js';
import 'docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js';
