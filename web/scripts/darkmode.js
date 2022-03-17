let darkmode;

WebsiteBuilder.dark = status => {
    darkmode = !WebsiteBuilder.utils.isset(status) ? !darkmode : status;
    !darkmode ? document.body.classList.remove('dark') : document.body.classList.add('dark');
};