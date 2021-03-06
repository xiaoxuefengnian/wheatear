# 忽略文件

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

目的

部分文档仅个人可见，在开发环境下显示，在生产环境下隐藏

## 方案

### 区分方式

考虑设置一个类似于 process.env.NODE_ENV 来区分当前环境

但 vuepress 项目下打印出的 process.env 中并不包含 NODE_ENV

::: tip

vue 项目中是在 build/build.js 中设置 process.env.NODE_ENV = 'production'

:::

可以参考给系统设置 NODE_ENV 这个环境变量的方式引入

### 代码修改

这里是我给出的另一个方案，通过指令来传入参数

在 package.json 中修改 scripts

```json
"docs:dev": "vuepress dev docs -- development",
"docs:build": "vuepress build docs -- production",
```

::: tip

在 shell 中传入的参数都要使用 -- 隔开，这个 -- 被视作 npm run 命令参数的结束，-- 后面的内容都
会原封不动地传给运行的命令

:::

修改 docs/.vuepress/nav/index.js 为

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
const index = argv.indexof("--");
let options = [];
let env = "development";
if (index !== -1) {
  options = argv.slice(index + 1);
  env = ["development", "production"].includes(options[0]) ? options[0] : env;
}

// 默认 排除以下文件 其余在 .productionignore 中设置
const excludes = [".DS_Store", ".productionignore"];

/**
 * 获取当前目录下的文档/目录
 * @param {string} currentDirectoryPath 包含 lang 及之后的路径
 */
function getDirectoryFiles(currentDirectoryPath) {
  let [excludesFiles, ignoreList] = [[], []];
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

  const func = path => {
    const directoryFiles = fse
      .readdirSync(`${targetPath}/${path}`, {
        encoding: "utf8",
        withFileTypes: true
      })
      .filter(dirent => !excludesFiles.includes(dirent.name));

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
      .sort((a, b)
      => (a.pathName ? a.pathName - b.pathName : -1)); // 始终将 README.md 放在第一个

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

在 docs/zh/ 下添加 .productionignore 文件，填入目录或文件名称即可，这里的名称不包含路径

::: tip

考虑到在多语言的情况下，同一个文件在不通语言下名称可能不通，所以设置为需要在每个语言的文件夹下分别设置 .productionignore 文件，在 .productionignore 缺失的情况下也不影响使用

:::

## 优化

### 2019.11.13

忽略文件的文件名匹配规则由名称全匹配改为路径全匹配后的 index.js 的修改部分

```javascript{3,4,27,37,38}
// 默认 排除以下文件 其余在 .productionignore 中设置
// 始终需要排除的目录
const excludesEver = [".DS_Store"];
const excludes = [".productionignore"];

/**
 * 获取当前目录下的文档/目录
 * @param {string} currentDirectoryPath 包含 lang 及之后的路径
 */
function getDirectoryFiles(currentDirectoryPath) {
  let [excludesFiles, ignoreList] = [[], []];
  if (env === "development") {
    excludesFiles = [...excludes];
  } else if (env === "production") {
    try {
      const ignoreFile = fse.readFileSync(
        `${targetPath}/${currentDirectoryPath}/.productionignore`,
        {
          encoding: "utf8",
          withFileTypes: true
        }
      );
      ignoreList = ignoreFile.split("\n");
    } catch (error) {}
    excludesFiles = [...excludes, ...ignoreList];
  }
  excludesFiles = excludesFiles.map(x => `${currentDirectoryPath}/${x}`);

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
      .sort((a, b)
      => (a.pathName ? a.pathName - b.pathName : -1)); // 始终将 README.md 放在第一个

    return {
      files,
      hasReadme,
      isPureDirectory
    };
  };

  return func(currentDirectoryPath);
}
```
