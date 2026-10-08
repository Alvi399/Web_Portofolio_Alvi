const ejs = require('ejs');

const template = `<button data-desc="<%= desc %>"></button>`;
const html = ejs.render(template, { desc: 'My "awesome" & \'cool\' project' });
console.log(html);
