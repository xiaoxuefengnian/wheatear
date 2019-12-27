# 自动化

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

## 目标

自动识别文档目录，并生成相应的导航栏和侧边栏

以本项目 wheatear 为例

当前 docs/ 下的目录结构如下

```bash
.
├── .vuepress
│   ├── config.js
│   ├── nav
│   │   └── zh.js
│   └── public
├── README.md
└── zh
    └── guide
        ├── auto.md
        ├── create.md
        ├── deploy.md
        └── locales.md
```

## 获取文档目录

::: warning

这里约定文档目录下同一层级只有目录或者只有文档，且至少有一个目录或者文档

:::

在 docs/.vuepress/nav/ 目录下新建 index.js，代码如下

```javascript
const path = require("path");
const fse = require("fs-extra");

// 查找到目标目录 docs
const source = path.resolve(__dirname);
const targetDirectory = "docs";
const lastIndex = source.lastIndexOf(targetDirectory);
const targetPath = source.substring(0, lastIndex + targetDirectory.length);

// 排除以下文件
const excludes = [".DS_Store"];

/**
 * 获取当前目录下的文档/目录
 * @param {string} currentDirectoryPath 包含 lang 及之后的路径
 */
function getDirectoryFiles(currentDirectoryPath) {
  const directoryFiles = fse
    .readdirSync(`${targetPath}/${currentDirectoryPath}`, {
      encoding: "utf8",
      withFileTypes: true
    })
    .filter(dirent => !excludes.includes(dirent.name));

  let hasReadme = false;
  // 没有子目录的目录
  let isPureDirectory = true;

  const files = directoryFiles
    .map(dirent => {
      const file = {
        originName: dirent.name,
        // 用于处理路径相关的 = dirent.name 只在README.md 时 = ''
        pathName: dirent.name,
        text: undefined,
        link: `/${currentDirectoryPath}/${dirent.name}`,
        children: undefined,
        hasReadme: undefined,
        isPureDirectory: true
      };
      if (dirent.isFile()) {
        if (dirent.name === "README.md") {
          file.text = "";
          file.pathName = "";
          hasReadme = true;
        } else {
          file.text = getFileName(dirent);
        }
      } else if (dirent.isDirectory()) {
        const childrenFiles = getDirectoryFiles(
          `${currentDirectoryPath}/${dirent.name}`
        );
        file.text = getFileName(dirent);
        file.children = childrenFiles.files;
        file.hasReadme = childrenFiles.hasReadme;
        file.isPureDirectory = childrenFiles.isPureDirectory;
        isPureDirectory = false;
      }
      return file;
    })
    .sort((a, b)
    => (a.pathName ? a.pathName - b.pathName : -1)); // 始终将 README.md 放在第一个

  return {
    files,
    hasReadme,
    isPureDirectory
  };
}

/**
 * 获取文档/目录名称
 * @param {Object} dirent
 */
function getFileName(dirent) {
  const fileName = dirent.name;
  // 形如 数字.name.类型 其中数字和类型是可选的
  // 例 1.aa.md | bb.md | cc
  const lastIndex = fileName.lastIndexOf(".");
  if (lastIndex === -1) return fileName;

  let nameWithoutSuffix;
  if (dirent.isFile()) {
    nameWithoutSuffix = fileName.substring(0, lastIndex);
  } else {
    nameWithoutSuffix = fileName;
  }
  const firstIndex = fileName.indexOf(".");
  if (firstIndex === -1) return nameWithoutSuffix;
  return nameWithoutSuffix.substring(firstIndex + 1);
}

/**
 * 获取导航栏
 * @param {Array} files
 */
function getItems(files) {
  return files.map(file => {
    if (Array.isArray(file.children) && file.children.length > 0) {
      if (file.isPureDirectory) {
        return {
          text: file.text,
          // 没有 README.md 时取第一个子文件
          link: file.hasReadme
            ? `${file.link}/`
            : `${file.link}/${file.children[0].pathName}`
        };
      }
      return {
        text: file.text,
        items: getItems(file.children)
      };
    }
  });
}

/**
 * 获取侧边栏
 * @param {Array} files
 */
function getSidebar(files) {
  const sidebar = {};
  const getChildren = files => {
    files.forEach(file => {
      if (file.isPureDirectory) {
        sidebar[`${file.link}/`] = [
          {
            title: file.text,
            collapsable: false,
            children: file.children.map(x => x.pathName)
          }
        ];
      } else if (file.children.length > 0) {
        getChildren(file.children);
      }
    });
  };
  getChildren(files);
  return sidebar;
}

module.exports = {
  getDirectoryFiles,
  getNav: getItems,
  getSidebar
};
```

::: tip

对于包含 README.md 的目录，导航栏指向目录，否则指向第一个文件的位置

可以在给目录/文件命名时，添加 x. 前缀用以指定排序

:::

示例获得的导航栏结构如下

```json
[{ "text": "guide", "link": "/zh/guide/auto" }]
```

侧边栏结构如下

```json
{
  "/zh/guide/": [
    {
      "title": "guide",
      "collapsable": false,
      "children": ["auto", "create", "deploy", "locales"]
    }
  ]
}
```

修改 docs/.vuepress/nav/zh.js 为

```javascript
const { getDirectoryFiles, getNav, getSidebar } = require("./index");

const { files } = getDirectoryFiles("zh");
const nav = getNav(files);
const sidebar = getSidebar(files);

// 可以在这里再次进行处理

module.exports = {
  nav,
  sidebar
};
```

这里保留 zh.js 方便对不同语言进行再次配置

## 修改配置

打开 docs/.vuepress/config.js

```js
// 头部添加
const { nav, sidebar } = require('./nav/zh');

// 修改导航栏、侧边栏
themeConfig = {
  ...,
  nav,
  sidebar,
  ...,
}
```

::: warning

添加/修改目录/文件名称后，需重新启动开发环境/重新编译

:::

## 优化

**2019.12.06**

通过修改文件名（添加 x. 前缀）的方式排序一直隐隐觉得不合理

比如 在地址里会带上这些额外的标识符，个人觉得这样的地址不稳定，抵触使用（在其他文档引用）

```
原
http://localhost:8080/zh/9.搭建/4.auto.html#修改配置
期望
http://localhost:8080/zh/搭建/auto.html#修改配置
```

因此一直思考换一种方式来实现排序，同时能较为方便地改变顺序

```
思路：将目录树以树结构（对象数组）形式记入 nav.json
     将每一个文件/目录的相对路径以数组形式记入 nav-sort.json
     以下标的先后顺序标识父目录下所有子文件/目录间的先后顺序
     新增的文件/目录默认放在父目录下所有子文件/目录的最后
     以 node 的读写能力实现可视化改变文件/目录顺序
实现：前文已实现在生成导航栏目录前读取目录树
     现增加读取 nav-sort.json
     将原根据文件名排序改为据此排序目录树
     将排序后的目录树存入 nav.json
排序：node 读取 nav.json 显示
     node 读取 nav-sort.json 标记出未排序的文件
     可视化操作调整排序
     将结果以相同格式覆写 nav.json 和 nav-sort.json
优点：较原方案可保持干净的文件/目录名
     可方便地调整排序
     地址看得舒服
缺陷：修改文件/目录名称会导致所有后代的排序失效（原方案不会）
     改变目录的层级也会导致所有后代的排序失效（原方案不会）
确认：缺陷中的前两条在目录结构定型后基本不会发生
     且可以手动修改 nav.json 和 nav-sort.json
     因此影响较小
注意：关于忽略文件
     因为 development 环境的目录是包含 production 环境的目录的
     而 nav-sort.json 仅由 node 修改（development 环境下）
     即修改较大的集合的排序
     所以可以排除两个环境目录不相等而导致因环境切换缺少部分排序的情况
补充：可将 nav.json 细分为 nav-dev.json 和 nav-prod.json
```

在 docs/.vuepress/nav/index.js 中已经实现对目录树的获取

添加 读取 nav-sort.json

修改 sort 逻辑

添加覆写 nav.json

删去前缀相关逻辑 后的 index.js 代码为

```javascript
const path = require("path");
const fse = require("fs-extra");

// 查找到目标目录 docs
const source = path.resolve(__dirname);
const targetDirectory = "docs";
const lastIndex = source.lastIndexOf(targetDirectory);
const targetPath = source.substring(0, lastIndex + targetDirectory.length);

// 获取参数 第一个参数为环境 development/production
const { argv } = process;
const index = argv.indexOf("--");
let options = [];
let env = "development";
if (index !== -1) {
  options = argv.slice(index + 1);
  env = ["development", "production"].includes(options[0]) ? options[0] : env;
}

// 默认 排除以下文件 其余在 .productionignore 中设置
// 始终需要排除的目录
const excludesEver = [".DS_Store", ".resources"];
const excludes = [".productionignore"];

/**
 * 获取当前目录下的文档/目录
 * @param {string} currentDirectoryPath 包含 lang 及之后的路径
 */
function getDirectoryFiles(currentDirectoryPath) {
  let [excludesFiles, ignoreList, sortList] = [[], [], []];

  try {
    sortList = fse.readFileSync(
      `${process.cwd()}/docs/${currentDirectoryPath}/.resources/nav-sort.json`,
      "utf-8"
    );
  } catch (error) {}

  if (env === "development") {
    excludesFiles = [...excludes];
  } else if (env === "production") {
    try {
      const ignoreFile = fse.readFileSync(
        `${targetPath}/${currentDirectoryPath}/.productionignore`,
        "utf8"
      );
      ignoreList = ignoreFile.split("\n");
    } catch (error) {}
    excludesFiles = [...excludes, ...ignoreList];
  }
  excludesFiles = excludesFiles.map(x => `${currentDirectoryPath}/${x}`);

  const getSort = (a, b) => {
    // 始终将 README.md 放在第一个
    if (a.originName === "README.md") return -1;
    // 无排序文件 按本地排序规则排序
    if (sortList.length === 0) return a.originName.localeCompare(b.originName);
    // 使用相对路径做标识，可避免同名在不同目录下无法唯一标识的情况
    const [aIndex, bIndex] = [
      sortList.indexOf(a.link),
      sortList.indexOf(b.link)
    ];
    if (aIndex === -1 && bIndex === -1)
      return a.originName.localeCompare(b.originName);
    if (bIndex === -1) return -1;
    if (aIndex === -1) return 1;
    return aIndex - bIndex;
  };

  const func = path => {
    const directoryFiles = fse
      .readdirSync(`${targetPath}/${path}`, {
        encoding: "utf8",
        withFileTypes: true
      })
      .filter(
        dirent =>
          !excludesEver.includes(dirent.name) &&
          !excludesFiles.includes(`${path}/${dirent.name}`)
      );

    let hasReadme = false;
    // 没有子目录的目录
    let isPureDirectory = true;

    const files = directoryFiles
      .map(dirent => {
        const file = {
          originName: dirent.name,
          // 用于处理路径相关的 = dirent.name 只在README.md 时 = ''
          pathName: dirent.name,
          text: undefined,
          link: `/${path}/${dirent.name}`,
          children: undefined,
          hasReadme: undefined,
          isPureDirectory: true
        };
        if (dirent.isFile()) {
          if (dirent.name === "README.md") {
            file.text = "";
            file.pathName = "";
            hasReadme = true;
          } else {
            file.text = getFileName(dirent);
          }
        } else if (dirent.isDirectory()) {
          const childrenFiles = func(`${path}/${dirent.name}`);
          file.text = getFileName(dirent);
          file.children = childrenFiles.files;
          file.hasReadme = childrenFiles.hasReadme;
          file.isPureDirectory = childrenFiles.isPureDirectory;
          isPureDirectory = false;
        }
        return file;
      })
      .sort((a, b) => getSort(a, b));

    // 不同环境写入不同文件
    fse.writeFileSync(
      `${process.cwd()}/docs/${currentDirectoryPath}/.resources/nav${
        env === "development" ? "-dev" : "-prod"
      }.json`,
      JSON.stringify(files)
    );

    return {
      files,
      hasReadme,
      isPureDirectory
    };
  };

  return func(currentDirectoryPath);
}

/**
 * 获取文档/目录名称
 * @param {Object} dirent
 */
function getFileName(dirent) {
  const fileName = dirent.name;
  // 形如 name.类型 其中数字和类型是可选的
  // 例 bb.md | cc
  const lastIndex = fileName.lastIndexOf(".");
  if (lastIndex === -1) return fileName;

  let nameWithoutSuffix;
  if (dirent.isFile()) {
    nameWithoutSuffix = fileName.substring(0, lastIndex);
  } else {
    nameWithoutSuffix = fileName;
  }
  return nameWithoutSuffix;
}

/**
 * 获取导航栏
 * @param {Array} files
 */
function getItems(files) {
  return files.map(file => {
    if (Array.isArray(file.children) && file.children.length > 0) {
      if (file.isPureDirectory) {
        return {
          text: file.text,
          // 没有 README.md 时取第一个子文件
          link: file.hasReadme
            ? `${file.link}/`
            : `${file.link}/${file.children[0].pathName}`
        };
      }
      return {
        text: file.text,
        items: getItems(file.children)
      };
    }
  });
}

/**
 * 获取侧边栏
 * @param {Array} files
 */
function getSidebar(files) {
  const sidebar = {};
  const getChildren = files => {
    files.forEach(file => {
      if (file.isPureDirectory) {
        sidebar[`${file.link}/`] = [
          {
            title: file.text,
            collapsable: false,
            children: file.children.map(x => x.pathName)
          }
        ];
      } else if (file.children.length > 0) {
        getChildren(file.children);
      }
    });
  };
  getChildren(files);
  return sidebar;
}

module.exports = {
  getDirectoryFiles,
  getNav: getItems,
  getSidebar
};
```

至此，【实现】部分完成，【排序】部分将在另一篇【[插件](/zh/搭建/plugins.html)】中讲解。

::: tip

采用 node 而不使用 [FileSaver.js](https://github.com/eligrey/FileSaver.js/) 的原因是 FileSaver.js 无法直接保存至指定位置

:::
