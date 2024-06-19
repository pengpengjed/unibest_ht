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
  // eslint-disable-next-line no-unused-vars
  (index: number, list: any[]): Promise<void> | boolean
}

export interface IProps {
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
  beforeUpload?: CallbackFunc
  // 移除文件前的钩子
  beforeRemove?: CallbackFunc
  // 允许上传的图片后缀
  limitType?: string[]
  // 在各个回调事件中的最后一个参数返回，用于区别是哪一个组件的事件
  index?: number | string
  // 调chooseFileApi时，传参上传类型
  chooseFileType?: string
}
