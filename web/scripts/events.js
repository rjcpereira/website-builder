const click = (element, next) => element.addEventListener('click', event => {
    event.preventDefault();
    next?.();
});

const change = (element, next) => element.addEventListener('change', event => {
    event.preventDefault();
    const index = element.selectedIndex,
        text = element.children[index].innerHTML.trim();
    console.log(element.value, text);
    next?.();
});

WebsiteBuilder.events = {
    click,
    change
};