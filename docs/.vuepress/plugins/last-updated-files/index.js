const path = require('path')
const spawn = require('cross-spawn')
const { includesFiles } = require('../../nav/zh')

const lastUpdatedOfAllFiles = {};

module.exports = (options = {}, context) => ({
  extendPageData($page) {
    const timestamp = getGitLastUpdatedTimeStamp($page._filePath)
    if (includesFiles.includes($page.relativePath) && timestamp) {
      lastUpdatedOfAllFiles[$page.relativePath] = {
        title: $page.title || /\/([^/]+)\.md/.exec($page.relativePath)[1],
        path: $page.path,
        timestamp,
      }
    }
    $page.lastUpdatedOfAllFiles = lastUpdatedOfAllFiles
  }
})

function getGitLastUpdatedTimeStamp(filePath) {
  let lastUpdated
  try {
    lastUpdated = parseInt(spawn.sync(
      'git',
      ['log', '-1', '--format=%at', path.basename(filePath)],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8')) * 1000
  } catch (e) { /* do not handle for now */ }
  return lastUpdated
}
