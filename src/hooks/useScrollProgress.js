import { useState, useEffect, useRef } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)
  const nodeRefs = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrollTop = window.scrollY
      
      const newProgress = Math.min(Math.max((scrollTop / documentHeight) * 100, 0), 100)
      setProgress(newProgress)

      if (nodeRefs.current.length > 0) {
        const viewportCenter = scrollTop + windowHeight / 2
        let activeIndex = 0
        
        for (let i = 0; i < nodeRefs.current.length; i++) {
          const node = nodeRefs.current[i]
          if (node) {
            const rect = node.getBoundingClientRect()
            const nodeCenter = rect.top + scrollTop + rect.height / 2
            if (nodeCenter <= viewportCenter + 100) {
              activeIndex = i
            }
          }
        }
        
        setCurrentNodeIndex(activeIndex)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const setNodeRef = (index) => (el) => {
    nodeRefs.current[index] = el
  }

  return {
    progress,
    currentNodeIndex,
    setNodeRef,
    nodeRefs
  }
}
