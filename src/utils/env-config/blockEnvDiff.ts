import axios from 'axios'
/*
 * 在不同的环境中执行的操作，屏蔽浏览器差异
 */
import * as dd from 'dingtalk-jsapi'
// 微信中的api
// import * as weixin from "jwecom";
import getPlat from './checkPlat'
import { asyncHandle } from './asyncHandle'
import { initWWJdk, previewFile as wwPreViewFile } from '../ww-config'

const IN_DINGDING = 'dingtalk' // 钉钉
const IN_WXWORK = 'wxwork' // 企业微信
const WEIXIN = 'weixin' // 微信环境
export const currPlatform = getPlat()
// 获取当前打开的平台
export const getPlantform = function () {
  return currPlatform
}

// 优先在当前环境中打开某个链接
export const openURL = function (url, opts) {
  return new Promise((resolve, reject) => {
    if (currPlatform === IN_DINGDING) {
      dd.biz.util.openLink({
        url, // 要打开链接的地址
        onSuccess: function (result) {
          resolve(result)
        },
        onFail: function (err) {
          reject(err)
        },
        ...opts,
      })
    } else {
      window.open(url, '_top')
    }
  })
}

// 钉钉浏览器标题
export const setHeaderTitle = function (title, opts?: any) {
  return new Promise((resolve, reject) => {
    if (currPlatform === IN_DINGDING) {
      dd.biz.navigation.setTitle({
        title, // 控制标题文本，空字符串表示显示默认文本
        onSuccess: function (result) {
          resolve(result)
        },
        onFail: function (err) {
          reject(err)
        },
        ...opts,
      })
      setNavRightState(false)
    } else {
      document.title = title
    }
  })
}

// 浏览器头部右侧导航相关
export const setNavRightState = function (isShow, opts?: any) {
  if (currPlatform === IN_DINGDING) {
    dd.biz.navigation.setRight({
      show: isShow, // 控制按钮显示， true 显示， false 隐藏， 默认true
      onSuccess: function (result) {
        console.log(result)
      },
      onFail: function (err) {
        console.log(err)
      },
      ...opts,
    })
  } else if (currPlatform === IN_WXWORK || currPlatform === WEIXIN) {
    const weixin = window.wx
    weixin.ready(function () {
      console.log('======进入了ready函数======')
      if (isShow) {
        weixin.showOptionMenu()
      } else {
        weixin.hideOptionMenu()
      }
    })
  }
}

// 因为这两个方法很多地方一起用。就在这里放一个。方便调用
export const setHeaderState = function (title, navRightStatus = false) {
  setHeaderTitle(title)
  setNavRightState(navRightStatus)
}
// 扫码功能
// type 为 all、qrCode、barCode，默认是all。
export const appScan = function (scanType, desc) {
  return new Promise((resolve, reject) => {
    if (currPlatform === IN_DINGDING) {
      dd.biz.util.scan({
        type: scanType,
        onSuccess: (data) => {
          resolve(data)
        },
        onFail: function (err) {
          console.log('====扫码调用失败===')
          reject(err)
        },
      })
    } else if (currPlatform === IN_WXWORK || currPlatform === WEIXIN) {
      window.wx.scanQRCode({
        desc,
        needResult: 0, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: [scanType],
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          console.log('====扫码调用失败===')
          reject(err)
        },
      })
    }
  })
}
/*
 * 设置浏览器头部的菜单，目前仅支持钉钉
 * items是当前需要设置的内容
 */
export const setMenu = function (items) {
  return new Promise((resolve, reject) => {
    if (currPlatform === IN_DINGDING) {
      dd.biz.navigation.setMenu({
        items,
        onSuccess: (data) => {
          resolve(data)
        },
        /* onFail: function (err) {
          reject(err)
        }, */
      })
    }
  })
}
// **弃用 在钉钉中预览文件
const previewFileInDing = async function fileCspaceInfo(code, url, fileName, fileSize) {
  const userInfo = JSON.parse(await localStorage.getItem('userInfo'))

  asyncHandle(async () => {
    const response = await axios.post('/api/dingtalk/rest/dingTalk/v2/file/cspace/info', {
      code, // 钉钉临时授权码 ,
      companyId: userInfo.companyId, // 公司id ,
      employeeCode: userInfo.employeeCode, // 员工code ,
      fileName, // 文件名 ,
      filePath: url, // oss文件路径 ,
      fileSize, // 文件大小
    })
    if (response.data.code === '200') {
      const data = response.data.data
      dd.biz.cspace
        .preview({
          corpId: data.corpId,
          spaceId: data.spaceId,
          fileId: data.fileId,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileType: data.fileType,
        })
        .then((response) => {
          console.log('调用成功时回调', response)
        })
        .catch((err) => {
          console.log('调用失败时回调', err)
        })
    } else if (response.data.code !== '760') {
      console.log(response.data.desc ? response.data.desc : '请求失败，请重试！')
    }
  })
}

export const previewFileByEnv = async function ({ url, fileName, fileSize }) {
  const platform = getPlat()
  console.log('platform', platform)
  console.log('previewFileByEnv ---- url, fileName, fileSize', url, fileName, fileSize)
  if (platform === 'dingtalk') {
    console.log('钉钉: 正在进行文件查看')
    /* 直接打开文件链接 */
    console.log('url', url)
    uni.setClipboardData({
      data: url.toString(),
      success: (result) => {
        uni.showToast({
          title: '文件地址已复制, 请到浏览器粘贴下载',
          icon: 'success',
          mask: true,
          duration: 1000,
        })
        setTimeout(() => {
          dd.openLink({
            url,
            success: (e) => {
              console.log('openLink-----success', e)
            },
            fail: (e) => {
              console.log('openLink-----fail', e)
            },
            complete: (e) => {
              console.log('openLink-----complete', e)
            },
          })
        }, 1000)
      },
      fail: () => {
        console.log('复制失败')
        // 钉钉打开非pdf文件失败
        dd.openLink({
          url,
          success: (e) => {
            console.log('openLink-----success', e)
          },
          fail: (e) => {
            console.log('openLink-----fail', e)
          },
          complete: (e) => {
            console.log('openLink-----complete', e)
          },
        })
      },
    })

    // 如果是在微信里面
  } else if (platform === 'weixin' || platform === 'wxwork') {
    // 在微信中预览文件 todo --- 接入 initWWJdk(preview)
    initWWJdk(wwPreViewFile(url, fileSize, fileName, (e) => console.log('e', e)))
  } else {
    console.log('不在钉钉或者微信中')
    window.location.href = url
  }
}
