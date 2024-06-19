/**
 * 判断当前环境是PC端还是H5移动端
 * @returns {boolean} 返回一个布尔值，true表示是移动端，false表示是PC端
 */
export const pcOrH5 = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const regex = /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/
  return regex.test(userAgent)
}
