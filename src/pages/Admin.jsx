import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Papa from 'papaparse'
import { storage } from '../data/storage'
import { ChartTypes, createDataset, createTextNode, createChartNode, createBranchNode, createChartConfig, createBranchOption } from '../data/models'
import { BarChart, LineChart, ScatterChart } from '../components/charts'

function Admin() {
  return (
    <Routes>
      <Route index element={<StoryList />} />
      <Route path="story/:id" element={<StoryEditor />} />
      <Route path="create" element={<CreateStory />} />
    </Routes>
  )
}

function StoryList() {
  const [stories, setStories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setStories(storage.getStories())
  }, [])

  const handleDelete = (id) => {
    if (confirm('确定要删除这个故事吗？')) {
      storage.deleteStory(id)
      setStories(storage.getStories())
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">故事管理</h1>
          <p className="text-gray-600 mt-2">管理您的数据可视化故事</p>
        </div>
        <button
          onClick={() => navigate('/admin/create')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建故事
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无故事</h3>
          <p className="text-gray-500 mb-6">点击上方按钮创建您的第一个数据可视化故事</p>
          <button
            onClick={() => navigate('/admin/create')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            创建故事
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">📊</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {story.description || '暂无描述'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{story.datasets?.length || 0} 个数据集</span>
                  <span>{story.nodes?.length || 0} 个节点</span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/admin/story/${story.id}`}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-center hover:bg-blue-100 transition-colors"
                  >
                    编辑
                  </Link>
                  <Link
                    to={`/story/${story.id}`}
                    className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-medium text-center hover:bg-gray-100 transition-colors"
                    target="_blank"
                  >
                    预览
                  </Link>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function CreateStory() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      const story = storage.createStory(title.trim(), description.trim())
      navigate(`/admin/story/${story.id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">创建新故事</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              故事标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入一个吸引人的标题..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              故事描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简要描述这个故事的内容..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              创建故事
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function StoryEditor() {
  const { id } = useParams()
  const [story, setStory] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const storyData = storage.getStory(id)
    if (storyData) {
      setStory(storyData)
    }
  }, [id])

  const refreshStory = () => {
    const storyData = storage.getStory(id)
    if (storyData) {
      setStory(storyData)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const columns = results.meta.fields
        const data = results.data.filter(row => Object.values(row).some(v => v !== null && v !== ''))
        
        if (data.length > 0) {
          const dataset = createDataset(file.name, data, columns)
          storage.addDataset(id, dataset)
          refreshStory()
        }
        setIsImporting(false)
      },
      error: () => {
        alert('文件解析失败')
        setIsImporting(false)
      }
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdateTitle = (newTitle) => {
    storage.updateStory(id, { title: newTitle })
    refreshStory()
  }

  const handleRemoveDataset = (datasetId) => {
    if (confirm('确定要删除这个数据集吗？')) {
      storage.removeDataset(id, datasetId)
      refreshStory()
    }
  }

  const handleAddNode = (type) => {
    const position = story.nodes.length
    
    let newNode
    switch (type) {
      case 'text':
        newNode = createTextNode('在这里输入您的文本内容...', position)
        break
      case 'chart':
        if (story.datasets.length === 0) {
          alert('请先导入数据集')
          return
        }
        const defaultDataset = story.datasets[0]
        const config = createChartConfig({
          datasetId: defaultDataset.id,
          chartType: ChartTypes.BAR,
          xAxis: defaultDataset.columns[0],
          yAxis: defaultDataset.columns[1] || defaultDataset.columns[0],
          title: '新图表',
          description: '图表描述'
        })
        newNode = createChartNode(config, position)
        break
      case 'branch':
        const options = [
          createBranchOption('选项 A'),
          createBranchOption('选项 B')
        ]
        newNode = createBranchNode(options, position)
        break
      default:
        return
    }
    
    storage.addNode(id, newNode)
    refreshStory()
  }

  const handleRemoveNode = (nodeId) => {
    if (confirm('确定要删除这个节点吗？')) {
      storage.removeNode(id, nodeId)
      refreshStory()
    }
  }

  const handleUpdateNode = (nodeId, updates) => {
    storage.updateNode(id, nodeId, updates)
    refreshStory()
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: '概览', icon: '📋' },
    { id: 'datasets', label: '数据集', icon: '📊' },
    { id: 'editor', label: '编辑器', icon: '✏️' },
    { id: 'preview', label: '预览', icon: '👁️' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <input
                type="text"
                value={story.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-1 py-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/story/${story.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                预览
              </a>
              <Link
                to="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                返回列表
              </Link>
            </div>
          </div>
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">数据集数量</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {story.datasets?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">节点数量</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {story.nodes?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">最后更新</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(story.updatedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🕐</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'datasets' && (
            <motion.div
              key="datasets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                    isImporting 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}>
                    {isImporting ? (
                      <div>
                        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-blue-600 font-medium">导入中...</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-700 font-medium mb-1">点击上传 CSV 文件</p>
                        <p className="text-sm text-gray-500">支持 .csv 格式的结构化数据</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {story.datasets?.length > 0 ? (
                <div className="space-y-4">
                  {story.datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-lg">📊</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                            <p className="text-sm text-gray-500">
                              {dataset.data.length} 行 × {dataset.columns.length} 列
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveDataset(dataset.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              {dataset.columns.map((col) => (
                                <th
                                  key={col}
                                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {dataset.data.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-50">
                                {dataset.columns.map((col, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap"
                                  >
                                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {dataset.data.length > 5 && (
                          <p className="text-sm text-gray-500 mt-2 text-center">
                            还有 {dataset.data.length - 5} 行数据...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">暂无数据集，请上传 CSV 文件</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid lg:grid-cols-4 gap-6"
            >
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
                  <h3 className="font-semibold text-gray-900 mb-4">添加节点</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAddNode('text')}
                      className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    >
                      <span className="text-xl mr-3">📝</span>
                      <div>
                        <p className="font-medium text-gray-900">文本节点</p>
                        <p className="text-xs text-gray-500">添加故事内容文本</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleAddNode('chart')}
                      disabled={story.datasets?.length === 0}
                      className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-xl mr-3">📊</span>
                      <div>
                        <p className="font-medium text-gray-900">图表节点</p>
                        <p className="text-xs text-gray-500">添加数据可视化图表</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleAddNode('branch')}
                      className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    >
                      <span className="text-xl mr-3">🔀</span>
                      <div>
                        <p className="font-medium text-gray-900">岔路口节点</p>
                        <p className="text-xs text-gray-500">添加剧情分支选择</p>
                      </div>
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">节点列表</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {story.nodes?.map((node, index) => (
                        <div
                          key={node.id}
                          className="flex items-center px-3 py-2 bg-gray-50 rounded-lg text-sm"
                        >
                          <span className="mr-2">
                            {node.type === 'text' && '📝'}
                            {node.type === 'chart' && '📊'}
                            {node.type === 'branch' && '🔀'}
                          </span>
                          <span className="text-gray-700 truncate flex-1">
                            {index + 1}. {node.type === 'text' ? '文本' : node.type === 'chart' ? '图表' : '岔路口'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                {story.nodes?.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">故事为空</h3>
                    <p className="text-gray-500">从左侧添加节点开始创作您的数据可视化故事</p>
                  </div>
                ) : (
                  story.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">
                            {node.type === 'text' && '📝 文本节点'}
                            {node.type === 'chart' && '📊 图表节点'}
                            {node.type === 'branch' && '🔀 岔路口节点'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveNode(node.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-6">
                        {node.type === 'text' && (
                          <textarea
                            value={node.content}
                            onChange={(e) => handleUpdateNode(node.id, { content: e.target.value })}
                            placeholder="在这里输入文本内容，支持简单的 Markdown 格式：\n# 标题\n## 二级标题\n**粗体**\n- 列表项"
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none font-mono text-sm"
                          />
                        )}

                        {node.type === 'chart' && (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  数据集
                                </label>
                                <select
                                  value={node.chartConfig?.datasetId || ''}
                                  onChange={(e) => {
                                    const dataset = story.datasets.find(d => d.id === e.target.value)
                                    handleUpdateNode(node.id, {
                                      chartConfig: {
                                        ...node.chartConfig,
                                        datasetId: e.target.value,
                                        xAxis: dataset?.columns[0] || '',
                                        yAxis: dataset?.columns[1] || dataset?.columns[0] || ''
                                      }
                                    })
                                  }}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                  {story.datasets.map((ds) => (
                                    <option key={ds.id} value={ds.id}>
                                      {ds.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  图表类型
                                </label>
                                <select
                                  value={node.chartConfig?.chartType || ChartTypes.BAR}
                                  onChange={(e) => handleUpdateNode(node.id, {
                                    chartConfig: { ...node.chartConfig, chartType: e.target.value }
                                  })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                  <option value={ChartTypes.BAR}>柱状图</option>
                                  <option value={ChartTypes.LINE}>折线图</option>
                                  <option value={ChartTypes.SCATTER}>散点图</option>
                                </select>
                              </div>
                            </div>

                            {(() => {
                              const dataset = story.datasets.find(d => d.id === node.chartConfig?.datasetId)
                              return dataset ? (
                                <div className="grid md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      X 轴字段
                                    </label>
                                    <select
                                      value={node.chartConfig?.xAxis || ''}
                                      onChange={(e) => handleUpdateNode(node.id, {
                                        chartConfig: { ...node.chartConfig, xAxis: e.target.value }
                                      })}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                      {dataset.columns.map((col) => (
                                        <option key={col} value={col}>{col}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Y 轴字段
                                    </label>
                                    <select
                                      value={node.chartConfig?.yAxis || ''}
                                      onChange={(e) => handleUpdateNode(node.id, {
                                        chartConfig: { ...node.chartConfig, yAxis: e.target.value }
                                      })}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                      {dataset.columns.map((col) => (
                                        <option key={col} value={col}>{col}</option>
                                      ))}
                                    </select>
                                  </div>
                                  {node.chartConfig?.chartType === ChartTypes.LINE && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        次 Y 轴（可选）
                                      </label>
                                      <select
                                        value={node.chartConfig?.secondaryYAxis || ''}
                                        onChange={(e) => handleUpdateNode(node.id, {
                                          chartConfig: { ...node.chartConfig, secondaryYAxis: e.target.value || undefined }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                      >
                                        <option value="">无</option>
                                        {dataset.columns.map((col) => (
                                          <option key={col} value={col}>{col}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              ) : null
                            })()}

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  图表标题
                                </label>
                                <input
                                  type="text"
                                  value={node.chartConfig?.title || ''}
                                  onChange={(e) => handleUpdateNode(node.id, {
                                    chartConfig: { ...node.chartConfig, title: e.target.value }
                                  })}
                                  placeholder="输入图表标题"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  图表描述
                                </label>
                                <input
                                  type="text"
                                  value={node.chartConfig?.description || ''}
                                  onChange={(e) => handleUpdateNode(node.id, {
                                    chartConfig: { ...node.chartConfig, description: e.target.value }
                                  })}
                                  placeholder="输入图表描述"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                            </div>

                            {(() => {
                              const dataset = story.datasets.find(d => d.id === node.chartConfig?.datasetId)
                              if (!dataset || !dataset.data) return null
                              
                              const chartProps = {
                                data: dataset.data,
                                xAxis: node.chartConfig?.xAxis || dataset.columns[0],
                                yAxis: node.chartConfig?.yAxis || dataset.columns[1],
                                secondaryYAxis: node.chartConfig?.secondaryYAxis,
                                title: node.chartConfig?.title,
                                description: node.chartConfig?.description,
                                animation: false
                              }

                              return (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                  <h4 className="text-sm font-medium text-gray-700 mb-4">实时预览</h4>
                                  {node.chartConfig?.chartType === ChartTypes.BAR && <BarChart {...chartProps} />}
                                  {node.chartConfig?.chartType === ChartTypes.LINE && <LineChart {...chartProps} />}
                                  {node.chartConfig?.chartType === ChartTypes.SCATTER && <ScatterChart {...chartProps} />}
                                </div>
                              )
                            })()}
                          </div>
                        )}

                        {node.type === 'branch' && (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">添加岔路口选项，让读者选择不同的叙事路径：</p>
                            
                            <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                              <p className="text-sm font-medium text-blue-800 mb-2">📋 使用说明：</p>
                              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                <li>每个选项可以关联一个"跳转目标节点"（nextNodeId）</li>
                                <li>同一 position 的多个节点会被视为"平行节点"，只能显示一个</li>
                                <li>读者选择选项后，会显示该选项关联的节点，隐藏其他选项的节点</li>
                              </ul>
                            </div>
                            
                            <div className="space-y-4">
                              {node.options?.map((option, optIndex) => {
                                const otherNodes = story.nodes.filter(n => n.id !== node.id)
                                
                                return (
                                  <div
                                    key={option.id}
                                    className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                                  >
                                    <div className="flex items-center gap-3 mb-3">
                                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-sm">
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) => {
                                          const newOptions = [...node.options]
                                          newOptions[optIndex] = { ...option, label: e.target.value }
                                          handleUpdateNode(node.id, { options: newOptions })
                                        }}
                                        placeholder="选项标签（如：📊 销售分析）"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                      />
                                      {node.options.length > 2 && (
                                        <button
                                          onClick={() => {
                                            const newOptions = node.options.filter((_, i) => i !== optIndex)
                                            handleUpdateNode(node.id, { options: newOptions })
                                          }}
                                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                          title="删除选项"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          跳转目标节点 (nextNodeId)
                                        </label>
                                        <select
                                          value={option.nextNodeId || ''}
                                          onChange={(e) => {
                                            const newOptions = [...node.options]
                                            newOptions[optIndex] = { 
                                              ...option, 
                                              nextNodeId: e.target.value || undefined 
                                            }
                                            handleUpdateNode(node.id, { options: newOptions })
                                          }}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        >
                                          <option value="">-- 不设置跳转节点 --</option>
                                          {otherNodes.map((n, idx) => (
                                            <option key={n.id} value={n.id}>
                                              [{n.position}] {n.type === 'text' ? '📝 文本节点' : n.type === 'chart' ? `📊 图表: ${n.chartConfig?.title || '未命名'}` : n.type === 'branch' ? '🔀 岔路口' : '未知节点'}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          选项描述
                                        </label>
                                        <input
                                          type="text"
                                          value={option.description || ''}
                                          onChange={(e) => {
                                            const newOptions = [...node.options]
                                            newOptions[optIndex] = { ...option, description: e.target.value }
                                            handleUpdateNode(node.id, { options: newOptions })
                                          }}
                                          placeholder="简短描述这个选项的内容"
                                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                      </div>
                                    </div>
                                    
                                    {option.nextNodeId && (
                                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-700">
                                          ✅ 已关联节点：
                                          <span className="font-medium ml-1">
                                            {(() => {
                                              const targetNode = story.nodes.find(n => n.id === option.nextNodeId)
                                              if (targetNode) {
                                                return `[Position ${targetNode.position}] ${targetNode.type === 'text' ? '📝 文本节点' : targetNode.type === 'chart' ? `📊 ${targetNode.chartConfig?.title || '图表'}` : '🔀 岔路口'}`
                                              }
                                              return '节点不存在'
                                            })()}
                                          </span>
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                          提示：如果有其他节点使用相同的 position，它们会被视为平行节点，只有选中选项对应的节点会显示
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                            
                            {node.options?.length < 4 && (
                              <button
                                onClick={() => {
                                  const newOption = createBranchOption(`选项 ${String.fromCharCode(65 + node.options.length)}`)
                                  handleUpdateNode(node.id, { options: [...node.options, newOption] })
                                }}
                                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                              >
                                + 添加选项
                              </button>
                            )}
                            
                            <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                              <p className="text-sm font-medium text-gray-700 mb-3">📖 当前节点列表（参考用）：</p>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {story.nodes?.map((n, idx) => (
                                  <div 
                                    key={n.id} 
                                    className={`flex items-center p-2 rounded-lg text-sm ${
                                      n.id === node.id 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-white border border-gray-200'
                                    }`}
                                  >
                                    <span className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-mono mr-2">
                                      {n.position}
                                    </span>
                                    <span className="mr-2">
                                      {n.type === 'text' && '📝'}
                                      {n.type === 'chart' && '📊'}
                                      {n.type === 'branch' && '🔀'}
                                    </span>
                                    <span className="flex-1 truncate">
                                      {n.type === 'text' ? (n.content?.substring(0, 30) || '文本节点') : 
                                       n.type === 'chart' ? (n.chartConfig?.title || '图表节点') : 
                                       n.type === 'branch' ? `岔路口 (${n.options?.length || 0}个选项)` : '未知节点'}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono ml-2">
                                      {n.id.substring(0, 12)}...
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
            >
              <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">在新窗口预览</h3>
              <p className="text-gray-500 mb-6">点击下方按钮在新窗口中预览您的数据可视化故事</p>
              <a
                href={`/story/${story.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                打开预览
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Admin
