<template>
  <view class="ht-upload-wrapper w-100%" v-if="!disabled">
    <div ref="scrollRef" v-if="showUploadList" class="w-100% overflow-x-scroll whitespace-nowrap">
      <view
        class="u-list-item u-preview-wrap"
        v-for="(item, index) in lists"
        :key="index"
        :style="{
          width: `${width}px`,
          height: `${height}px`,
        }"
      >
        <view
          v-if="deletable"
          class="u-delete-icon"
          @tap.stop="deleteItem(index)"
          :style="{
            background: delBgColor,
          }"
        >
          <uv-icon class="u-icon" :name="delIcon" size="20" :color="delColor"></uv-icon>
        </view>
        <uv-line-progress
          v-if="showProgress && item.progress > 0 && !item.error"
          height="3"
          class="u-progress"
          :showText="false"
          :percentage="item.progress"
          :activeColor="processActiveColor"
        ></uv-line-progress>
        <view @tap.stop="retry(index)" v-if="item.error" class="u-error-btn">点击重试</view>
        <image
          @tap.stop="openAttachmentPreview(item, item.url || item.path, index)"
          class="u-preview-image"
          v-if="item.isImage"
          :src="item.url || item.path"
          mode="aspectFill"
        ></image>
        <view
          v-else
          class="p-1 flex flex-col h-100% justify-around"
          @tap.stop="openAttachmentPreview(item, item.url || item.path, index)"
        >
          <view class="u-file-name" text-xs>
            <text class="ellipsis-3">{{ item.file.name }}</text>
          </view>
          <view class="u-file-footer text-xs flex ellipsis">
            <uv-icon name="file-text" size="16"></uv-icon>
            {{ formatBytes(item.file.size) }}
          </view>
        </view>
      </view>
    </div>

    <slot name="file" :file="lists"></slot>
    <view style="display: inline-block" @tap="selectFile" v-if="Number(maxCount) > lists.length">
      <slot name="addBtn"></slot>
      <view
        v-if="!customBtn"
        class="u-list-item u-add-wrap"
        hover-class="u-add-wrap__hover"
        :hover-stay-time="150"
        :style="{
          width: `${width}px`,
          height: `${height}px`,
        }"
      >
        <uv-icon name="plus" class="u-add-btn"></uv-icon>
        <view class="u-add-tips">{{ uploadText }}</view>
      </view>
    </view>
  </view>
  <wd-message-box :closeOnClickModal="false" />
</template>

<script setup lang="ts">
import { downloadUrl, formatBytes, getExtension } from '@/utils/download'
import { pcOrH5 } from '@/utils/blockEnvDiff'
import { previewFileByEnv } from '@/utils/env-config/blockEnvDiff'
import getBrowser from '@/utils/env-config/checkBroswer'
import getPlat from '@/utils/env-config/checkPlat'
import { initWWJdk, previewFile } from '@/utils/ww-config'
import { ref, watch } from 'vue'
import { useMessage } from 'wot-design-uni'
// import {IProps} from './config/type'
// 当前编译器版本, defineProps类型声明不支持从其他文件引入的类型传入

/**
 * upload 图片上传
 * @description 该组件用于上传图片场景
 * @tutorial https://www.uviewui.com/components/upload.html
 * @property {String} action 服务器上传地址
 * @property {String Number} max-count 最大选择图片的数量（默认99）
 * @property {Boolean} custom-btn 如果需要自定义选择图片的按钮，设置为true（默认false）
 * @property {Boolean} show-progress 是否显示进度条（默认true）
 * @property {Boolean} disabled 是否启用(显示/移仓)组件（默认false）
 * @property {String} image-mode 预览图片等显示模式，可选值为uni的image的mode属性值（默认aspectFill）
 * @property {String} del-icon 右上角删除图标名称，只能为uView内置图标
 * @property {String} del-bg-color 右上角关闭按钮的背景颜色
 * @property {String | Number} index 在各个回调事件中的最后一个参数返回，用于区别是哪一个组件的事件
 * @property {String} del-color 右上角关闭按钮图标的颜色
 * @property {Object} header 上传携带的头信息，对象形式
 * @property {Object} form-data 上传额外携带的参数
 * @property {String} name 上传文件的字段名，供后端获取使用（默认file）
 * @property {Array<String>} size-type original 原图，compressed 压缩图，默认二者都有（默认['original', 'compressed']）
 * @property {Array<String>} source-type 选择图片的来源，album-从相册选图，camera-使用相机，默认二者都有（默认['album', 'camera']）
 * @property {Boolean} preview-full-image	是否可以通过uni.previewImage预览已选择的图片（默认true）
 * @property {Boolean} multiple	是否开启图片多选，部分安卓机型不支持（默认true）
 * @property {Boolean} deletable 是否显示删除图片的按钮（默认true）
 * @property {String Number} max-size 选择单个文件的最大大小，单位B(byte)，默认不限制（默认Number.MAX_VALUE）
 * @property {Array<Object>} file-list 默认显示的图片列表，数组元素为对象，必须提供url属性
 * @property {Boolean} upload-text 选择图片按钮的提示文字（默认“选择图片”）
 * @property {Boolean} auto-upload 选择完图片是否自动上传，见上方说明（默认true）
 * @property {Boolean} show-tips 特殊情况下是否自动提示toast，见上方说明（默认true）
 * @property {Boolean} show-upload-list 是否显示组件内部的图片预览（默认true）
 * @event {Function} on-oversize 图片大小超出最大允许大小
 * @event {Function} on-preview 全屏预览图片时触发
 * @event {Function} on-remove 移除图片时触发
 * @event {Function} on-success 图片上传成功时触发
 * @event {Function} on-change 图片上传后，无论成功或者失败都会触发
 * @event {Function} on-error 图片上传失败时触发
 * @event {Function} on-progress 图片上传过程中的进度变化过程触发
 * @event {Function} on-uploaded 所有图片上传完毕触发
 * @event {Function} on-choose-complete 每次选择图片后触发，只是让外部可以得知每次选择后，内部的文件列表
 * @example <u-upload :action="action" :file-list="fileList" ></u-upload>
 */

interface CallbackFunc {
  beforeUpload: (index: number, list: any[]) => Promise<void> | boolean
}

interface IProps {
  // 是否显示组件自带的图片预览功能
  showUploadList?: boolean
  // 后端地址
  action?: string
  // 最大上传数量
  maxCount?: string | number
  // 是否显示进度条
  showProgress?: boolean
  // 是否启用
  disabled?: boolean
  // 预览上传的图片时的裁剪模式，和image组件mode属性一致
  imageMode?: string
  // 头部信息
  header?: Record<string, any>
  // 额外携带的参数
  formData?: Record<string, any>
  // 上传的文件字段名
  name?: string
  // 所选的图片的尺寸, 可选值为original compressed
  sizeType?: string[]
  // 所选图片的来源, album 从相册选图，camera 使用相机，默认都有
  sourceType?: string[]
  // 是否在点击预览图后展示预览
  previewFullFile?: boolean
  // 是否开启图片多选，部分安卓机型不支持
  multiple?: boolean
  // 是否展示删除按钮
  deletable?: boolean
  // 文件大小限制，单位为byte
  maxSize?: string | number
  // 显示已上传的文件列表
  fileList?: any[]
  // 上传区域的提示文字
  uploadText?: string
  // 是否自动上传
  autoUpload?: boolean
  // 是否显示toast消息提示
  showTips?: boolean
  // 是否通过slot自定义传入选择图标的按钮
  customBtn?: boolean
  // 内部预览图片区域和选择图片按钮的区域宽度
  width?: string | number
  // 内部预览图片区域和选择图片按钮的区域高度
  height?: string | number
  // 右上角关闭按钮的背景颜色
  delBgColor?: string
  // 右上角关闭按钮的叉号图标的颜色
  delColor?: string
  // 右上角删除图标名称，只能为uView内置图标
  delIcon?: string
  // 如果上传后的返回值为json字符串，是否自动转json
  toJson?: boolean
  // 上传前的钩子，每个文件上传前都会执行
  beforeUpload?: CallbackFunc['beforeUpload']
  // 移除文件前的钩子
  beforeRemove?: CallbackFunc['beforeUpload']
  // 允许上传的图片后缀
  limitType?: string[]
  // 在各个回调事件中的最后一个参数返回，用于区别是哪一个组件的事件
  index?: number | string
  // 调chooseFileApi时，传参上传类型
  chooseFileType?: string
}
// vue3版本和uniapp编译器不支持引入外部数据的类型
const props = withDefaults(defineProps<IProps>(), {
  showUploadList: true,
  action: '',
  maxCount: 52,
  showProgress: true,
  disabled: false,
  imageMode: 'aspectFill',
  header: () => ({}),
  formData: () => ({}),
  name: 'file',
  sizeType: () => ['original', 'compressed'],
  sourceType: () => ['album', 'camera'],
  previewFullFile: true,
  multiple: true,
  deletable: true,
  maxSize: Number.MAX_VALUE,
  fileList: () => [],
  uploadText: '选择图片',
  autoUpload: true,
  showTips: true,
  customBtn: false,
  width: 200,
  height: 200,
  delBgColor: '#fa3534',
  delColor: '#ffffff',
  delIcon: 'close',
  toJson: true,
  beforeUpload: null,
  beforeRemove: null,
  limitType: () => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'image'],
  index: '',
  chooseFileType: 'all',
})

const picType = ref<string[]>(['png', 'jpg', 'jpeg', 'webp', 'gif', 'image'])

const emit = defineEmits<{
  (e: 'on-list-change', fileList: FileItem[], index: string | number): void
  (e: 'on-oversize', tempFilesItem: any, fileList: FileItem[], index: string | number): void
  (e: 'on-exceed', tempFilesItem: any, fileList: FileItem[], index: string | number): void
  (e: 'on-choose-complete', fileList: FileItem[], index: string | number): void
  (e: 'on-choose-fail', err: PromiseRejectedResult): void
  (e: 'on-uploaded', fileList: FileItem[], index: string | number): void
  (e: 'on-error', uploadIdx: number, err: any, fileList: FileItem[], index: string | number): void
  (
    e: 'on-success',
    data: any,
    uploadIdx: number,
    fileList: FileItem[],
    index: string | number,
  ): void
  (e: 'on-change', data: any, uploadIdx: number, fileList: FileItem[], index: string | number): void
  (
    e: 'on-progress',
    data: UniNamespace.OnProgressUpdateResult,
    uploadIdx: number,
    fileList: FileItem[],
    index: string | number,
  ): void
  (e: 'on-remove', imageIdx: number, fileList: FileItem[], index: string | number)
  (e: 'on-preview', url: string, fileList: FileItem[], index: string | number)
}>()

interface FileItem {
  url: string
  error: boolean
  progress: number
  file?: any
  response?: any
  uploadTask?: any
  path?: any
  isImage?: boolean
  fileType?: string
}

// 弹窗hook
const message = useMessage()

const lists = ref<FileItem[]>([])
const uploading = ref<boolean>(false)
const scrollRef = ref(null)

// 滚动到最后一个u-list-item
const scrollToLastItem = async () => {
  await nextTick()
  const width = scrollRef.value.scrollWidth
  scrollRef.value.scrollTo(width, 0)
}

/** 监听传入的fileList，如果外部fileList修改了，需要内部也同步修改 */
watch(
  () => props.fileList,
  (val) => {
    val.map((value: any) => {
      // 首先检查内部是否已经添加过这张图片，因为外部绑定了一个对象给fileList的话(对象引用)，进行修改外部fileList
      // 时，会触发watch，导致重新把原来的图片再次添加到this.lists
      // 数组的some方法意思是，只要数组元素有任意一个元素条件符合，就返回true，而另一个数组的every方法的意思是数组所有元素都符合条件才返回true
      const tmp = lists.value.some((val: any) => {
        return val.url === value.url
      })
      // 如果内部没有这个图片(tmp为false)，则添加到内部
      return !tmp && lists.value.push({ url: value.url, error: false, progress: 100 })
    })
  },
  { immediate: true },
)
/** 监听lists的变化 */
watch(
  () => lists.value,
  (val) => {
    emit('on-list-change', val, props.index)
    scrollToLastItem()
  },
  { deep: true },
)

/** 清除列表 */
const clear = () => {
  lists.value = []
}
/** 重新上传队列中上传失败的所有文件 */
const reUpload = () => {
  return uploadFile()
}

/** 选择文件 */
const selectFile = () => {
  // 检查是否禁用
  if (props.disabled) return

  // 解构 props
  const { maxCount, multiple, maxSize, sizeType, sourceType, chooseFileType } = props

  // 计算剩余可选文件的数量
  const newMaxCount = Number(props.maxCount) - lists.value.length

  // 检查是否启用多选模式
  let count
  if (multiple) {
    // 如果是多选模式，则取最大值为 9 或者当前剩余可选文件数
    count = newMaxCount > 9 ? 9 : newMaxCount
  } else {
    // 如果不是多选模式，则默认为 1
    count = 1
  }

  // 选择文件
  const chooseFile = new Promise((resolve, reject) => {
    const isAndroid =
      getBrowser().terminalType.includes('android') && getBrowser().terminalType.includes('mobile')
    const isWx = getPlat() === 'wxwork' || getPlat() === 'weixin'
    console.log('isAndroid, isWx', isAndroid, isWx)
    console.log('getBrowser, getPlat', getBrowser(), getPlat())
    const chooseAPI = isAndroid && isWx ? uni.chooseImage : uni.chooseFile
    // const chooseAPI = uni.chooseFile
    console.log('chooseAPI', chooseAPI)
    console.log('count sourceType sizeType', count, sourceType, sizeType)
    chooseAPI({
      count,
      type: 'all',
      success: resolve,
      fail: reject,
    })
  })
  // 处理选择文件的结果
  nextTick(() => {
    chooseFile
      .then((res: UniCloud.ChooseAndUploadFileSuccessCallbackResult) => {
        console.log('chooseFileRes', res)
        const listOldLength = lists.value.length
        res.tempFiles.forEach((val, index) => {
          // 检查文件后缀是否允许
          if (!checkFileExt(val, props.limitType, false)) return

          // 如果是非多选，index大于等于1或者超出最大限制数量时，不处理
          if (!multiple && index >= 1) return
          if (val.size > maxSize) {
            emit('on-oversize', val, lists.value, index)
            showToast('超出允许的文件大小')
          } else {
            if (Number(maxCount) <= lists.value.length) {
              emit('on-exceed', val, lists.value, index)
              showToast('超出最大允许的文件个数')
              return
            }
            lists.value.push({
              url: val.path,
              progress: 0,
              error: false,
              file: val,
              isImage: checkFileExt(val, picType.value, true),
            })
          }
        })
        // 每次图片选择完，抛出一个事件，并将当前内部选择的图片数组抛出去
        emit('on-choose-complete', lists.value, props.index)
        if (props.autoUpload) uploadFile(listOldLength)
      })
      .catch((error: PromiseRejectedResult) => {
        console.log('chooseFile --- error', error)
        emit('on-choose-fail', error)
      })
  })
}

/** 提示用户消息 */
const showToast = (message, force = false) => {
  if (props.showTips || force) {
    uni.showToast({
      title: message,
      icon: 'none',
    })
  }
}
/** 该方法供用户通过ref调用，手动上传 */
const upload = () => {
  return uploadFile()
}

/** 对失败的图片重新上传 */
const retry = (index) => {
  lists.value[index].progress = 0
  lists.value[index].error = false
  lists.value[index].response = null
  uni.showLoading({
    title: '重新上传',
  })
  uploadFile(index)
}

function jsonString(value) {
  if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value)
      if (typeof obj === 'object' && obj) {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
  return false
}

/** 上传图片 */
const processActiveColor = ref<string>('#489afb')
const uploadFile = async (index = 0) => {
  processActiveColor.value = '#489afb'
  if (props.disabled) return
  if (uploading.value) return
  // 全部上传完成
  if (index >= lists.value.length) {
    emit('on-uploaded', lists.value, index)
    return
  }
  // 检查是否是已上传或者正在上传中
  if (lists.value[index].progress === 100) {
    if (!props.autoUpload) uploadFile(index + 1)
    return
  }
  // 执行before-upload钩子
  if (props.beforeUpload && typeof props.beforeUpload === 'function') {
    // 执行回调，同时传入索引和文件列表当作参数
    const beforeResponse = props.beforeUpload(index, lists.value)

    // 判断是否返回了 promise
    if (beforeResponse instanceof Promise) {
      try {
        await beforeResponse
        // promise 返回成功，不进行动作，继续上传
      } catch (err) {
        // 进入 catch 回调的话，继续下一张
        uploadFile(index + 1)
      }
    } else if (beforeResponse === false) {
      // 如果返回 false，继续下一张图片的上传
      // eslint-disable-next-line consistent-return
      return uploadFile(index + 1)
    }
    // 此处为返回"true"的情形，这里不写代码，就跳过此处，继续执行当前的上传逻辑
  }
  // 检查上传地址
  if (!props.action) {
    showToast('请配置上传地址', true)
    return
  }
  lists.value[index].error = false
  uploading.value = true
  // 创建上传对象
  const task = uni.uploadFile({
    url: props.action,
    filePath: lists.value[index].url,
    name: props.name,
    formData: props.formData,
    header: props.header,
    success: (res) => {
      // 判断是否json字符串，将其转为json格式
      const data = props.toJson && jsonString(res.data) ? JSON.parse(res.data) : res.data
      if (![200, 201, 204].includes(res.statusCode)) {
        uploadError(index, data)
      } else {
        // 上传成功
        lists.value[index].response = data
        lists.value[index].progress = 100
        lists.value[index].error = false
        processActiveColor.value = '#19be6b'
        emit('on-success', data, index, lists.value, index)
      }
    },
    fail: (e) => {
      uploadError(index, e)
    },
    complete: (res) => {
      uploading.value = false
      uploadFile(index + 1)
      emit('on-change', res, index, lists.value, index)
    },
  })
  task.onProgressUpdate((res) => {
    if (res.progress > 0) {
      lists.value[index].progress = res.progress
      emit('on-progress', res, index, lists.value, index)
    }
  })
}

/** 上传失败 */
const uploadError = (index, err) => {
  uni.hideLoading()
  lists.value[index].progress = 0
  lists.value[index].error = true
  lists.value[index].response = null
  emit('on-error', err, index, lists.value, props.index)
  showToast('上传失败，请重试')
}

/** 删除一个图片 */
const deleteItem = (index) => {
  uni.showModal({
    title: '提示',
    content: '您确定要删除此项吗？',
    success: async (res) => {
      if (res.confirm) {
        // 先检查是否有定义before-remove移除前钩子
        // 执行before-remove钩子
        if (props.beforeRemove && typeof props.beforeRemove === 'function') {
          // 此处钩子执行 原理同before-remove参数，见上方注释
          // const beforeResponse = props.beforeRemove.bind($u.$parent.call(this))(index, lists.value)
          const beforeResponse = props.beforeRemove(index, lists.value)

          // 判断是否返回了promise
          if (beforeResponse instanceof Promise) {
            try {
              await beforeResponse
              handlerDeleteItem(index)
            } catch (error) {
              showToast('已终止移除')
            }
          } else if (beforeResponse === false) {
            // 返回false，终止删除
            showToast('已终止移除')
          } else {
            // 如果返回true，执行删除操作
            handlerDeleteItem(index)
          }
        } else {
          // 如果不存在before-remove钩子，
          handlerDeleteItem(index)
        }
      }
    },
  })
}

/** 执行移除图片的动作，上方代码只是判断是否可以移除 */
const handlerDeleteItem = (index: number) => {
  // 如果文件正在上传中，终止上传任务，进度在0 < progress < 100则意味着正在上传
  if (lists.value[index].progress < 100 && lists.value[index].progress > 0) {
    if (typeof lists.value[index].uploadTask !== 'undefined') {
      lists.value[index].uploadTask.abort()
    }
  }
  lists.value.splice(index, 1)
  // 不推荐使用 $forceUpdate，而是通过重新分配响应式变量的方式触发更新
  lists.value = [...lists.value]
  emit('on-remove', index, lists.value, index)
  showToast('移除成功')
}

const remove = (index: number) => {
  // 判断索引的合法范围
  if (index >= 0 && index < lists.value.length) {
    lists.value.splice(index, 1)
    emit('on-list-change', lists.value, index)
  }
}

const openAttachmentPreview = async (row: any, url: string, index: number) => {
  if (!props.previewFullFile) return
  if (row.isImage) {
    const images = lists.value.map((item) => item.url || item.path)
    uni.previewImage({
      indicator: 'none',
      urls: images,
      current: url,
      success: () => {
        emit('on-preview', url, lists.value, index)
      },
      fail: () => {
        uni.showToast({
          title: '预览图片失败',
          icon: 'none',
        })
      },
    })
  } else if (Object.prototype.hasOwnProperty.call(row, 'response')) {
    const { url, FileName, FileSize } = row.response.data
    setTimeout(() => {
      const fileItem = { url, fileName: FileName, fileSize: FileSize }
      if (['doc', 'docx', 'ppt', 'xlsx', 'xls'].includes(getExtension(FileName)?.toLowerCase())) {
        if (pcOrH5()) {
          previewFileByEnv(fileItem)
        } else {
          const openDocSrc = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
          window.open(openDocSrc)
        }
      } else if (pcOrH5()) {
        if (['pdf'].includes(getExtension(FileName)?.toLowerCase())) {
          message
            .alert({
              msg: '打开PDF',
              title: '提示',
              confirmButtonText: '预览',
            })
            .then(() => {
              // 用户选择下载，调用预览文件函数
              previewFileByEnv(fileItem)
            })
          /* .catch(() => {
              // 用户选择预览，显示提示信息并跳转到预览页面
              uni
                .showToast({
                  title: '只支持预览, 保存请复制链接到浏览器进行下载',
                  icon: 'none',
                  duration: 2000,
                })
                .then(() => {
                  uni.navigateTo({
                    url: `/pages/pdf?file=${encodeURIComponent(url)}`,
                  })
                })
            }) */
        } else {
          previewFileByEnv(fileItem)
        }
      } else {
        downloadUrl(url, FileName)
      }
      uni.hideLoading()
    })
  } else {
    /* else if (['pdf'].includes(getExtension(row.file.name)?.toLowerCase())) {
    uni
      .showToast({
        title: '只支持预览, 保存请复制链接到浏览器进行下载',
        icon: 'none',
        duration: 2000,
      })
      .then(() => {
        uni.navigateTo({
          url: `/pages/pdf?file=${encodeURIComponent(url)}`,
        })
      })
  }  */
    showToast('doc, docx, ppt, xlsx, xls, pdf文件, 请等待上传完成再预览')
  }
}

/** 判断文件后缀是否允许 */
const checkFileExt = (file, limitTypeArr, noTotast) => {
  // 检查是否在允许的后缀中
  let noArrowExt = false
  // 获取后缀名
  let fileExt = ''
  const reg = /.+\./
  // 如果是H5，需要从name中判断
  // #ifdef H5
  fileExt = file.name.replace(reg, '').toLowerCase()
  // #endif
  // 非H5，需要从path中读取后缀
  // #ifndef H5
  fileExt = file.path.replace(reg, '').toLowerCase()
  // #endif
  // 使用数组的some方法，只要符合limitType中的一个，就返回true
  noArrowExt = limitTypeArr.some((ext: any) => {
    // 转为小写
    return ext.toLowerCase() === fileExt
  })
  if (noTotast) return noArrowExt
  if (!noArrowExt) showToast(`不允许选择${fileExt}格式的文件`)
  return noArrowExt
}

defineExpose({ clear, reUpload, upload, remove })
</script>

<style lang="scss" scoped>
@mixin vue-flex($direction: row) {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: $direction;
  /* #endif */
}

.ht-upload-wrapper {
  @include vue-flex;

  flex-wrap: wrap;
  overflow-x: auto; // 设置横向滚动
}

.u-list-item {
  position: relative;
  /* #ifndef APP-NVUE */
  // display: flex;
  /* #endif */
  display: inline-block;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  width: 200rpx;
  height: 200rpx;
  margin: 10rpx;
  overflow: hidden;
  background: rgb(244 245 246);
  border-radius: 10rpx;
}

.u-preview-wrap {
  border: 1px solid rgb(235 236 238);
}

.u-add-wrap {
  flex-direction: column;
  font-size: 26rpx;
  color: #606266;
}

.u-add-tips {
  // margin-top: 20rpx;
  // line-height: 40rpx;
  color: red;
}

.u-add-wrap__hover {
  background-color: rgb(235 236 238);
}

.u-preview-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.u-delete-icon {
  position: absolute;
  top: 0rpx;
  right: 0rpx;
  z-index: 10;
  align-items: center;
  justify-content: center;
  width: 38rpx;
  height: 38rpx;
  background-color: $uni-color-error;
  border-radius: 100rpx;

  @include vue-flex;
}

.u-icon {
  @include vue-flex;

  align-items: center;
  justify-content: center;
}

.u-progress {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  width: auto;
}

.u-error-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  padding: 4px 0;
  font-size: 20rpx;
  line-height: 1;
  color: #fff;
  text-align: center;
  background-color: $uni-color-error;
}
</style>
