const fse = require('fs-extra');
const path = require('path');
const bodyParser = require('body-parser');

const standardResponse = (isSuccess, msgCode, response) => ({
  resultCode: isSuccess ? 1 : 0,
  data: isSuccess ? (response || null) : null,
  msg: {
    1: '成功',
    2: '失败'
  }[msgCode] || '没有消息',
})

const targetDirectory = `${process.cwd()}/docs/zh/.resources`;
const navTreePath = `${targetDirectory}/nav-dev.json`;
const navSortPath = `${targetDirectory}/nav-sort.json`;

module.exports = (options, ctx) => {
  return {
    name: 'nav-sort-server',
    beforeDevServer(app, server) {
      /**
       * 基于 express
       * @see http://www.expressjs.com.cn/4x/api.html
       */

      // for parsing application/json
      app.use(bodyParser.json());
      // for parsing application/x-www-form-urlencodedƒ
      app.use(bodyParser.urlencoded({ extended: true }));

      /* 页面 */

      // 页面 导航菜单配置
      app.get('/page/nav', function (req, res) {
        // res.sendFile(`${process.cwd()}/docs/.vuepress/plugins/nav-sort-server/pages/navsort/index.html`);
        // 更好的路径获取方案
        res.sendFile(path.resolve(__dirname, 'pages/navsort/index.html'));
      })

      /* 服务 */

      // 获取 导航菜单
      app.get('/serve/nav/tree', function (req, res) {
        const nav = fse.readFileSync(navTreePath, 'utf-8');
        res.json(standardResponse(true, 1, nav));
      })
      // 更新 导航菜单
      app.post('/serve/nav/tree', function (req, res) {
        const { data } = req.body;
        fse.writeFileSync(navTreePath, JSON.stringify(data));
        res.json(standardResponse(true, 1));
      })

      // 获取 导航菜单排序
      app.get('/serve/nav/sort', function (req, res) {
        const navsort = fse.readFileSync(navSortPath, 'utf-8');
        res.json(standardResponse(true, 1, navsort));
      })
      // 更新 导航菜单排序
      app.post('/serve/nav/sort', function (req, res) {
        const { data } = req.body;
        fse.writeFileSync(navSortPath, JSON.stringify(data));
        res.json(standardResponse(true, 1));
      })
    }
  }
}