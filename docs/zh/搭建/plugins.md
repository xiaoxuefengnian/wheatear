# 插件

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

## 导航菜单排序

目的

将现有的根据 nav-sort.json 对目录树排序的操作进行可视化处理

同时为目录/文件排序提供一个可用的 node 服务器

因为 vuepress 本身在 dev 下已经使用了 webpack-dev-server 作为开发环境的服务器

所以考虑直接使用该 server 而不是再新建一个

### 开发插件

新建 docs/.vuepress/plugins/ 目录用于存放插件

在目录下新建插件目录 docs/.vuepress/plugins/nav-sort-server

在 nav-sort-server 目录下新建 index.js

```javascript
const fse = require("fs-extra");
const path = require("path");
const bodyParser = require("body-parser");

const standardResponse = (isSuccess, msgCode, response) => ({
  resultCode: isSuccess ? 1 : 0,
  data: isSuccess ? response || null : null,
  msg:
    {
      1: "成功",
      2: "失败"
    }[msgCode] || "没有消息"
});

const targetDirectory = `${process.cwd()}/docs/zh/.resources`;
const navTreePath = `${targetDirectory}/nav-dev.json`;
const navSortPath = `${targetDirectory}/nav-sort.json`;

module.exports = (options, ctx) => {
  return {
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
      app.get("/page/nav", function(req, res) {
        // res.sendFile(`${process.cwd()}/docs/.vuepress/plugins/nav-sort-server/pages/navsort/index.html`);
        // 更好的路径获取方案
        res.sendFile(path.resolve(__dirname, "pages/navsort/index.html"));
      });

      /* 服务 */

      // 获取 导航菜单
      app.get("/serve/nav/tree", function(req, res) {
        const nav = fse.readFileSync(navTreePath, "utf-8");
        res.json(standardResponse(true, 1, nav));
      });
      // 更新 导航菜单
      app.post("/serve/nav/tree", function(req, res) {
        const { data } = req.body;
        fse.writeFileSync(navTreePath, JSON.stringify(data));
        res.json(standardResponse(true, 1));
      });

      // 获取 导航菜单排序
      app.get("/serve/nav/sort", function(req, res) {
        const navsort = fse.readFileSync(navSortPath, "utf-8");
        res.json(standardResponse(true, 1, navsort));
      });
      // 更新 导航菜单排序
      app.post("/serve/nav/sort", function(req, res) {
        const { data } = req.body;
        fse.writeFileSync(navSortPath, JSON.stringify(data));
        res.json(standardResponse(true, 1));
      });
    }
  };
};
```

参考 [beforeDevServer](https://vuepress.vuejs.org/zh/plugin/option-api.html#beforedevserver)

### 引入插件

在 docs/.vuepress/config.js 中添加

```javascript
plugins: [
  [require('./plugins/nav-sort-server')],
],
```

### 配置页面

因为 vuepress 是 Vue 驱动的静态网站生成器，所以考虑直接使用 vue 编写页面

至于如何引入 vue 文件，可以往 webpack-dev-server 及 Markdown 转 Vue 的中间过程方向思考

取巧的是，本项目使用了 vuepress 的默认主题，根据 [特定页面的自定义布局](https://vuepress.vuejs.org/zh/theme/default-theme-config.html#特定页面的自定义布局) 可以实现快速引入

这里采用 设置 作为这一类功能的目录

新建 docs/zh/设置/导航菜单排序.md

```markdown
---
layout: Navsort
---
```

新建 docs/.vuepress/components/Navsort.vue

依据默认主题的 Layouts.vue 改写，保留了 Sidebar 和 Navbar

```vue
<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>

    <Sidebar :items="sidebarItemsPlus" @toggle-sidebar="toggleSidebar">
      <slot name="sidebar-top" slot="top" />
      <slot name="sidebar-bottom" slot="bottom" />
    </Sidebar>

    <!-- 通过类名使用默认主题的样式 -->
    <main class="page">
      <!-- 通过类名使用默认主题的样式 -->
      <div class="theme-default-content content__default">
        <h1>导航菜单排序</h1>

        <section>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
        </section>

        <section class="badge-desc">
          <span v-for="badge in badges" :key="badge.type">
            <el-badge :type="badge.type" is-dot> </el-badge>
            {{ badge.desc }}
          </span>

          <span class="sort-info">
            <span>未排序个数：{{ unsortedLinksLength }}</span>
            <span>排序已改变个数：{{ changedLinksLength }}</span>
            <el-button
              @click="handleSave"
              :disabled="
                changedLinksLength === 0 && unsortedLinksLength.length === 0
              "
              type="primary"
              circle
              size="mini"
              >存</el-button
            >
          </span>
        </section>

        <section>
          <el-tree
            :data="navTree"
            node-key="link"
            default-expand-all
            draggable
            @node-drag-end="handleDragEnd"
            icon-class="el-icon-s-flag"
            :filter-node-method="filterNode"
            :props="defaultProps"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                class="custom-tree-node-text"
                :class="`custom-tree-node-text-${sortType(data.link)}`"
              >
                {{ data.originName }}
              </span>
              <el-badge :type="sortType(data.link)" is-dot> </el-badge>
            </span>
          </el-tree>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from "@parent-theme/components/Navbar.vue";
import Sidebar from "@parent-theme/components/Sidebar.vue";
import { resolveSidebarItems } from "@theme/util";

import axios from "axios";
import qs from "qs";
// 引入 element-ui
import { Button, Tree, Badge, Input, Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

export default {
  components: {
    Sidebar,
    Navbar,
    [Button.name]: Button,
    [Tree.name]: Tree,
    [Badge.name]: Badge,
    [Input.name]: Input
  },

  data() {
    return {
      isSidebarOpen: false,

      defaultProps: {
        children: "children",
        label: "originName"
      },

      badges: [
        {
          type: "success",
          desc: "已排序"
        },
        {
          type: "warning",
          desc: "排序已改变"
        },
        {
          type: "info",
          desc: "未排序"
        }
      ],

      navTree: [],
      navSort: [],

      originNavTreeSort: [],

      filterText: ""
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      );
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar
        },
        userPageClass
      ];
    },

    /**
     * 给 sidebarItems 赋名称
     * 因为 YAML front matter 未获取到一级标题
     */
    sidebarItemsPlus() {
      if (this.sidebarItems.length > 0) {
        this.sidebarItems[0].children.forEach(x => {
          x.title = /\/([^/]+)\.html/.exec(x.path)[1];
        });
      }
      return this.sidebarItems;
    },

    changedLinksLength() {
      return this.originNavTreeSort.filter((x, i) => {
        return i !== this.currentNavTreeSort.findIndex(y => y === x);
      }).length;
    },

    unsortedLinksLength() {
      return this.currentNavTreeSort.length - this.navSort.length;
    },

    currentNavTreeSort() {
      const newSort = [];
      const recursion = array => {
        array.forEach(x => {
          newSort.push(x.link);
          if (Array.isArray(x.children) && x.children.length > 0) {
            recursion(x.children);
          }
        });
      };
      recursion(this.navTree);
      return newSort;
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });

    this.init();
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
    },

    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },

    DefaultValues() {
      return {
        originNavTreeSort: []
      };
    },

    init() {
      Promise.all([this.getNavTree(), this.getNavSort()])
        .then(() => {
          this.originNavTreeSort = JSON.parse(
            JSON.stringify(this.DefaultValues().originNavTreeSort)
          );
          const recursion = array => {
            array.forEach(x => {
              this.originNavTreeSort.push(x.link);
              if (Array.isArray(x.children) && x.children.length > 0) {
                recursion(x.children);
              }
            });
          };
          recursion(this.navTree);
        })
        .catch(() => {});
    },

    async getNavTree() {
      return axios
        .get("/serve/nav/tree")
        .then(res => {
          const { data } = res.data;
          this.navTree = JSON.parse(data);
        })
        .catch(() => {
          Message.error("获取【导航菜单树】失败");
        });
    },

    async getNavSort() {
      return axios
        .get("/serve/nav/sort")
        .then(res => {
          const { data } = res.data;
          this.navSort = JSON.parse(data);
        })
        .catch(() => {
          Message.error("获取【导航菜单排序】失败");
        });
    },

    async setNavTree(tree) {
      return axios({
        url: "/serve/nav/tree",
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        data: { data: tree }
      })
        .then(() => {})
        .catch(() => {
          Message.error("设置【导航菜单树】失败");
        });
    },

    async setNavSort(sort) {
      return axios({
        url: "/serve/nav/sort",
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        data: { data: sort }
      })
        .then(res => {
          const { resultCode } = res.data;
          if (resultCode === 1) {
            this.init();
          }
        })
        .catch(() => {
          Message.error("设置【导航菜单排序】失败");
        });
    },

    handleSave() {
      Promise.all([
        this.setNavTree(this.navTree),
        this.setNavSort([...this.currentNavTreeSort])
      ])
        .then(() => {})
        .catch(() => {});
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.link.indexOf(value) !== -1;
    },

    sortType(link) {
      const originIndex = this.originNavTreeSort.findIndex(x => x === link);
      const currentIndex = this.currentNavTreeSort.findIndex(x => x === link);
      if (originIndex === currentIndex) {
        if (this.navSort.includes(link)) {
          // 已排序
          return "success";
        } else {
          // 未排序
          return "info";
        }
      }
      // 排序已改变
      return "warning";
    },

    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // 拖拽放置未成功
      if (dropType === "none") return;
    },

    allowDrop(draggingNode, dropNode, type) {
      // 不能改变菜单层级
      if (type === "inner") return false;
      // 只能改变同层级前后顺序
      return draggingNode.parent === dropNode.parent;
    },

    allowDrag(draggingNode) {
      return true;
    }
  }
  // end
};
</script>

<style scoped>
.theme-default-content section {
  margin: 10px 0;
}

.badge-desc {
  font-size: 12px;
  color: #aaa;
}

.badge-desc .el-badge {
  top: 2px;
  margin-left: 8px;
}

.sort-info {
  margin-left: 10px;
}

.sort-info > span {
  margin-right: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node-text {
  padding: 2px 3px;
}
.custom-tree-node-text-warning {
  color: #fff;
  background-color: #e6a23c;
}
.custom-tree-node-text-info {
  color: #fff;
  background-color: #909399;
}
</style>
```

:::tip
在 docs/zh/.productionignore 中添加 "设置"

以在生产环境下隐藏设置目录 详见【[忽略文件](/zh/搭建/ignore.html)】
:::

### 注意事项

因为服务中是通过 nav-dev.json 获取的目录树

而非通过分析目录结构（在 docs/.vuepress/nav/index.js 中实现，并最终写入 nav-dev.json）获得

因此当开发环境启动后的目录变化比如添加了一个文件，不会在 设置/导航菜单排序 的页面中体现

同样的，该变化也不会在页面的导航栏或侧边栏中体现

这时，重新启动开发环境即可（会重新分析目录结构，生成 nav-dev.json）

另，本方案可能不是最好的方案，不过可以作为解决方案之一，也相对适合本项目的现有进度

## 最近更新列表

目的

提供一个按更新时间倒序排列的文章快速入口

因为已有官方插件 [last-update](https://vuepress.vuejs.org/zh/plugin/official/plugin-last-updated.html#使用)

所以参考其源码 node_modules/@vuepress/plugin-last-updated/index.js

### 开发插件

新建 docs/.vuepress/plugins/last-updated-files/index.js

```javascript
const path = require("path");
const spawn = require("cross-spawn");
const { includesFiles } = require("../../nav/zh");

const lastUpdatedOfAllFiles = {};

module.exports = (options = {}, context) => ({
  extendPageData($page) {
    const timestamp = getGitLastUpdatedTimeStamp($page._filePath);
    if (includesFiles.includes($page.relativePath) && timestamp) {
      lastUpdatedOfAllFiles[$page.relativePath] = {
        title: $page.title || /\/([^/]+)\.md/.exec($page.relativePath)[1],
        path: $page.path,
        timestamp
      };
    }
    $page.lastUpdatedOfAllFiles = lastUpdatedOfAllFiles;
  }
});

function getGitLastUpdatedTimeStamp(filePath) {
  let lastUpdated;
  try {
    lastUpdated =
      parseInt(
        spawn
          .sync("git", ["log", "-1", "--format=%at", path.basename(filePath)], {
            cwd: path.dirname(filePath)
          })
          .stdout.toString("utf-8")
      ) * 1000;
  } catch (e) {
    /* do not handle for now */
  }
  return lastUpdated;
}
```

为了区分开发环境和生产环境

修改 docs/.vuepress/nav/index.js

```javascript
// ... some code
let [excludesFiles, ignoreList, sortList] = [[], [], []];

const includesFiles = [];

// ... some code

if (dirent.isFile()) {
  includesFiles.push(`${path}/${dirent.name}`);
  if (dirent.name === "README.md") {
    file.text = "";
    file.pathName = "";
    hasReadme = true;
  } else {
    file.text = getFileName(dirent);
  }
}

// ... some code

// getSort 的返回值修改为
return Object.assign(func(currentDirectoryPath), { includesFiles });
```

修改 docs/.vuepress/nav/zh.js 为

```javascript
const { getDirectoryFiles, getNav, getSidebar } = require("./index");

const { files, includesFiles } = getDirectoryFiles("zh");
const nav = getNav(files);
const sidebar = getSidebar(files);

// 可以在这里再次进行处理

module.exports = {
  nav,
  sidebar,
  includesFiles
};
```

### 引入插件

在 docs/.vuepress/config.js 中添加

```javascript
plugins: [
  [require('./plugins/last-updated-files')],
],
```

### 使用插件

考虑直接在首页上展示

详见【[首页](/zh/搭建/home.html#首页)】代码
