WebsiteBuilder.mounted(() => {
    const elements = WebsiteBuilder.utils.getElements(`[data-dropdown]`);
    WebsiteBuilder.utils.each(elements, element => {
        WebsiteBuilder.events.change(element, value => {
            console.log(value)
        })
    });
})