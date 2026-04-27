export const sampleSalesData = [
  { month: '1月', sales: 1200, profit: 300, region: '东部' },
  { month: '2月', sales: 1500, profit: 450, region: '东部' },
  { month: '3月', sales: 1800, profit: 520, region: '东部' },
  { month: '4月', sales: 2200, profit: 680, region: '东部' },
  { month: '5月', sales: 1900, profit: 550, region: '东部' },
  { month: '6月', sales: 2500, profit: 750, region: '东部' },
  { month: '7月', sales: 2800, profit: 850, region: '东部' },
  { month: '8月', sales: 2600, profit: 780, region: '东部' },
  { month: '9月', sales: 3000, profit: 920, region: '东部' },
  { month: '10月', sales: 3200, profit: 1000, region: '东部' },
  { month: '11月', sales: 3500, profit: 1100, region: '东部' },
  { month: '12月', sales: 4000, profit: 1300, region: '东部' }
]

export const samplePopulationData = [
  { city: '北京', population: 2154, gdp: 36102, growth: 3.2 },
  { city: '上海', population: 2428, gdp: 38700, growth: 4.1 },
  { city: '广州', population: 1881, gdp: 24000, growth: 5.2 },
  { city: '深圳', population: 1756, gdp: 26927, growth: 6.0 },
  { city: '杭州', population: 1036, gdp: 18109, growth: 5.5 },
  { city: '成都', population: 1658, gdp: 17717, growth: 4.8 },
  { city: '武汉', population: 1108, gdp: 16900, growth: 5.1 },
  { city: '南京', population: 942, gdp: 15500, growth: 4.5 }
]

export const sampleTimeSeriesData = [
  { date: '2023-01', visits: 12000, conversions: 360, bounceRate: 45 },
  { date: '2023-02', visits: 14500, conversions: 435, bounceRate: 42 },
  { date: '2023-03', visits: 16800, conversions: 520, bounceRate: 38 },
  { date: '2023-04', visits: 18200, conversions: 580, bounceRate: 35 },
  { date: '2023-05', visits: 21000, conversions: 650, bounceRate: 32 },
  { date: '2023-06', visits: 24500, conversions: 720, bounceRate: 29 },
  { date: '2023-07', visits: 28000, conversions: 840, bounceRate: 26 },
  { date: '2023-08', visits: 31200, conversions: 936, bounceRate: 24 },
  { date: '2023-09', visits: 29500, conversions: 885, bounceRate: 27 },
  { date: '2023-10', visits: 33000, conversions: 990, bounceRate: 23 },
  { date: '2023-11', visits: 36500, conversions: 1095, bounceRate: 21 },
  { date: '2023-12', visits: 42000, conversions: 1260, bounceRate: 18 }
]

export const createSampleStory = () => {
  return {
    id: 'story_sample_001',
    title: '2023年度销售业绩分析',
    description: '通过滚动叙事的方式，深入分析公司2023年度的销售数据和业务增长情况。',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    datasets: [
      {
        id: 'dataset_sales_001',
        name: '月度销售数据',
        data: sampleSalesData,
        columns: ['month', 'sales', 'profit', 'region'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'dataset_metrics_001',
        name: '网站运营指标',
        data: sampleTimeSeriesData,
        columns: ['date', 'visits', 'conversions', 'bounceRate'],
        createdAt: new Date().toISOString()
      }
    ],
    nodes: [
      {
        id: 'node_001',
        type: 'text',
        content: `# 2023年度销售业绩分析

欢迎来到ScrollStat数据可视化故事。随着屏幕滚动，您将看到数据图表会根据阅读进度进行平滑过渡和动画更新。

## 故事概览

在这个故事中，我们将带您回顾公司在2023年度的销售表现。您将看到：
- 月度销售趋势
- 利润增长分析
- 不同视角的数据解读

向下滚动继续您的数据探索之旅...`,
        position: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_002',
        type: 'chart',
        chartConfig: {
          datasetId: 'dataset_sales_001',
          chartType: 'bar',
          xAxis: 'month',
          yAxis: 'sales',
          title: '2023年月度销售额',
          description: '查看全年12个月的销售数据变化趋势',
          filters: [],
          animation: true
        },
        position: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_003',
        type: 'text',
        content: `## 销售数据分析

从上面的柱状图可以看出，公司在2023年的销售额呈现出稳步上升的趋势。

### 关键观察：
1. **年初起步稳健**：1-3月销售额从1,200增长到1,800，Q1表现良好
2. **Q2增速加快**：4-6月销售额从2,200增长到2,500，呈现加速增长态势
3. **下半年持续增长**：Q3和Q4继续保持上升趋势，12月达到全年最高4,000

接下来，让我们看看利润方面的数据...`,
        position: 2,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_004',
        type: 'chart',
        chartConfig: {
          datasetId: 'dataset_sales_001',
          chartType: 'line',
          xAxis: 'month',
          yAxis: 'profit',
          title: '2023年月度利润趋势',
          description: '利润增长与销售额的对比分析',
          filters: [],
          animation: true
        },
        position: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_005',
        type: 'text',
        content: `## 剧情岔路口：选择您感兴趣的分析视角

现在是一个关键节点，您可以选择不同的分析视角来继续探索数据。`,
        position: 4,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_006',
        type: 'branch',
        options: [
          {
            id: 'option_a',
            label: '📊 销售与利润对比',
            nextNodeId: 'node_007_a',
            chartFilters: [],
            description: '查看销售额和利润的对比分析'
          },
          {
            id: 'option_b',
            label: '📈 网站运营指标',
            nextNodeId: 'node_007_b',
            chartFilters: [],
            description: '切换到网站访问量和转化率分析'
          }
        ],
        position: 5,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_007_a',
        type: 'chart',
        chartConfig: {
          datasetId: 'dataset_sales_001',
          chartType: 'line',
          xAxis: 'month',
          yAxis: 'sales',
          secondaryYAxis: 'profit',
          title: '销售额与利润对比分析',
          description: '两条曲线展示销售和利润的同步增长',
          filters: [],
          animation: true
        },
        position: 6,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_007_b',
        type: 'chart',
        chartConfig: {
          datasetId: 'dataset_metrics_001',
          chartType: 'line',
          xAxis: 'date',
          yAxis: 'visits',
          title: '网站访问量趋势',
          description: '2023年网站月度访问量变化',
          filters: [],
          animation: true
        },
        position: 6,
        createdAt: new Date().toISOString()
      },
      {
        id: 'node_008',
        type: 'text',
        content: `## 总结

无论您选择了哪条分析路径，我们都可以得出一个明确的结论：

**2023年是公司稳步增长的一年！**

### 核心亮点：
- 销售额全年增长 **233%**
- 利润率保持在 **25-32%** 区间
- 业务发展势头强劲

感谢您使用ScrollStat体验数据叙事！`,
        position: 7,
        createdAt: new Date().toISOString()
      }
    ],
    branches: [
      {
        id: 'branch_001',
        fromNodeId: 'node_006',
        options: [
          {
            id: 'option_a',
            nextNodeId: 'node_007_a'
          },
          {
            id: 'option_b',
            nextNodeId: 'node_007_b'
          }
        ]
      }
    ]
  }
}
