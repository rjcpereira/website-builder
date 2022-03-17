const fs = require('fs');

const getExtension = url => {
    return !url ? null : url.split('.').pop();
}

const parseRoute = url => {
    if(!url) return;
    let value = (!url.startsWith('/') ? url : url.replace('/', '')).replace('index.html', '');
    return !value.endsWith('/') ? value : value.slice(0, -1);
}

const getFile = (url, parse) => {
    if(!url) return;
    /* let next, parse;
    if(arg1) {
        if(typeof arg1 == 'function') next = arg1;
        else parse = arg1;
    }
    if(arg2) {
        if(typeof arg2 == 'function') next = arg2;
        else parse = arg2;
    } */
    const name = `dist/${url}${!parse ? '' : '.json'}`;
    if(!fs.existsSync(name)) return;
    const res = fs.readFileSync(name, 'utf-8');
    let parsed;
    if(res && parse) try {
        parsed = JSON.parse(res);
    }
    catch(e) {}
    return !parse ? res : parsed;
}

const setFile =  (url, data, next) => {
    if(!url) return next();
    const save = () => fs.writeFile(`dist/${url}`, data, err => next(!err ? data : null));
    const dir = !url.includes('.') ? url : url.substring(0, url.lastIndexOf("/"));
    !dir ? save() : fs.mkdir(`dist/${dir}`, { 
        recursive: true 
    }, err => !err ? save() : next());
}

module.exports = {
    getExtension,
    parseRoute,
    getFile,
    setFile
};