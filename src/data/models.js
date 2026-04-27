export const ChartTypes = {
  BAR: 'bar',
  LINE: 'line',
  SCATTER: 'scatter'
}

export const NodeTypes = {
  TEXT: 'text',
  CHART: 'chart',
  BRANCH: 'branch'
}

export const createStory = (title, description = '') => ({
  id: `story_${Date.now()}`,
  title,
  description,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  datasets: [],
  nodes: [],
  branches: []
})

export const createDataset = (name, data, columns) => ({
  id: `dataset_${Date.now()}`,
  name,
  data,
  columns,
  createdAt: new Date().toISOString()
})

export const createTextNode = (content, position) => ({
  id: `node_${Date.now()}`,
  type: NodeTypes.TEXT,
  content,
  position,
  createdAt: new Date().toISOString()
})

export const createChartNode = (chartConfig, position) => ({
  id: `node_${Date.now()}`,
  type: NodeTypes.CHART,
  chartConfig,
  position,
  createdAt: new Date().toISOString()
})

export const createBranchNode = (options, position) => ({
  id: `node_${Date.now()}`,
  type: NodeTypes.BRANCH,
  options,
  position,
  createdAt: new Date().toISOString()
})

export const createChartConfig = ({
  datasetId,
  chartType,
  xAxis,
  yAxis,
  title = '',
  description = '',
  filters = [],
  animation = true
}) => ({
  datasetId,
  chartType,
  xAxis,
  yAxis,
  title,
  description,
  filters,
  animation
})

export const createBranchOption = (label, nextNodeId = null, chartFilters = []) => ({
  id: `option_${Date.now()}`,
  label,
  nextNodeId,
  chartFilters
})
