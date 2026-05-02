const growthTemplates = [
  { threshold: 3.0, text: '这里涨了{growth}倍，增长惊人！' },
  { threshold: 2.0, text: '这里涨了快两倍，表现相当不错！' },
  { threshold: 1.5, text: '这里涨了五成多，稳步上升中。' },
  { threshold: 1.2, text: '这里略有上涨，保持平稳。' },
  { threshold: 0.9, text: '这里基本持平，变化不大。' },
  { threshold: 0.7, text: '这里有所下降，需要关注。' },
  { threshold: 0.5, text: '这里下降了三成，下降比较明显。' },
  { threshold: 0, text: '这里下降了超过一半，下降幅度较大。' }
]

const peakTemplates = [
  '这里达到了最高点！',
  '这是数据的峰值所在。',
  '这里是整个周期的最高点。'
]

const lowTemplates = [
  '这里是数据的低点。',
  '这是整个周期的谷底。',
  '这里跌到了最低点。'
]

const trendTemplates = {
  up: [
    '整体呈上升趋势，一路走高。',
    '数据持续增长，势头不错。',
    '整体向上，增长稳定。'
  ],
  down: [
    '整体呈下降趋势。',
    '数据持续走低。',
    '整体向下，需要关注。'
  ],
  stable: [
    '整体比较平稳，波动不大。',
    '数据保持相对稳定。',
    '整体波动很小，表现平稳。'
  ]
}

function getGrowthRate(firstValue, lastValue) {
  if (firstValue === 0) return 1
  return lastValue / firstValue
}

function formatGrowthRate(growth) {
  if (growth >= 1) {
    const times = (growth - 1) * 100
    if (times >= 100) {
      return (times / 100).toFixed(1)
    }
    return `${times.toFixed(0)}%`
  } else {
    const decrease = (1 - growth) * 100
    return `下降${decrease.toFixed(0)}%`
  }
}

function getMaxMin(data, yAxis) {
  if (!data || data.length === 0) return null
  
  let maxValue = -Infinity
  let minValue = Infinity
  let maxIndex = 0
  let minIndex = 0
  
  data.forEach((item, index) => {
    const value = item[yAxis]
    if (value > maxValue) {
      maxValue = value
      maxIndex = index
    }
    if (value < minValue) {
      minValue = value
      minIndex = index
    }
  })
  
  return {
    max: { value: maxValue, index: maxIndex, item: data[maxIndex] },
    min: { value: minValue, index: minIndex, item: data[minIndex] }
  }
}

function getOverallTrend(data, yAxis) {
  if (!data || data.length < 2) return 'stable'
  
  const firstHalf = data.slice(0, Math.ceil(data.length / 2))
  const secondHalf = data.slice(Math.floor(data.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, item) => sum + item[yAxis], 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, item) => sum + item[yAxis], 0) / secondHalf.length
  
  const change = (secondAvg - firstAvg) / firstAvg
  
  if (change > 0.15) return 'up'
  if (change < -0.15) return 'down'
  return 'stable'
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateDataInsight(data, chartConfig) {
  if (!data || data.length === 0) return null
  
  const { xAxis, yAxis, secondaryYAxis, title } = chartConfig
  
  const stats = getMaxMin(data, yAxis)
  if (!stats) return null
  
  const insights = []
  
  const growth = getGrowthRate(data[0][yAxis], data[data.length - 1][yAxis])
  const growthFormatted = formatGrowthRate(growth)
  
  for (const template of growthTemplates) {
    if (growth >= template.threshold) {
      let text = template.text.replace('{growth}', growthFormatted)
      if (growth < 1) {
        if (template.text.includes('涨')) {
          text = `这里${growthFormatted}，需要关注。`
        }
      }
      insights.push({
        type: 'growth',
        text,
        priority: 2
      })
      break
    }
  }
  
  if (stats.max.index === data.length - 1) {
    insights.push({
      type: 'peak',
      text: randomPick(peakTemplates),
      priority: 3
    })
  }
  
  if (stats.min.index === data.length - 1) {
    insights.push({
      type: 'low',
      text: randomPick(lowTemplates),
      priority: 3
    })
  }
  
  const trend = getOverallTrend(data, yAxis)
  const trendTexts = trendTemplates[trend]
  if (trendTexts && trendTexts.length > 0) {
    insights.push({
      type: 'trend',
      text: randomPick(trendTexts),
      priority: 1
    })
  }
  
  if (secondaryYAxis) {
    const secondaryGrowth = getGrowthRate(data[0][secondaryYAxis], data[data.length - 1][secondaryYAxis])
    const secondaryGrowthFormatted = formatGrowthRate(secondaryGrowth)
    
    if (secondaryGrowth >= 2) {
      insights.push({
        type: 'secondary',
        text: `${secondaryYAxis}也涨了${secondaryGrowthFormatted}，双增长！`,
        priority: 1
      })
    } else if (secondaryGrowth < 0.8) {
      insights.push({
        type: 'secondary',
        text: `${secondaryYAxis}${secondaryGrowthFormatted}，与${yAxis}走势不同。`,
        priority: 1
      })
    }
  }
  
  insights.sort((a, b) => b.priority - a.priority)
  
  const topInsights = insights.slice(0, 2)
  const combinedText = topInsights.map(i => i.text).join(' ')
  
  return {
    title: title || '数据解读',
    text: combinedText,
    details: {
      growth,
      max: stats.max,
      min: stats.min,
      trend,
      firstValue: data[0][yAxis],
      lastValue: data[data.length - 1][yAxis]
    }
  }
}

export function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}
