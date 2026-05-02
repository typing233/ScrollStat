import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { storage } from '../data/storage'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useViewTracking } from '../hooks/useViewTracking'
import { BarChart, LineChart, ScatterChart } from '../components/charts'
import { generateDataInsight } from '../utils/dataInsight'
import DataInsightTooltip from '../components/DataInsightTooltip'
import ViewSummaryPanel from '../components/ViewSummaryPanel'

function Reader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [visibleNodes, setVisibleNodes] = useState([])
  const [branchDecisions, setBranchDecisions] = useState({})
  const { progress, currentNodeIndex, setNodeRef } = useScrollProgress()
  const [chartKey, setChartKey] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  
  const [currentInsight, setCurrentInsight] = useState(null)
  const [showInsight, setShowInsight] = useState(false)
  
  const {
    startTrackingNode,
    getSummary,
    resetTracking
  } = useViewTracking(id || 'default')

  useEffect(() => {
    const storyData = storage.getStory(id)
    if (storyData) {
      setStory(storyData)
    } else {
      navigate('/')
    }
  }, [id, navigate])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getFilteredNodes = useCallback(() => {
    if (!story) return []
    
    const branchNodes = story.nodes.filter(n => n.type === 'branch')
    const skippedNodes = new Set()
    
    const buildBranchOptionMapping = () => {
      const optionIdToNextNodeId = new Map()
      const branchToOptions = new Map()
      
      branchNodes.forEach(branchNode => {
        const optionIds = []
        branchNode.options?.forEach(option => {
          if (option.nextNodeId) {
            optionIdToNextNodeId.set(option.id, option.nextNodeId)
          }
          optionIds.push(option.id)
        })
        branchToOptions.set(branchNode.id, optionIds)
      })
      
      return { optionIdToNextNodeId, branchToOptions }
    }
    
    const buildParallelNodesMap = () => {
      const positionToNodes = new Map()
      story.nodes.forEach(node => {
        const pos = node.position
        if (!positionToNodes.has(pos)) {
          positionToNodes.set(pos, [])
        }
        positionToNodes.get(pos).push(node)
      })
      return positionToNodes
    }
    
    const { optionIdToNextNodeId, branchToOptions } = buildBranchOptionMapping()
    const positionToNodes = buildParallelNodesMap()
    
    const nextNodeIdToOptionId = new Map()
    optionIdToNextNodeId.forEach((nextNodeId, optionId) => {
      nextNodeIdToOptionId.set(nextNodeId, optionId)
    })
    
    const nodeIdToBranch = new Map()
    branchNodes.forEach(branchNode => {
      branchNode.options?.forEach(option => {
        if (option.nextNodeId) {
          nodeIdToBranch.set(option.nextNodeId, {
            branchNodeId: branchNode.id,
            optionId: option.id
          })
        }
      })
    })
    
    const branchNodesOrder = [...branchNodes].sort((a, b) => a.position - b.position)
    
    branchNodesOrder.forEach(branchNode => {
      const selectedOptionId = branchDecisions[branchNode.id]
      
      branchNode.options?.forEach(option => {
        if (!option.nextNodeId) return
        
        const isSelected = selectedOptionId === option.id
        
        if (!isSelected && selectedOptionId) {
          skippedNodes.add(option.nextNodeId)
          
          const nextNode = story.nodes.find(n => n.id === option.nextNodeId)
          if (nextNode) {
            const nextPosition = nextNode.position
            positionToNodes.get(nextPosition)?.forEach(node => {
              if (node.id !== option.nextNodeId) {
                const nodeBranchInfo = nodeIdToBranch.get(node.id)
                if (nodeBranchInfo) {
                  if (nodeBranchInfo.branchNodeId === branchNode.id && 
                      nodeBranchInfo.optionId !== selectedOptionId) {
                    skippedNodes.add(node.id)
                  }
                }
              }
            })
          }
        }
        
        if (!isSelected && !selectedOptionId) {
          if (branchNode.options?.[0]?.id === option.id) {
          } else {
            const firstOptionNextNodeId = branchNode.options?.[0]?.nextNodeId
            if (firstOptionNextNodeId && option.nextNodeId !== firstOptionNextNodeId) {
              skippedNodes.add(option.nextNodeId)
            }
          }
        }
      })
    })
    
    return story.nodes.filter(node => !skippedNodes.has(node.id))
  }, [story, branchDecisions])

  const filteredNodes = useMemo(() => getFilteredNodes(), [getFilteredNodes])

  useEffect(() => {
    if (filteredNodes.length > 0) {
      setVisibleNodes(filteredNodes.map(n => n.id))
    }
  }, [filteredNodes])

  useEffect(() => {
    if (filteredNodes.length > 0 && currentNodeIndex >= 0) {
      const currentNode = filteredNodes[currentNodeIndex]
      if (currentNode) {
        let nodeTitle = ''
        if (currentNode.type === 'chart' && currentNode.chartConfig?.title) {
          nodeTitle = currentNode.chartConfig.title
        } else if (currentNode.type === 'text') {
          const match = currentNode.content?.match(/^#+\s*(.+)$/m)
          if (match) nodeTitle = match[1]
        }
        
        startTrackingNode(currentNode.id, currentNode.type, nodeTitle)
        
        if (currentNode.type === 'chart' && currentNode.chartConfig && story) {
          const dataset = story.datasets?.find(d => d.id === currentNode.chartConfig.datasetId)
          if (dataset && dataset.data) {
            let data = dataset.data
            if (currentNode.chartConfig.filters && currentNode.chartConfig.filters.length > 0) {
              data = data.filter(item => {
                return currentNode.chartConfig.filters.every(filter => {
                  const [key, value] = Object.entries(filter)[0]
                  return item[key] === value
                })
              })
            }
            
            const insight = generateDataInsight(data, currentNode.chartConfig)
            if (insight) {
              setCurrentInsight(insight)
              setShowInsight(true)
            }
          }
        } else {
          setShowInsight(false)
        }
      }
    }
  }, [currentNodeIndex, filteredNodes, story, startTrackingNode])

  const handleBranchSelect = (branchNode, option) => {
    setBranchDecisions(prev => ({
      ...prev,
      [branchNode.id]: option.id
    }))
    
    if (option.chartFilters && option.chartFilters.length > 0) {
      setChartKey(prev => prev + 1)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderChart = (node) => {
    const config = node.chartConfig
    if (!config) return null

    const dataset = story?.datasets?.find(d => d.id === config.datasetId)
    if (!dataset) {
      return (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          数据集未找到
        </div>
      )
    }

    let data = dataset.data
    if (config.filters && config.filters.length > 0) {
      data = data.filter(item => {
        return config.filters.every(filter => {
          const [key, value] = Object.entries(filter)[0]
          return item[key] === value
        })
      })
    }

    const chartProps = {
      data,
      xAxis: config.xAxis,
      yAxis: config.yAxis,
      secondaryYAxis: config.secondaryYAxis,
      title: config.title,
      description: config.description,
      animation: config.animation
    }

    switch (config.chartType) {
      case 'bar':
        return <BarChart key={chartKey} {...chartProps} />
      case 'line':
        return <LineChart key={chartKey} {...chartProps} />
      case 'scatter':
        return <ScatterChart key={chartKey} {...chartProps} />
      default:
        return <BarChart key={chartKey} {...chartProps} />
    }
  }

  const renderTextContent = (content) => {
    const lines = content.split('\n')
    return (
      <div className="prose prose-lg max-w-none prose-blue">
        {lines.map((line, index) => {
          const trimmedLine = line.trim()
          
          if (trimmedLine.startsWith('## ')) {
            return (
              <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                {trimmedLine.slice(3)}
              </h2>
            )
          }
          if (trimmedLine.startsWith('# ')) {
            return (
              <h1 key={index} className="text-4xl font-bold text-gray-900 mb-6">
                {trimmedLine.slice(2)}
              </h1>
            )
          }
          if (trimmedLine.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                {trimmedLine.slice(4)}
              </h3>
            )
          }
          if (trimmedLine.startsWith('- ')) {
            return (
              <li key={index} className="text-gray-700 ml-4 list-disc">
                {trimmedLine.slice(2)}
              </li>
            )
          }
          if (trimmedLine.match(/^\d+\.\s/)) {
            return (
              <li key={index} className="text-gray-700 ml-4 list-decimal">
                {trimmedLine.replace(/^\d+\.\s/, '')}
              </li>
            )
          }
          if (trimmedLine === '') {
            return <br key={index} />
          }
          
          const escapedLine = trimmedLine
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
          const processedLine = escapedLine
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
          
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              <span dangerouslySetInnerHTML={{ __html: processedLine }} />
            </p>
          )
        })}
      </div>
    )
  }

  const renderBranchOptions = (node) => {
    return (
      <div className="space-y-4">
        <p className="text-lg text-gray-700 mb-6">请选择您感兴趣的分析视角：</p>
        <div className="grid md:grid-cols-2 gap-4">
          {node.options.map((option, index) => {
            const isSelected = branchDecisions[node.id] === option.id
            return (
              <motion.button
                key={option.id}
                onClick={() => handleBranchSelect(node, option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start">
                  {isSelected && (
                    <div className="mr-3 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h4 className={`font-semibold text-lg ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </h4>
                    {option.description && (
                      <p className={`mt-2 text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  const viewSummary = getSummary()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回
          </button>
          <h1 className="text-sm font-medium text-gray-700 truncate max-w-xs">
            {story.title}
          </h1>
          <div className="flex items-center gap-2">
            <ViewSummaryPanel 
              summary={viewSummary} 
              onReset={resetTracking}
              nodes={filteredNodes}
            />
          </div>
        </div>
      </div>

      <DataInsightTooltip 
        insight={currentInsight} 
        isVisible={showInsight}
        position="right"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="popLayout">
          {filteredNodes.map((node, index) => {
            const isVisible = visibleNodes.includes(node.id)
            const isActive = currentNodeIndex === index

            return (
              <motion.section
                key={node.id}
                ref={setNodeRef(index)}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: isVisible ? 1 : 0.3,
                  y: isVisible ? 0 : 30,
                  scale: isActive ? 1 : 0.98
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut'
                }}
                className={`mb-12 md:mb-20 ${
                  isActive ? 'ring-2 ring-blue-100 rounded-2xl p-2 -m-2' : ''
                }`}
              >
                <div className="min-h-[60vh] flex flex-col justify-center">
                  
                  {node.type === 'text' && (
                    <motion.div
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
                      animate={{
                        boxShadow: isActive 
                          ? '0 25px 50px -12px rgba(0, 0, 0, 0.1)' 
                          : '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {renderTextContent(node.content)}
                    </motion.div>
                  )}

                  {node.type === 'chart' && (
                    <div className="w-full">
                      {renderChart(node)}
                    </div>
                  )}

                  {node.type === 'branch' && (
                    <motion.div
                      className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-100 p-8 md:p-12"
                      animate={{
                        borderColor: isActive ? '#818cf8' : '#c7d2fe',
                        boxShadow: isActive 
                          ? '0 25px 50px -12px rgba(99, 102, 241, 0.25)' 
                          : '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          剧情岔路口
                        </h2>
                        <p className="text-gray-600">选择不同的路径，探索数据的不同维度</p>
                      </div>
                      {renderBranchOptions(node)}
                    </motion.div>
                  )}
                </div>

                {index < filteredNodes.length - 1 && (
                  <div className="flex justify-center my-4">
                    <motion.div
                      animate={{
                        opacity: isActive ? 0.8 : 0.3,
                        y: isActive ? [0, 10, 0] : 0
                      }}
                      transition={{
                        y: {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }
                      }}
                      className="flex flex-col items-center text-gray-400"
                    >
                      <span className="text-xs mb-2">继续滚动</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.section>
            )
          })}
        </AnimatePresence>

        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">故事结束</h2>
            <p className="text-gray-600 mb-8">感谢您的阅读！</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToTop}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                重新开始
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                浏览更多故事
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Reader
