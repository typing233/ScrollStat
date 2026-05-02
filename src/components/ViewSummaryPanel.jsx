import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ViewSummaryPanel({ summary, onReset, nodes = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const getNodeLabel = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return nodeId
    
    if (node.type === 'chart' && node.chartConfig?.title) {
      return node.chartConfig.title
    }
    if (node.type === 'text') {
      const match = node.content?.match(/^#+\s*(.+)$/m)
      if (match) return match[1]
    }
    if (node.type === 'branch') {
      return '剧情选择节点'
    }
    return `节点 ${nodeId}`
  }

  const getNodeTypeIcon = (nodeType) => {
    switch (nodeType) {
      case 'chart':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      case 'text':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'branch':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )
    }
  }

  const getNodeTypeLabel = (nodeType) => {
    switch (nodeType) {
      case 'chart': return '图表'
      case 'text': return '章节'
      case 'branch': return '选择节点'
      default: return '节点'
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-sm">浏览小结</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    我的浏览小结
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{summary.totalTimeFormatted}</div>
                    <div className="text-sm text-blue-600/70">总阅读时长</div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{summary.nodesVisited}</div>
                    <div className="text-sm text-indigo-600/70">已浏览节点</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    停留最久的图表
                  </h3>
                  {summary.topByTime && summary.topByTime.length > 0 ? (
                    <div className="space-y-2">
                      {summary.topByTime.slice(0, 5).map((item, index) => {
                        const node = nodes.find(n => n.id === item.nodeId)
                        return (
                          <div
                            key={item.nodeId}
                            className="flex items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mr-3">
                              {index + 1}
                            </span>
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm mr-3 text-gray-500">
                              {getNodeTypeIcon(node?.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {getNodeLabel(item.nodeId)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getNodeTypeLabel(node?.type)}
                              </div>
                            </div>
                            <div className="text-right ml-3">
                              <div className="font-semibold text-blue-600">{item.durationFormatted}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>还没有数据，继续阅读吧！</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    反复回看的章节
                  </h3>
                  {summary.mostRevisited && summary.mostRevisited.length > 0 ? (
                    <div className="space-y-2">
                      {summary.mostRevisited.slice(0, 5).map((item, index) => {
                        const node = nodes.find(n => n.id === item.nodeId)
                        return (
                          <div
                            key={item.nodeId}
                            className="flex items-center p-3 bg-purple-50 rounded-lg"
                          >
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm mr-3 text-purple-500">
                              {getNodeTypeIcon(node?.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {getNodeLabel(item.nodeId)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getNodeTypeLabel(node?.type)}
                              </div>
                            </div>
                            <div className="text-right ml-3">
                              <div className="font-semibold text-purple-600">{item.count} 次</div>
                              <div className="text-xs text-purple-500">回看</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <p>还没有回看记录</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (onReset) onReset()
                    }}
                    className="w-full py-2 px-4 text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    清除浏览记录
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ViewSummaryPanel
