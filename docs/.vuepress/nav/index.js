const path = require('path');
const fse = require('fs-extra');

// 查找到目标目录 docs
const source = path.resolve(__dirname);
const targetDirectory = 'docs';
const lastIndex = source.lastIndexOf(targetDirectory);
const targetPath = source.substring(0, lastIndex + targetDirectory.length);

// 获取参数 第一个参数为环境 development/production
const { argv } = process;
const index = argv.indexOf('--');
let options = [];
let env = 'development';
if (index !== -1) {
  options = argv.slice(index + 1);
  env = ['development', 'production'].includes(options[0]) ? options[0] : env;
}

// 默认 排除以下文件 其余在 .productionignore 中设置
// 始终需要排除的目录
const excludesEver = [
  '.DS_Store',
  '.resources',
];
const excludes = [
  '.productionignore',
];

/**
 * 获取当前目录下的文档/目录
 * @param {string} currentDirectoryPath 包含 lang 及之后的路径
 */
function getDirectoryFiles(currentDirectoryPath) {
  let [excludesFiles, ignoreList, sortList] = [[], [], []];

  const includesFiles = [];

  try {
    sortList = fse.readFileSync(`${process.cwd()}/docs/${currentDirectoryPath}/.resources/nav-sort.json`, 'utf-8');
  } catch (error) {

  }

  if (env === 'development') {
    excludesFiles = [...excludes];
  } else if (env === 'production') {
    try {
      const ignoreFile = fse.readFileSync(`${targetPath}/${currentDirectoryPath}/.productionignore`, 'utf8');
      ignoreList = ignoreFile.split('\n');
    } catch (error) {

    }
    excludesFiles = [...excludes, ...ignoreList];
  }
  excludesFiles = excludesFiles.map(x => `${currentDirectoryPath}/${x}`);

  const getSort = (a, b) => {
    // 始终将 README.md 放在第一个
    if (a.originName === "README.md") return -1;
    // 无排序文件 按本地排序规则排序
    if (sortList.length === 0) return a.originName.localeCompare(b.originName);
    // 使用相对路径做标识，可避免同名在不同目录下无法唯一标识的情况
    const [aIndex, bIndex] = [sortList.indexOf(a.link), sortList.indexOf(b.link)];
    if (aIndex === -1 && bIndex === -1) return a.originName.localeCompare(b.originName);
    if (bIndex === -1) return -1;
    if (aIndex === -1) return 1;
    return aIndex - bIndex;
  }

  const func = (path) => {
    const directoryFiles = fse.readdirSync(`${targetPath}/${path}`, {
      encoding: 'utf8',
      withFileTypes: true,
    }).filter(dirent => !excludesEver.includes(dirent.name) && !excludesFiles.includes(`${path}/${dirent.name}`));

    let hasReadme = false;
    // 没有子目录的目录
    let isPureDirectory = true;

    const files = directoryFiles.map(dirent => {
      const file = {
        originName: dirent.name,
        // 用于处理路径相关的 = dirent.name 只在README.md 时 = '' 
        pathName: dirent.name,
        text: undefined,
        link: `/${path}/${dirent.name}`,
        children: undefined,
        hasReadme: undefined,
        isPureDirectory: true,
        stat: fse.statSync(`${targetPath}/${path}/${dirent.name}`),
      };
      if (dirent.isFile()) {
        includesFiles.push(`${path}/${dirent.name}`);
        if (dirent.name === 'README.md') {
          file.text = '';
          file.pathName = '';
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
    }).sort((a, b) => getSort(a, b));

    // 不同环境写入不同文件
    fse.writeFileSync(`${process.cwd()}/docs/${currentDirectoryPath}/.resources/nav${env === 'development' ? '-dev' : '-prod'}.json`, JSON.stringify(files));

    return {
      files,
      hasReadme,
      isPureDirectory,
    };
  }

  return Object.assign(func(currentDirectoryPath), { includesFiles });
}

/**
 * 获取文档/目录名称
 * @param {Object} dirent 
 */
function getFileName(dirent) {
  const fileName = dirent.name;
  // 形如 name.类型 其中数字和类型是可选的
  // 例 bb.md | cc
  const lastIndex = fileName.lastIndexOf('.');
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
          link: file.hasReadme ? `${file.link}/` : `${file.link}/${file.children[0].pathName}`,
        }
      }
      return {
        text: file.text,
        items: getItems(file.children),
      }
    }
  })
}

/**
 * 获取侧边栏
 * @param {Array} files 
 */
function getSidebar(files) {
  const sidebar = {};
  const getChildren = (files) => {
    files.forEach(file => {
      if (file.isPureDirectory) {
        sidebar[`${file.link}/`] = [{
          title: file.text,
          collapsable: false,
          children: file.children.map(x => x.pathName)
        }]
      } else if (file.children.length > 0) {
        getChildren(file.children);
      }
    })
  }
  getChildren(files);
  return sidebar;
}


// 示例
// const lang = 'zh';
// const { files } = getDirectoryFiles(lang);
// const nav = getItems(files);
// const sidebar = getSidebar(files);
// console.log(files);
// console.log(nav);
// console.log(sidebar);


module.exports = {
  getDirectoryFiles,
  getNav: getItems,
  getSidebar,
};