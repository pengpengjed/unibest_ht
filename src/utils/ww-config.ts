import { getJsapiTicket } from '@/service/common/commonApi'
import * as ww from '@wecom/jssdk'
import getPlat from './env-config/checkPlat'

const platform = getPlat()
const ifWx = platform === 'weixin' || platform === 'wxwork'
const urlParams = { url: window.location.href.split('#')[0] }
const jsApiList = [
  'previewFile',
  'onMenuShareAppMessage',
  'onMenuShareTimeline',
  'hideOptionMenu',
  'showOptionMenu',
  'scanQRCode',
  'chooseImage',
  'openDefaultBrowser',
]
export const initWWJdk = async (cb?: any) => {
  try {
    if (!ifWx) return console.log('已暂停在其他环境初始化/执行微信sdk')
    const response = await getJsapiTicket(urlParams)
    if (!(response.code === 200 && response.success)) return
    const { corpid, agentid, timestamp, nonceStr, signature } = response.result
    console.log(
      'corpid, agentid, timestamp, nonceStr, signature',
      corpid,
      agentid,
      timestamp,
      nonceStr,
      signature,
    )
    ww.register({
      corpId: corpid, // 必填，当前用户企业所属企业ID
      agentId: agentid, // 必填，当前应用的AgentID
      jsApiList, // 必填，需要使用的JSAPI列表
      async getConfigSignature() {
        return { timestamp, nonceStr, signature }
      },
      onConfigSuccess(res) {
        console.log('onConfigSuccess', res)
        cb && cb() // 调用回调函数
      },
      onConfigFail(res) {
        console.log('onConfigFail', res)
      },
      onConfigComplete(res) {
        console.log('onConfigComplete', res)
      },

      async getAgentConfigSignature() {
        return { timestamp, nonceStr, signature }
      },
      onAgentConfigSuccess(res) {
        console.log('onAgentConfigSuccess', res)
        cb && cb() // 调用回调函数
      },
      onAgentConfigFail(res) {
        console.log('onAgentConfigFail', res)
      },
      onAgentConfigComplete(res) {
        console.log('onAgentConfigComplete', res)
      },
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 预览文件
 * @param url 需要预览文件的地址，可以使用相对路径
 * @param size 需要预览文件的字节大小
 * @param name 需要预览文件的文件名，默认为 URL 的最后部分
 * @param callback 回调函数
 */
export const previewFile = (url, size: number, name?: string, callback?: any) => {
  ww.previewFile({
    url,
    size,
    name,
    success(result) {
      // 成功回调，result.errMsg 固定格式为“方法名:ok”
      callback(result)
    },
    fail(result) {
      // 失败回调，通过 result.errMsg 查看失败详情
      callback(result)
    },
    cancel(result) {
      // 失败回调，通过 result.errMsg 查看失败详情
      callback(result)
    },
    complete(result) {
      // 完成回调，无论调用成功还是失败，都会回调该方法
      callback(result)
    },
  })
}

/**
 * 分享到微信应用内好友
 * @param title 分享标题
 * @param desc 分享描述
 * @param link 分享链接
 * @param imgUrl 分享图片地址
 * @param callback 可选回调函数，分享成功或失败时被调用
 */
export const shareAppMessage = (title, desc, link, imgUrl, callback?: any) => {
  // 初始化分享配置
  ww.onMenuShareAppMessage({
    title,
    desc,
    link,
    imgUrl,
    success(result) {
      // 分享成功时的处理逻辑
      callback(result)
    },
    fail(result) {
      // 分享失败时的处理逻辑
      callback(result)
    },
  })
}

/**
 * 分享到朋友圈
 * @param title 分享标题
 * @param link 分享链接
 * @param imgUrl 分享图片地址
 * @param callback 可选回调函数，分享成功或失败时调用
 */
export const shareTimeLine = (title, link, imgUrl, callback?: any) => {
  // 初始化分享配置
  ww.onMenuShareTimeline({
    title,
    link,
    imgUrl,
    success(result) {
      // 分享成功时的处理逻辑
      callback(result)
    },
    fail(result) {
      // 分享失败时的处理逻辑
      callback(result)
    },
  })
}

/**
 * 根据传入的类型隐藏或显示选项菜单。
 * @param type 可以是0或1，0代表隐藏选项菜单，1代表显示选项菜单。
 */
export const hideOrShowOptionMenu = (type: 0 | 1) => {
  // 根据type的值决定是隐藏还是显示选项菜单
  if (type === 0) {
    ww.hideOptionMenu() // 隐藏选项菜单
  } else if (type === 1) {
    ww.showOptionMenu() // 显示选项菜单
  }
}

export const scanQRCode = (callback?: any) => {
  ww.scanQRCode({
    needResult: true, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: [ww.ScanQRCodeType.qrCode, ww.ScanQRCodeType.barCode], // 可以指定扫二维码还是一维码，默认二者都有
    success(result) {
      // 扫描成功后的回调函数
      callback(result)
    },
    fail(result) {
      callback(result)
    },
  })
}

/**
 * 选择图片
 * @param count 需要选择的图片数量，此处固定为1
 * @param callback 选择图片后的回调函数，可选参数
 * @returns 无返回值
 */
export const chooseImage = (count: number, callback?: any) => {
  // 使用ww.chooseImage方法选择图片，配置选择图片的参数
  ww.chooseImage({
    count, // 只选择几张张图片
    sizeType: [ww.SizeType.original, ww.SizeType.compressed], // 图片大小类型：原图和压缩图
    sourceType: [ww.SourceType.album, ww.SourceType.camera], // 图片来源：相册和相机
    defaultCameraMode: ww.CameraMode.normal, // 默认相机模式：普通模式
    isSaveToAlbum: true, // 选择的图片是否保存到相册
    success(result) {
      callback(result) // 成功选择图片后，调用回调函数
    },
    fail(result) {
      callback(result) // 选择图片失败时，调用回调函数
    },
  })
}

export const openDefaultBrowser = (url: string, callback?: any) => {
  ww.openDefaultBrowser({
    url,
    success(result) {
      callback(result)
    },
    fail(result) {
      callback(result)
    },
  })
}

export const initWXJdk = async (cb?: any) => {
  try {
    if (!ifWx) return console.log('已暂停在其他环境初始化/执行微信sdk')
    const response = await getJsapiTicket(urlParams)
    if (!(response.code === 200 && response.success)) return
    const { corpid, agentid, timestamp, nonceStr, signature } = response.result
    console.log(
      'corpid, agentid, timestamp, nonceStr, signature',
      corpid,
      agentid,
      timestamp,
      nonceStr,
      signature,
    )
    jWeixin.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: corpid, // 必填，当前用户企业所属企业ID
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
      jsApiList: [
        // 必填，需要使用的JSAPI列表
        'wedriveSelectFile',
      ],
      /* async getConfigSignature() {
        return { timestamp, nonceStr, signature }
      },
      onConfigSuccess(res) {
        console.log('onConfigSuccess', res)
        cb && cb() // 调用回调函数
      },
      onConfigFail(res) {
        console.log('onConfigFail', res)
      },
      onConfigComplete(res) {
        console.log('onConfigComplete', res)
      },

      async getAgentConfigSignature() {
        return { timestamp, nonceStr, signature }
      },
      onAgentConfigSuccess(res) {
        console.log('onAgentConfigSuccess', res)
        cb && cb() // 调用回调函数
      },
      onAgentConfigFail(res) {
        console.log('onAgentConfigFail', res)
      },
      onAgentConfigComplete(res) {
        console.log('onAgentConfigComplete', res)
      }, */
    })
    jWeixin.ready(() => {
      console.log('wx.ready')
      cb && cb() // 调用回调函数
    })
    jWeixin.error((res) => {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.log('wx.error', res)
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const wedriveSelectFile = () => {
  jWeixin.invoke(
    'wedriveSelectFile',
    {
      selectedFileNum: 1,
    },
    function (res) {
      console.log('res.err_msg	', res.err_msg)
      console.log('wedriveSelectFile --- res', res)
      if (res.err_msg === 'wedriveSelectFile:ok') {
        const selectedFileUrls = res.result.selectedFileUrls // 后续废弃
        const selectedFileInfos = res.result.selectedFileInfos
      }
    },
  )
}
