const block = options => `<h3>${options.fn(this)}</h3>`;

const event = options => `<h3>${options}</h3>`;

const grid = options => `<div class="grid">${options.fn(this)}</div>`;

const form = (content, options) => {
    console.log(this)
    return  `<form>${options.fn(this)}</form>`;
};

const field = (content, options) => {
    console.log(this)
    return `<input value="">${options.fn(this)}</form>`;
}

module.exports = {
    vendor: () => 'WebsiteBuilder',
    block,
    event,
    grid,
    form,
    field
}