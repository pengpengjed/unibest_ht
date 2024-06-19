// 钉钉
import * as dingtalk from 'dingtalk-jsapi'
import getPlat from './checkPlat'
import getBroswer from './checkBroswer'

// 定义平台URL接口
interface Urls {
  [key: string]: {
    login: string
  }
}

// 定义SDK接口
interface Sdks {
  [key: string]: any
}

// 定义方法接口
interface Methods {
  [key: string]: {
    storageGetItem: string
    storageSetItem: string
    storageRemoveItem: string
    closeProgram: string
  }
}

// 定义登录URL
const urls: Urls = {
  dingtalk: {
    login: '/api/dingtalk/rest/dingTalk/v2/app/login',
  },
  wxwork: {
    login: '/api/dingtalk/rest/tencent/wechat/login',
  },
  weixin: {
    login: '/api/dingtalk/rest/tencent/wechat/login',
  },
}

// 定义SDK对象
const sdks: Sdks = {
  dingtalk,
}

// 定义方法对象
const methods: Methods = {
  dingtalk: {
    storageGetItem: 'util.domainStorage.getItem',
    storageSetItem: 'util.domainStorage.setItem',
    storageRemoveItem: 'util.domainStorage.removeItem',
    closeProgram: 'biz.navigation.close',
  },
}

// 获取平台和浏览器信息
const plat = getPlat()
const broswerInfo = getBroswer()

const platformSdk = sdks[plat as keyof typeof sdks]
const platformUrls = urls[plat as keyof typeof urls]

export default {
  plat,
  broswerInfo,
  sdk: platformSdk,
  urls: platformUrls,
  methods,
}
