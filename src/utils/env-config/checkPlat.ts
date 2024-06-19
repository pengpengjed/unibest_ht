export default function getPlat() {
  let platform = 'H5'
  const ua = navigator.userAgent.toLowerCase() // 将用户代理字符串转换为小写

  // 根据用户代理字符串检查不同的平台
  if (ua.includes('alipay')) {
    platform = 'Alipay'
  } else if (ua.includes('micromessenger') && ua.includes('wxwork')) {
    platform = 'wxwork'
  } else if (ua.includes('micromessenger')) {
    platform = 'weixin'
  } else if (ua.includes('dingtalk')) {
    platform = 'dingtalk'
  } else if (ua.includes('taurusapp')) {
    platform = 'taurusapp'
  } else if ((window as any).__wxjs_environment === 'miniprogram') {
    platform = 'miniprogram'
  }

  // 如果 NODE_ENV 设置为 'dingtalk'，则覆盖平台值
  if (process.env.NODE_ENV === 'dingtalk') {
    platform = 'dingtalk'
  }

  return platform
}
