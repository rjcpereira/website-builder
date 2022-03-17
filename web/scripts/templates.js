const process = (template, html) => {
    if(!template || !html) return;
    const element = WebsiteBuilder.utils.getElementID(template);
    if(!element) return;
    const updated = WebsiteBuilder.utils.createElement('div', html);
    if(!updated || !updated.firstChild) element.outerHTML = html;
    else element.innerHTML = updated.firstChild.innerHTML;
};

let body = {};

const update = data => {

    WebsiteBuilder.config.dev && console.log('Received socket data', data);

    if(!Handlebars || !Handlebars.templates || !data) return;

    if(!Handlebars.partials || !Object.keys(Handlebars.partials).length) {
        Handlebars.partials = {};
        for(let key in Handlebars.templates) Handlebars.partials[key.replace('.hbs', '')] = Handlebars.templates[key];
    }

    if(WebsiteBuilder.helpers && (!Handlebars.helpers || !Object.keys(Handlebars.helpers).length || !Handlebars.helpers.WebsiteBuilder)) for(let key in WebsiteBuilder.helpers) Handlebars.registerHelper(key, WebsiteBuilder.helpers[key]);

    body = {
        ...(body || {}),
        ...(data || {})
    };

    ['highlights', 'latest', 'main'].map(template => {
        const render = Handlebars.templates[`${template}.hbs`];
        render && process(template, render(body));
    });
}

WebsiteBuilder.mounted(() => {

    const suffix = `?v=${WebsiteBuilder.config.updated}`, attrs = {
        async: true
    };

    WebsiteBuilder.config.dev && console.log('Fetching renderer & templates');

    WebsiteBuilder.lazyload(`${WebsiteBuilder.config.base}/scripts/helpers.js`, attrs, suffix, () => {
            
        WebsiteBuilder.config.dev && console.log('Helpers loaded');
    });

    WebsiteBuilder.lazyload(`${WebsiteBuilder.config.base}/scripts/${WebsiteBuilder.config.scripts.render}`, attrs, () => {
        WebsiteBuilder.config.dev && console.log('Render loaded');
        WebsiteBuilder.lazyload(`${WebsiteBuilder.config.base}/scripts/templates.js`, attrs, suffix, () => {
            
            WebsiteBuilder.config.dev && console.log('Templates loaded');

            WebsiteBuilder.lazyload(`${WebsiteBuilder.config.base}/scripts/${WebsiteBuilder.config.scripts.socket}.js`, attrs, () => {

                WebsiteBuilder.config.dev && console.log('SocketIO ready');

                const socket = io(WebsiteBuilder.config.base);

                socket.on("data", res => update(res));
            });
        });
    });
});