const fs = require('fs'),
    Handlebars = require('handlebars'),
    helpers = require('./compiler/helpers'),
    worker = require('./compiler/worker'),
    del = require('del'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    minify = require('gulp-minify'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean-css'),
    replace = require('gulp-replace'),
    footer = require('gulp-footer'),
    header = require('gulp-header'),
    shell = require('gulp-shell'),
    rename = require('gulp-rename'),
    nodemon = require('gulp-nodemon'),
    jsoninify = require('gulp-json-minify');
    sass = require('gulp-sass')(require('sass'));

for(let key in helpers) Handlebars.registerHelper(key, helpers[key]);

const params = {
    site: 'example',//dev
    src: 'dist',
    extension: '.hbs',
    extend: {
        header: '(() => {',
        footer: '})();'
    }
};

const load = path => {
    if(!path) return;
    const file = fs.readFileSync(`${path}.json`, 'utf-8');
    if(!file) return;
    let res;
    try {
        res = JSON.parse(file);
    }
    catch(e) {}
    return res;
}

let db, template, compiled, config;

const folders = (value, next, get) => {
    let res = {};
    const scan = dir => {
        if(!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        files.map(file => {
            const path = `${dir}/${file}`;
            if(fs.lstatSync(path).isDirectory()) scan(path);
            else {
                res[path] = !get ? true : fs.readFileSync(path, 'utf-8');
                if(next) next(file, path, res[path]);
            }
        });
    };
    scan(value);
    return res;
};

const clear = async () => await del.sync([params.src]);

const prepareConfig = next => {

    const package = load('package'), 
        webConfig = load(`web/config`), 
        siteConfig = load(`web/sites/${params.site}/config`),
        version = (!package ? null : package.version) || 0,
        base = 'http://localhost:3000',
        build = {
            version,
            updated: Date.now(),
            base
        };

    config = {
        ...(webConfig || {}),
        ...(siteConfig || {}),
        ...(build || {}),
        base
    };
    fs.writeFileSync(`web/public/build.json`, JSON.stringify(build));
    next();
};

const copyAssets = () => gulp.src(['web/public/**/*', `web/sites/${params.site}/public/**/*`])
    .pipe(gulp.dest(params.src));

const copyRender = () => gulp.src('node_modules/handlebars/dist/handlebars.runtime.min.js')
    .pipe(gulp.dest(`${params.src}/scripts`));

const copyWebSocket = () => gulp.src(['node_modules/socket.io-client/dist/socket.io.min.js', 'node_modules/socket.io-client/dist/socket.io.min.js.map'])
    .pipe(gulp.dest(`${params.src}/scripts`));

const copyFiles = gulp.series(copyAssets, copyRender, copyWebSocket);

const buildMainScripts = () => gulp.src(['web/scripts/**/*.js', 'web/components/**/*.js'])
    .pipe(header(params.extend.header))
    .pipe(footer(params.extend.footer))
    .pipe(concat(`main.js`))
    .pipe(header(`let mounted = [];
    window.addEventListener('load', () => {
        mounted.map(next => next());
        mounted = [];
    });
    window.WebsiteBuilder = { 
        config: ${JSON.stringify(config) || '{}'},
        mounted: next => mounted.push(next)
    };`))
    .pipe(header(params.extend.header))
    .pipe(footer(params.extend.footer))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(replace('"use strict";', ''))
    .pipe(uglify())
    .pipe(gulp.dest(`${params.src}/scripts`));

const buildSiteScripts = () => gulp.src(`web/sites/${params.site}/scripts/**/*.js`)
    .pipe(header(params.extend.header))
    .pipe(footer(params.extend.footer))
    .pipe(concat(`site.js`))
    .pipe(header(params.extend.header))
    .pipe(footer(params.extend.footer))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(replace('"use strict";', ''))
    .pipe(uglify())
    .pipe(gulp.dest(`${params.src}/scripts`));

const buildHelpers = () => gulp.src('compiler/helpers.js')
    .pipe(replace('module.exports', 'WebsiteBuilder.helpers'))
    .pipe(header(params.extend.header))
    .pipe(footer(params.extend.footer))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(replace('"use strict";', ''))
    .pipe(uglify())
    .pipe(gulp.dest(`${params.src}/scripts`));

const buildScripts = gulp.series(buildMainScripts, buildSiteScripts, buildHelpers);

const buildMainStyles = () => gulp.src(['web/styles/**/*.scss', 'web/components/**/*.scss'])
    .pipe(sass())
    .pipe(concat(`main.css`))
    .pipe(clean())
    .pipe(gulp.dest(`${params.src}/styles`));

const buildSiteStyles = () => gulp.src(`web/sites/${params.site}/styles/**/*.scss`)
    .pipe(sass())
    .pipe(concat(`site.css`))
    .pipe(clean())
    .pipe(gulp.dest(`${params.src}/styles`));

const buildStyles = gulp.series(buildMainStyles, buildSiteStyles);

const parseTemplates = next => {
    compiled = [];
    let templates = {};
    ['web/components', `web/sites/${params.site}/components`].map(folder => {
        folders(folder, (file, path) => {
            if(file.endsWith(params.extension)) {
                const name = file.replace(params.extension, '');
                const key = path.replace(folder, '').replace(params.extension, '').replace(`${name}/${name}`, name).replace('/', '').replace(/\//g, '-');
                templates[key] = {
                    path
                };
            }
        });
    });
    console.log(`Parsed ${Object.keys(templates).length} templates`, Object.keys(templates));
    for(let key in templates) {
        templates[key].template = fs.readFileSync(templates[key].path, 'utf-8');
        if(key != 'page') {
            Handlebars.registerPartial(key, templates[key].template);
            !['head'].includes(key) && compiled.push(templates[key].path);
        }
    }
    const page = fs.readFileSync(templates['page'].path, 'utf-8')
    template = Handlebars.compile(page);
    fs.writeFileSync(`dist/templates.js`, `module.exports = ${JSON.stringify(templates) || '{}'}`);
    next();
};

const compiledTemplates = () => gulp.src('web', { 
        read: false 
    })
    .pipe(shell([`handlebars ${compiled.join(' ')} -f ${params.src}/templates.temp.js`]));

const minifyTemplates = () => gulp.src(`${params.src}/templates.temp.js`)
    .pipe(minify({
        noSource: true,
        ext: {
            min: '.js'
        }
    }))
    .pipe(rename('templates.js'))
    .pipe(gulp.dest(`${params.src}/scripts`))

const clearTemplates = async () => await del.sync([`${params.src}/templates.temp.js`]);
    
const buildTemplates = gulp.series(parseTemplates, compiledTemplates, minifyTemplates, clearTemplates);

const parseDatabase = next => {
    //const database = fs.readFileSync(`web/sites/${params.site}/db.json`, 'utf-8');
    const database = fs.readFileSync(`api/_db.json`, 'utf-8');
    try {
        db = JSON.parse(database);
    }
    catch(e) {
        console.error(e);
    }
    next();
};

const copyDatabase = () => gulp.src(`api/_db.json`)
    .pipe(jsoninify())
    .pipe(rename('db.json'))
    .pipe(gulp.dest(params.src));
    
const buildDatabase = gulp.series(parseDatabase, copyDatabase);

const parsePages = next => {
    if(db && db.routes) for(let key in db.routes) {
        key && fs.mkdirSync(`dist/${key}`, { 
            recursive: true 
        });
        fs.writeFileSync(`dist${key != '/' ? `${key}` : ''}/index.html`, template({
            config,
            ...(db.routes[key] || {}),
            ...db,
            routes: null,
            url: `${config.base}${key != '/' ? `${key}` : ''}/index.html`
        }));
    }
    next();
};

const buildPages = gulp.series(parsePages);

const compiler = gulp.series(clear, prepareConfig, copyFiles, buildScripts, buildStyles, buildTemplates, buildDatabase, buildPages);

const server = () => {
    compiler();
    return nodemon({
        script: 'server.js',
        ext: 'js',
        env: {
            NODE_ENV: 'dev',
            PORT: 3000
        },
        ignore: ['./node_modules/**']
    });
};

exports.default = compiler;

exports.start = gulp.series(compiler, () => gulp.src('server.js', { 
    read: false 
})
.pipe(shell([`node server`])));

exports.dev = async () => {
    console.log('Watching for file changes...')
    await worker(server);
    return gulp.watch([
        'package.json', 
        'api/**/*.js', 
        'compiler/**/*.js', 
        'web/config.json', 
        `web/sites/${params.site}/config.json`, 
        'web/scripts/**/*.js', 
        'web/components/**/*.js', 
        `web/sites/${params.site}/**/*.js`, 
        'web/styles/**/*.scss', 
        'web/components/**/*.scss', 
        `web/sites/${params.site}/**/*.scss`, 
        'web/components/**/*.hbs', 
        `web/sites/${params.site}/**/*.hbs`, 
        `web/sites/${params.site}/db.json`
    ], compiler);
};