function getGrowthRate(firstValue, lastValue) {
  if (firstValue === 0) return 1
  return lastValue / firstValue
}

function getNetGrowth(growth) {
  return growth - 1
}

function formatNetGrowth(netGrowth) {
  if (netGrowth >= 0) {
    if (netGrowth >= 1) {
      return netGrowth.toFixed(1) + '倍'
    } else {
      return (netGrowth * 100).toFixed(0) + '%'
    }
  } else {
    const decrease = Math.abs(netGrowth)
    if (decrease >= 1) {
      return '下降' + decrease.toFixed(1) + '倍'
    } else {
      return '下降' + (decrease * 100).toFixed(0) + '%'
    }
  }
}

function generateGrowthText(netGrowth) {
  if (netGrowth >= 2) {
    return `这里涨了${formatNetGrowth(netGrowth)}，增长惊人！`
  }
  if (netGrowth >= 1.5) {
    return `这里涨了${formatNetGrowth(netGrowth)}，表现相当不错！`
  }
  if (netGrowth >= 1) {
    return `这里涨了${formatNetGrowth(netGrowth)}，增长一倍多！`
  }
  if (netGrowth >= 0.5) {
    return `这里涨了${formatNetGrowth(netGrowth)}，稳步上升中。`
  }
  if (netGrowth >= 0.2) {
    return `这里涨了${formatNetGrowth(netGrowth)}，保持平稳增长。`
  }
  if (netGrowth >= 0) {
    return `这里微涨${formatNetGrowth(netGrowth)}，变化不大。`
  }
  if (netGrowth >= -0.1) {
    return '这里基本持平，变化不大。'
  }
  if (netGrowth >= -0.3) {
    return `这里${formatNetGrowth(netGrowth)}，需要关注。`
  }
  if (netGrowth >= -0.5) {
    return `这里${formatNetGrowth(netGrowth)}，下降比较明显。`
  }
  return `这里${formatNetGrowth(netGrowth)}，下降幅度较大。`
}

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
  const netGrowth = getNetGrowth(growth)
  
  const growthText = generateGrowthText(netGrowth)
  insights.push({
    type: 'growth',
    text: growthText,
    priority: 2
  })
  
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
    const secondaryNetGrowth = getNetGrowth(secondaryGrowth)
    
    if (secondaryNetGrowth >= 1) {
      insights.push({
        type: 'secondary',
        text: `${secondaryYAxis}也涨了${formatNetGrowth(secondaryNetGrowth)}，双增长！`,
        priority: 1
      })
    } else if (secondaryNetGrowth <= -0.2) {
      insights.push({
        type: 'secondary',
        text: `${secondaryYAxis}${formatNetGrowth(secondaryNetGrowth)}，与${yAxis}走势不同。`,
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
      netGrowth,
      netGrowthFormatted: formatNetGrowth(netGrowth),
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
