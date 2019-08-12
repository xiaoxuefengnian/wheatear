const {
  getDirectoryFiles,
  getNav,
  getSidebar,
} = require('./index');

const { files } = getDirectoryFiles('zh');
const nav = getNav(files);
const sidebar = getSidebar(files);

// 可以在这里再次进行处理

module.exports = {
  nav,
  sidebar,
};


