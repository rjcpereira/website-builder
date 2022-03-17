WebsiteBuilder.mounted(() => {
    const selector = 'data-modal-trigger';
    const elements = WebsiteBuilder.utils.getElements(`[${selector}]`);
    WebsiteBuilder.utils.each(elements, element => WebsiteBuilder.events.click(element, () => {
        const key = element.getAttribute(selector);
        const modal = WebsiteBuilder.utils.getElement(`[data-modal="${key}"]`);
        modal.classList.add('show');
        WebsiteBuilder.events.click(modal, () => modal.classList.remove('show'));//multiplos clicks!!!!
    }))
})