<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '数据报表',
  },
}
</route>

<template>
  <view class="report">
    <!-- 当日铝锭价 -->
    <wd-card type="rectangle" :title="ALIngotsTodayPriceTitle">
      <next-table
        :show-header="true"
        :columns="ALIngotsTodayPriceCol"
        :stripe="true"
        :fit="false"
        :border="true"
        :data="ALIngotsTodayPriceList"
      ></next-table>
    </wd-card>
    <!-- 接单量情况分析 -->
    <wd-card type="rectangle" :title="AnalysisOrderTitle">
      <wd-grid border :column="3">
        <wd-grid-item use-slot v-for="(item, index) in AnalysisOrderGrid" :key="index">
          <template #default>
            <view>{{ item.date }}</view>
            <view>{{ item.orderNum }}</view>
            <view v-for="(i, idx) in item.girdItem" :key="idx">
              <view>
                <text>{{ i.label }}：</text>
                <text>{{ i.value }}</text>
              </view>
            </view>
          </template>
        </wd-grid-item>
      </wd-grid>
      <next-table
        :show-header="true"
        :columns="AnalysisOrderCol"
        :stripe="true"
        :fit="false"
        :border="true"
        :data="AnalysisOrderList"
      ></next-table>
    </wd-card>
    <!-- 销售量情况分析 -->
    <wd-card type="rectangle" :title="SaleAnalysisTitle">
      <wd-grid border :column="3">
        <wd-grid-item use-slot v-for="(item, index) in AnalysisOrderGrid" :key="index">
          <template #default>
            <view>{{ item.date }}</view>
            <view>{{ item.orderNum }}</view>
            <view v-for="(i, idx) in item.girdItem" :key="idx">
              <view>
                <text>{{ i.label }}：</text>
                <text>{{ i.value }}</text>
              </view>
            </view>
          </template>
        </wd-grid-item>
      </wd-grid>
      <next-table
        :show-header="true"
        :columns="AnalysisOrderCol"
        :stripe="true"
        :fit="false"
        :border="true"
        :data="AnalysisOrderList"
      ></next-table>
    </wd-card>
    <!-- 各工序待办库存 -->
    <wd-card type="rectangle" :title="TodoProcessInventoryTitle">
      <wd-grid border :column="3">
        <wd-grid-item use-slot v-for="(item, index) in TodoProcessInventoryGrid" :key="index">
          <template #default>
            <view>{{ item.Category }}</view>
            <view>{{ item.Value }}</view>
          </template>
        </wd-grid-item>
      </wd-grid>
    </wd-card>
    <!-- 铝棒库存 -->
    <wd-card type="rectangle" :title="AluminumRodStockTitle">
      <next-table
        :show-header="true"
        :columns="AluminumRodStockCol"
        :stripe="true"
        :fit="false"
        :border="true"
        :data="AluminumRodStockList"
      ></next-table>
    </wd-card>
    <!-- 坯料库存 -->
    <wd-card type="rectangle" :title="BilletStockTitle">
      <wd-grid border :column="3">
        <wd-grid-item use-slot v-for="(item, index) in BilletStockGrid" :key="index">
          <template #default>
            <view>{{ item.SubCategory }}</view>
            <view>{{ item.Value }}</view>
          </template>
        </wd-grid-item>
      </wd-grid>
    </wd-card>
    <!-- 成品库存分析 -->
    <wd-card type="rectangle" :title="GoodsInventoryAnalysisTitle">
      <wd-grid border :column="3">
        <wd-grid-item use-slot v-for="(item, index) in GoodsInventoryAnalysisGrid" :key="index">
          <template #default>
            <view>{{ item.SubCategory }}</view>
            <view>{{ item.Value }}</view>
          </template>
        </wd-grid-item>
      </wd-grid>
      <text>库龄占比图</text>
      <qiun-data-charts
        type="pie"
        :opts="GoodsInventoryAnalysisOpts"
        :chartData="GoodsInventoryAnalysisChartData"
      />
      <text>客户库存排行</text>
      <qiun-data-charts
        type="bar"
        :opts="CustomerInventoryOpts"
        :chartData="CustomerInventoryChartdata"
      />
    </wd-card>
    <!-- 各工序产量分析 -->
    <wd-card type="rectangle" title="工序产量统计(吨)">
      <next-table
        :show-header="true"
        :columns="AnalysisOrderCol"
        :stripe="true"
        :fit="false"
        :border="true"
        :data="AnalysisOrderList"
      ></next-table>
    </wd-card>
    <!-- 接单量情况分析 -->
    <wd-card type="rectangle" title="模具库存(套)">
      <wd-grid border :column="3">
        <wd-grid-item use-slot v-for="(item, index) in GoodsInventoryAnalysisGrid" :key="index">
          <template #default>
            <view>{{ item.SubCategory }}</view>
            <view>{{ item.Value }}</view>
          </template>
        </wd-grid-item>
      </wd-grid>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

import { ref } from 'vue'

const date = dayjs().format('YYYY-MM-DD')

// #region 当日铝锭价
const ALIngotsTodayPriceTitle = ref(`铝锭价(元/吨)   ${date}`)
const ALIngotsTodayPriceList = ref([
  {
    ALIngotsType: '南海有色',
    lowPrice: 19800,
    averagePrice: 20800,
    highPrice: 21180,
  },
  {
    ALIngotsType: '长江有色',
    lowPrice: 19800,
    averagePrice: 20800,
    highPrice: 21180,
  },
])

const ALIngotsTodayPriceCol = ref([
  { name: 'ALIngotsType', label: '铝锭类型', width: 80 },
  { name: 'lowPrice', label: '最低价', width: 80 },
  { name: 'averagePrice', label: '平均价', width: 80 },
  { name: 'highPrice', label: '最高价', width: 80 },
])
// #endregion

// #region 接单量情况分析
const AnalysisOrderTitle = '接单量统计（吨）'
const AnalysisOrderGrid = ref([
  {
    date: '本日',
    orderNum: 200,
    girdItem: [
      {
        label: '环比',
        value: '+19%',
      },
      {
        label: '昨日',
        value: '182',
      },
    ],
  },
  {
    date: '本月',
    orderNum: 6800,
    girdItem: [
      {
        label: '环比',
        value: '+19%',
      },
      {
        label: '昨日',
        value: '182',
      },
    ],
  },
  {
    date: '本年',
    orderNum: 300000,
    girdItem: [
      {
        label: '环比',
        value: '+19%',
      },
      {
        label: '同比',
        value: '+19%',
      },
    ],
  },
])
const AnalysisOrderList = ref([
  {
    OrderCategory: 6,
    Today: 57,
    Yesterday: 26,
    ThisMonth: 2923,
    LastMonth: 1933,
    ThisYear: 16235,
  },
  {
    OrderCategory: 7,
    Today: 95,
    Yesterday: 45,
    ThisMonth: 552,
    LastMonth: 1089,
    ThisYear: 11002,
  },
  {
    OrderCategory: 3,
    Today: 50,
    Yesterday: 83,
    ThisMonth: 738,
    LastMonth: 2231,
    ThisYear: 21386,
  },
  {
    OrderCategory: 4,
    Today: 8,
    Yesterday: 91,
    ThisMonth: 703,
    LastMonth: 1,
    ThisYear: 17714,
  },
  {
    OrderCategory: 3,
    Today: 70,
    Yesterday: 7,
    ThisMonth: 1918,
    LastMonth: 2377,
    ThisYear: 113,
  },
])

const AnalysisOrderCol = ref([
  { name: 'OrderCategory', label: '接单类别', width: 70 },
  { name: 'Today', label: '今日', width: 70 },
  { name: 'Yesterday', label: '昨日', width: 70 },
  { name: 'ThisMonth', label: '本月同比', width: 70 },
  { name: 'LastMonth', label: '上月同比', width: 70 },
  { name: 'ThisYear', label: '本年同比', width: 70 },
])
// #endregion

// #region 销售量情况分析
const SaleAnalysisTitle = ref('销售量统计（吨）')
// #endregion

// #region 各工序待办库存
const TodoProcessInventoryTitle = ref('销售量统计（吨）')
const TodoProcessInventoryGrid = [
  { Category: '待挤压', Value: 358 },
  { Category: '待时效', Value: 58 },
  { Category: '待氧化', Value: 215 },
  { Category: '待喷涂', Value: 180 },
  { Category: '待木纹', Value: 56 },
  { Category: '待注胶', Value: 20 },
  { Category: '待穿条', Value: 119 },
  { Category: '待锯切', Value: 80 },
  { Category: '待包装', Value: 120 },
]

// #endregion
// #region 铝棒库存
const AluminumRodStockTitle = ref('铝棒库存（吨）')
const AluminumRodStockCol = ref([
  { name: 'Material', label: '材质', width: 80 },
  { name: 'RodDiameter', label: '棒径', width: 80 },
  { name: 'StockWeight', label: '库存重量', width: 80 },
  { name: 'UnextrudedWeight', label: '未挤压重量', width: 80 },
  { name: 'Variation', label: '差异', width: 80 },
])

const AluminumRodStockList = ref([
  {
    Material: 23333,
    RodDiameter: 23333,
    StockWeight: 23333,
    UnextrudedWeight: 23333,
    Variation: 23333,
  },
  {
    Material: 23333,
    RodDiameter: 23333,
    StockWeight: 23333,
    UnextrudedWeight: 23333,
    Variation: 23333,
  },
  {
    Material: 23333,
    RodDiameter: 23333,
    StockWeight: 23333,
    UnextrudedWeight: 23333,
    Variation: 23333,
  },
])
// #endregion
// #region 坯料库存
const BilletStockTitle = ref('坯料库存（吨）')
const BilletStockGrid = [
  { SubCategory: '坯料总库存', Value: 530 },
  { SubCategory: '坯料', Value: 58 },
  { SubCategory: '氧化', Value: 215 },
  { SubCategory: '喷涂', Value: 180 },
  { SubCategory: '喷涂配套', Value: 56 },
]
// #endregion
// #region 成品库存分析
const GoodsInventoryAnalysisTitle = ref('成品库存（吨）')
const GoodsInventoryAnalysisGrid = [
  { SubCategory: '成品总库存', Value: 530 },
  { SubCategory: '订单库存', Value: 58 },
  { SubCategory: '留用库存', Value: 215 },
  { SubCategory: '订单配套库存', Value: 180 },
  { SubCategory: '订单齐套率', Value: 56 },
]
const GoodsInventoryAnalysisChartData = ref({})
// 您可以通过修改 config-ucharts.js 文件中下标为 ['pie'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。

const GoodsInventoryAnalysisOpts = ref({
  color: [
    '#1890FF',
    '#91CB74',
    '#FAC858',
    '#EE6666',
    '#73C0DE',
    '#3CA272',
    '#FC8452',
    '#9A60B4',
    '#ea7ccc',
  ],
  padding: [5, 5, 5, 5],
  enableScroll: false,
  extra: {
    pie: {
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: false,
      borderWidth: 3,
      borderColor: '#FFFFFF',
    },
  },
})
console.log('GoodsInventoryAnalysisOpts.value', GoodsInventoryAnalysisOpts.value)

const getServerData = () => {
  // 模拟从服务器获取数据时的延时
  setTimeout(() => {
    // 模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    const res = {
      series: [
        {
          data: [
            { name: '一班', value: 50 },
            { name: '二班', value: 30 },
            { name: '三班', value: 20 },
            { name: '四班', value: 18 },
            { name: '五班', value: 8 },
          ],
        },
      ],
    }
    GoodsInventoryAnalysisChartData.value = JSON.parse(JSON.stringify(res))
  }, 500)
}
const CustomerInventoryOpts = ref({
  color: [
    '#1890FF',
    '#91CB74',
    '#FAC858',
    '#EE6666',
    '#73C0DE',
    '#3CA272',
    '#FC8452',
    '#9A60B4',
    '#ea7ccc',
  ],
  padding: [15, 30, 0, 5],
  enableScroll: false,
  legend: {},
  xAxis: {
    boundaryGap: 'justify',
    disableGrid: false,
    min: 0,
    axisLine: false,
    max: 40,
  },
  yAxis: {},
  extra: {
    bar: {
      type: 'group',
      width: 30,
      meterBorde: 1,
      meterFillColor: '#FFFFFF',
      activeBgColor: '#000000',
      activeBgOpacity: 0.08,
      linearType: 'custom',
      barBorderCircle: true,
      seriesGap: 2,
      categoryGap: 2,
    },
  },
})
const CustomerInventoryChartdata = ref({})
const CustomerInventoryGetServerData = () => {
  // 模拟从服务器获取数据时的延时
  setTimeout(() => {
    // 模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    const res = {
      categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
      series: [
        {
          name: '目标值',
          data: [35, 36, 31, 33, 13, 34],
        },
        {
          name: '完成量',
          data: [18, 27, 21, 24, 6, 28],
        },
      ],
    }
    CustomerInventoryChartdata.value = JSON.parse(JSON.stringify(res))
  }, 500)
}

// #endregion

onMounted(() => {
  getServerData()
  CustomerInventoryGetServerData()
})
</script>

<style lang="scss" scoped></style>
