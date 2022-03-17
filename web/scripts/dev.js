WebsiteBuilder.dev = status => {
    WebsiteBuilder.config.dev = !WebsiteBuilder.utils.isset(status) ? !WebsiteBuilder.config.dev : status;
};
