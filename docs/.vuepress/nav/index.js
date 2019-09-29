const path = require('path');
const fse = require('fs-extra');

// 查找到目标目录 docs
const source = path.resolve(__dirname);
const targetDirectory = 'docs';
const lastIndex = source.lastIndexOf(targetDirectory);
const targetPath = source.substring(0, lastIndex + targetDirectory.length);

// 获取参数 第一个参数为环境 development/production
const { argv } = process;
const index = argv.findIndex(x => x === '--');
let options = [];
let env = 'development';
if (index !== -1) {
  options = argv.slice(index);
  env = ['development', 'production'].includes(options[0]) ? options[0] : env;
}

// 默认 排除以下文件 其余在 .productionignore 中设置
const excludes = [
  '.DS_Store',
  '.productionignore'
];

/**
 * 获取当前目录下的文档/目录
 * @param {string} currentDirectoryPath 包含 lang 及之后的路径
 */
function getDirectoryFiles(currentDirectoryPath) {
  let [excludesFiles, ignoreList] = [[], []];
  if (env === 'development') {
    excludesFiles = [...excludes];
  } else if (env === 'production') {
    try {
      const ignoreFile = fse.readFileSync(`${targetPath}/${currentDirectoryPath}/.productionignore`, {
        encoding: 'utf8',
        withFileTypes: true,
      });
      ignoreList = ignoreFile.split('\n');
    } catch (error) {

    }
    excludesFiles = [...excludes, ...ignoreList];
  }

  const func = (path) => {
    const directoryFiles = fse.readdirSync(`${targetPath}/${path}`, {
      encoding: 'utf8',
      withFileTypes: true,
    }).filter(dirent => !excludesFiles.includes(dirent.name));

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
      };
      if (dirent.isFile()) {
        if (dirent.name === 'README.md') {
          file.text = '';
          file.pathName = '',
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
    }).sort((a, b) => a.pathName ? a.pathName - b.pathName : -1); // 始终将 README.md 放在第一个

    return {
      files,
      hasReadme,
      isPureDirectory,
    };
  }

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
  const lastIndex = fileName.lastIndexOf('.');
  if (lastIndex === -1) return fileName;

  let nameWithoutSuffix;
  if (dirent.isFile()) {
    nameWithoutSuffix = fileName.substring(0, lastIndex);
  } else {
    nameWithoutSuffix = fileName;
  }
  const firstIndex = fileName.indexOf('.');
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