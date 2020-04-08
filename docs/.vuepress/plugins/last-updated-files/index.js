const path = require('path')
const spawn = require('cross-spawn')
const { includesFiles } = require('../../nav/zh')

const lastUpdatedOfAllFiles = {};

module.exports = (options = {}, context) => ({
  extendPageData($page) {
    const createTimestamp = getGitFirstTrackedTimeStamp($page._filePath)
    const timestamp = getGitLastUpdatedTimeStamp($page._filePath)
    if (includesFiles.includes($page.relativePath) && timestamp) {
      lastUpdatedOfAllFiles[$page.relativePath] = {
        title: $page.title || /\/([^/]+)\.md/.exec($page.relativePath)[1],
        path: $page.path,
        timestamp,
        createTimestamp,
      }
    }

    $page.createTimestamp = createTimestamp;
    $page.lastUpdatedOfAllFiles = lastUpdatedOfAllFiles;
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

function getGitFirstTrackedTimeStamp(filePath) {
  let firstTracked
  try {
    // 1565602676\n1565548863\n1565539297\n
    const tracked = spawn.sync(
      'git',
      ['log', '--format=%at', path.basename(filePath)],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8').split('\n')
    firstTracked = parseInt(tracked[tracked.length - 2]) * 1000
  } catch (e) { /* do not handle for now */ }
  return firstTracked
}
