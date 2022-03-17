const express = require('express'), 
    path = require('path'),
    Handlebars = require('handlebars'),
    helpers = require('./compiler/helpers'),
    config = require('./api/config'),
    utils = require('./api/utils'),
    headers = require('./api/headers'),
    _dev = require('./api/_dev'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

let db, emit, templates;

for(let key in helpers) Handlebars.registerHelper(key, helpers[key]);

try {
    templates = require('./dist/templates');
}
catch(e) {}

if(templates) {
    for(let key in templates) if(!!templates[key].template) Handlebars.registerPartial(key, templates[key].template);
}

io.on('connection', socket => { 
    emit = (key, value) => socket.emit(key, value);
});

app.disable('x-powered-by');

app.use(headers);

app.use(express.json(config.payload));

app.use(express.urlencoded({
    ...config.payload,
    extended: true
}));

app.use(express.static(path.join(__dirname, '/dist'), {
    maxAge: `${config.cache}`
}));

app.get('/status', (req, res) => res.send('Up and running'));

app.use((req, res, next) => {

    const ext = utils.getExtension(req.originalUrl);

    let empty;

    if(!(['html'].includes(ext) || ext.startsWith('/')) || req.originalUrl.startsWith('/api/')) empty = true;
    else {

        const route = utils.parseRoute(req.originalUrl);
        
        console.log(route)
        
        if(!db || !db.mongodb || !db.mongodb[route] || !templates || !templates.page) empty = true;
        else {

            const template = Handlebars.compile(templates.page.template);

            const html = template(db);

            if(!html) empty = true;
            else utils.setFile(`dist/${route}/index.html`, html, () => res.send(html));
        }
    }
    
    empty && next();
});

app.get('/api/dev', (req, res) => {
    db = utils.getFile('db', true);
    const r = _dev(db);
    emit && emit('data', r);
    res.send({
        res: r,
        timestamp: Date.now()
    })
});

server.listen(3000, res => {
    console.log('Server connected', res);
});