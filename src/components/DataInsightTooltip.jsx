import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function DataInsightTooltip({ insight, isVisible, position = 'right' }) {
  if (!insight) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position === 'right' ? 20 : -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: position === 'right' ? 20 : -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed top-1/2 transform -translate-y-1/2 z-40 max-w-xs pointer-events-none`}
          style={{
            [position]: position === 'right' ? '20px' : 'auto',
            left: position === 'left' ? '20px' : 'auto'
          }}
        >
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-5 text-white relative">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-white/90">
                数据解读
              </div>
            </div>
            <div className="text-white font-medium text-base leading-relaxed">
              {insight.text}
            </div>
            {insight.details && (
              <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  从 {formatNumber(insight.details.firstValue)} 到 {formatNumber(insight.details.lastValue)}
                </div>
              </div>
            )}
            
            <div 
              className={`absolute top-1/2 transform -translate-y-1/2 w-0 h-0`}
              style={{
                [position === 'right' ? 'right' : 'left']: position === 'right' ? '-8px' : 'auto',
                left: position === 'left' ? '-8px' : 'auto',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                [position === 'right' ? 'borderLeft' : 'borderRight']: '8px solid #3B82F6'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

export default DataInsightTooltip
