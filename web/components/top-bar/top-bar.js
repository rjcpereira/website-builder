/* WebsiteBuilder.mounted(() => {
    const elements = WebsiteBuilder.utils.getElements(`a`);
    WebsiteBuilder.utils.each(elements, element => WebsiteBuilder.events.click(element, () => {
        const key = element.getAttribute('href');
        console.log(key);
        WebsiteBuilder.router.push(key);
    }))
}) */