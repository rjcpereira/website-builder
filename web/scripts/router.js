const push = route => {
    if(!route) return;
    const path = `${window.location.origin}${route}`;
    console.log(path, route)
    window.history.pushState({ 
        path 
    }, '', path);
    fetch(`/api/${route}`)
        .then(res => res.json())
        .then(res => {
            if(res && res.main) {
                setTimeout(() => {
                    const main = WebsiteBuilder.utils.getElement('main');
                    if(main) main.innerHTML = res.main; 
                }, 2000)
            }
        })
};

WebsiteBuilder.router = {
    push
};