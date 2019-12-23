const fse = require('fs-extra');

const targetDirectory = `${process.cwd()}/docs/zh/.resources`;
const nav = fse.readFileSync(`${targetDirectory}/nav-dev.json`, 'utf-8');
const navsort = fse.readFileSync(`${targetDirectory}/nav-sort.json`, 'utf-8');
// console.log(navsort);


module.exports = (options, ctx) => {
  return {
    beforeDevServer(app, server) {
      app.get('/path/to/your/custom', function(req, res) {
        res.json({ custom: 'response' })
      })
    }
  }
}