import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'scrollstat_view_tracking'

function loadTrackingData(storyId) {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      return parsed[storyId] || {
        nodeDurations: {},
        revisitCounts: {},
        visitHistory: [],
        totalTime: 0,
        lastActiveNode: null,
        lastActiveTime: null
      }
    }
  } catch (e) {
    console.error('Failed to load tracking data:', e)
  }
  return {
    nodeDurations: {},
    revisitCounts: {},
    visitHistory: [],
    totalTime: 0,
    lastActiveNode: null,
    lastActiveTime: null
  }
}

function saveTrackingData(storyId, data) {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    allData[storyId] = data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
  } catch (e) {
    console.error('Failed to save tracking data:', e)
  }
}

export function useViewTracking(storyId) {
  const [trackingData, setTrackingData] = useState(() => loadTrackingData(storyId))
  const timerRef = useRef(null)
  const currentNodeRef = useRef(null)
  const nodeEnterTimeRef = useRef(null)

  useEffect(() => {
    const newData = loadTrackingData(storyId)
    setTrackingData(newData)
  }, [storyId])

  useEffect(() => {
    saveTrackingData(storyId, trackingData)
  }, [trackingData, storyId])

  const startTrackingNode = useCallback((nodeId, nodeType, nodeTitle = '') => {
    const now = Date.now()
    
    if (currentNodeRef.current && nodeEnterTimeRef.current) {
      const duration = now - nodeEnterTimeRef.current
      
      setTrackingData(prev => {
        const nodeDurations = { ...prev.nodeDurations }
        nodeDurations[currentNodeRef.current] = (nodeDurations[currentNodeRef.current] || 0) + duration
        
        const visitHistory = [...prev.visitHistory]
        if (visitHistory.length > 0 && visitHistory[visitHistory.length - 1].nodeId === currentNodeRef.current) {
          visitHistory[visitHistory.length - 1].endTime = now
          visitHistory[visitHistory.length - 1].duration += duration
        }
        
        return {
          ...prev,
          nodeDurations,
          visitHistory,
          totalTime: prev.totalTime + duration
        }
      })
    }
    
    if (nodeId !== currentNodeRef.current) {
      setTrackingData(prev => {
        const revisitCounts = { ...prev.revisitCounts }
        if (currentNodeRef.current !== null) {
          revisitCounts[nodeId] = (revisitCounts[nodeId] || 0) + 1
        }
        
        const visitHistory = [...prev.visitHistory, {
          nodeId,
          nodeType,
          nodeTitle,
          startTime: now,
          endTime: null,
          duration: 0
        }]
        
        return {
          ...prev,
          revisitCounts,
          visitHistory,
          lastActiveNode: nodeId,
          lastActiveTime: now
        }
      })
    }
    
    currentNodeRef.current = nodeId
    nodeEnterTimeRef.current = now
  }, [])

  const getTopNodesByTime = useCallback((limit = 5) => {
    const nodeArray = Object.entries(trackingData.nodeDurations).map(([nodeId, duration]) => ({
      nodeId,
      duration,
      durationFormatted: formatDuration(duration)
    }))
    
    nodeArray.sort((a, b) => b.duration - a.duration)
    return nodeArray.slice(0, limit)
  }, [trackingData.nodeDurations])

  const getMostRevisitedNodes = useCallback((limit = 5) => {
    const nodeArray = Object.entries(trackingData.revisitCounts).map(([nodeId, count]) => ({
      nodeId,
      count
    }))
    
    nodeArray.sort((a, b) => b.count - a.count)
    return nodeArray.slice(0, limit).filter(n => n.count > 1)
  }, [trackingData.revisitCounts])

  const getChapterVisits = useCallback(() => {
    const chapterVisits = {}
    
    trackingData.visitHistory.forEach(visit => {
      if (!chapterVisits[visit.nodeId]) {
        chapterVisits[visit.nodeId] = {
          nodeId: visit.nodeId,
          nodeType: visit.nodeType,
          nodeTitle: visit.nodeTitle,
          visitCount: 0,
          totalDuration: 0
        }
      }
      chapterVisits[visit.nodeId].visitCount += 1
      chapterVisits[visit.nodeId].totalDuration += (visit.duration || 0)
    })
    
    return Object.values(chapterVisits).sort((a, b) => b.totalDuration - a.totalDuration)
  }, [trackingData.visitHistory])

  const getSummary = useCallback(() => {
    const topByTime = getTopNodesByTime(5)
    const mostRevisited = getMostRevisitedNodes(5)
    const chapterVisits = getChapterVisits()
    
    return {
      totalTime: trackingData.totalTime,
      totalTimeFormatted: formatDuration(trackingData.totalTime),
      nodesVisited: Object.keys(trackingData.nodeDurations).length,
      topByTime,
      mostRevisited,
      chapterVisits,
      visitHistory: trackingData.visitHistory
    }
  }, [trackingData, getTopNodesByTime, getMostRevisitedNodes, getChapterVisits])

  const resetTracking = useCallback(() => {
    const newData = {
      nodeDurations: {},
      revisitCounts: {},
      visitHistory: [],
      totalTime: 0,
      lastActiveNode: null,
      lastActiveTime: null
    }
    setTrackingData(newData)
    currentNodeRef.current = null
    nodeEnterTimeRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (currentNodeRef.current && nodeEnterTimeRef.current) {
        const duration = Date.now() - nodeEnterTimeRef.current
        setTrackingData(prev => {
          const nodeDurations = { ...prev.nodeDurations }
          nodeDurations[currentNodeRef.current] = (nodeDurations[currentNodeRef.current] || 0) + duration
          
          return {
            ...prev,
            nodeDurations,
            totalTime: prev.totalTime + duration
          }
        })
      }
    }
  }, [])

  return {
    trackingData,
    startTrackingNode,
    getTopNodesByTime,
    getMostRevisitedNodes,
    getChapterVisits,
    getSummary,
    resetTracking
  }
}

function formatDuration(ms) {
  if (ms < 1000) return '少于1秒'
  if (ms < 60000) return `${Math.floor(ms / 1000)}秒`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  if (seconds === 0) return `${minutes}分钟`
  return `${minutes}分${seconds}秒`
}
