/**
 * 文件url下载
 * @param {string} url 文件地址
 * @param {string} fileName 下载文件名
 */
export function downloadUrl(url, fileName) {
  const link = document.createElement('a')
  link.download = fileName
  link.href = url
  link.target = '__blank'
  link.click()
}

/**
 * 将字节大小转换为更易读的格式（如KB、MB、GB等）。
 * @param size 要转换的字节大小，必须为数字。
 * @returns 转换后的大小字符串，带单位。
 */
export function formatBytes(size) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  let newSize = size
  let i = 0
  while (newSize >= 1024 && i < units.length - 1) {
    newSize /= 1024
    i++
  }
  return `${newSize.toFixed(2)} ${units[i]}`
}

/**
 * 根据文件名后缀获取文件类型
 * @param {string} str - 需要检查后缀的文件名字符串
 * @returns {string | null} - 返回文件的类型（即后缀部分），若输入字符串无效（如：空、无后缀或仅包含一个点）则返回null
 */
export const getExtension = (str) => {
  if (!str) return null // 如果str为null或undefined，则直接返回null

  const lowerCaseStr = str.toLowerCase() // 将字符串转换为小写

  const dotIndex = lowerCaseStr.lastIndexOf('.') // 获取最后一个点的索引
  if (dotIndex === -1 || dotIndex === lowerCaseStr.length - 1) return null // 如果没有找到点或者点在字符串的最后，则返回null

  return lowerCaseStr.substring(dotIndex + 1) // 返回点后面的字符串作为文件类型
}
