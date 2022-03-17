const isset = val => val != null && val != undefined;

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

const slugify = (text, dash) => !text ? text : text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\//g, 'DASH').replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/DASH/g, dash || '-');

const each = (arr, next) => {
    if(!arr || !arr.length || !next) return;
    for(let i = 0; i < arr.length; i++) next(arr[i], i, arr.length == (i + 1));
};

const createElement = (tag, arg1, arg2) => {
    let args, html;
    if(arg1) {
        if(typeof arg1 == 'object') args = arg1;
        else if(typeof arg1 == 'string') html = arg1;
    }
    if(arg2) {
        if(typeof arg2 == 'object') args = arg2;
        else if(typeof arg2 == 'string') html = arg2;
    }
    const element = document.createElement(tag || 'div');
    if(html) element.innerHTML = html;
    if(args) for(let key in args) element.setAttribute(key, args[key]);
    return element;
};

const getElement = (selector, element) => (element || document).querySelector(selector);

const getElements = (selector, element) => (element || document).querySelectorAll(selector);

const getElementID = selector => document.getElementById(selector);

const getElementAttributes = element => !element ? null : element.getAttributeNames().reduce((acc, name) => ({
    ...acc, 
    [name]: element.getAttribute(name)
}), {});

WebsiteBuilder.utils = {
    isset,
    uuid,
    slugify,
    each,
    createElement,
    getElement,
    getElements,
    getElementID,
    getElementAttributes
};