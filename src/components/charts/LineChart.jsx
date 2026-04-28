import React, { useEffect, useRef, useId } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'

function LineChart({ 
  data, 
  xAxis, 
  yAxis, 
  secondaryYAxis,
  title, 
  description, 
  animation = true 
}) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const uid = useId()
  const gradientId = `areaGradient-${uid.replace(/:/g, '')}`

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)
    const width = container.clientWidth
    const height = 350
    const margin = { top: 40, right: secondaryYAxis ? 60 : 30, bottom: 60, left: 60 }

    svg.selectAll('*').remove()

    svg.attr('viewBox', [0, 0, width, height])

    const x = d3.scaleBand()
      .domain(data.map(d => d[xAxis]))
      .range([margin.left, width - margin.right])
      .padding(0.2)

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yAxis]) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top])

    let y2 = null
    if (secondaryYAxis) {
      y2 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[secondaryYAxis]) * 1.1])
        .nice()
        .range([height - margin.bottom, margin.top])
    }

    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#64748b')

    const yAxisGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toLocaleString()))
      .style('font-size', '12px')
      .style('fill', '#64748b')

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(g => g.append('text')
        .attr('x', -margin.left + 10)
        .attr('y', margin.top - 10)
        .attr('fill', '#3B82F6')
        .attr('font-size', '12px')
        .text(yAxis)
      )

    if (y2 && secondaryYAxis) {
      const y2AxisGroup = svg.append('g')
        .attr('transform', `translate(${width - margin.right},0)`)
        .call(d3.axisRight(y2).ticks(5).tickFormat(d => d.toLocaleString()))
        .style('font-size', '12px')
        .style('fill', '#64748b')

      svg.append('g')
        .call(g => g.append('text')
          .attr('x', width - 10)
          .attr('y', margin.top - 10)
          .attr('fill', '#10B981')
          .attr('font-size', '12px')
          .attr('text-anchor', 'end')
          .text(secondaryYAxis)
        )
    }

    svg.append('g')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-opacity', 0.5)
      .selectAll('line')
      .data(y.ticks(5))
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d))

    const tooltip = d3.select('body').append('div')
      .attr('class', 'chart-tooltip')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background', 'rgba(31, 41, 55, 0.95)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '100')

    const line = d3.line()
      .x(d => x(d[xAxis]) + x.bandwidth() / 2)
      .y(d => y(d[yAxis]))
      .curve(d3.curveMonotoneX)

    const area = d3.area()
      .x(d => x(d[xAxis]) + x.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1(d => y(d[yAxis]))
      .curve(d3.curveMonotoneX)

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(59, 130, 246, 0.3)')

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(59, 130, 246, 0.05)')

    const areaPath = svg.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area)

    const linePath = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', line)

    let line2Path = null
    if (y2 && secondaryYAxis) {
      const line2 = d3.line()
        .x(d => x(d[xAxis]) + x.bandwidth() / 2)
        .y(d => y2(d[secondaryYAxis]))
        .curve(d3.curveMonotoneX)

      line2Path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#10B981')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('d', line2)
    }

    const dots = svg.append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d[xAxis]) + x.bandwidth() / 2)
      .attr('cy', d => y(d[yAxis]))
      .attr('r', 5)
      .attr('fill', 'white')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer')

    if (y2 && secondaryYAxis) {
      svg.append('g')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => x(d[xAxis]) + x.bandwidth() / 2)
        .attr('cy', d => y2(d[secondaryYAxis]))
        .attr('r', 5)
        .attr('fill', 'white')
        .attr('stroke', '#10B981')
        .attr('stroke-width', 2.5)
        .style('cursor', 'pointer')
    }

    if (animation) {
      const pathLength = linePath.node().getTotalLength()
      
      linePath
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .attr('stroke-dashoffset', 0)

      if (line2Path) {
        const pathLength2 = line2Path.node().getTotalLength()
        line2Path
          .attr('stroke-dasharray', pathLength2)
          .attr('stroke-dashoffset', pathLength2)
          .transition()
          .duration(1500)
          .ease(d3.easeCubicInOut)
          .attr('stroke-dashoffset', 0)
      }

      areaPath
        .attr('opacity', 0)
        .transition()
        .delay(500)
        .duration(800)
        .attr('opacity', 1)

      dots
        .attr('opacity', 0)
        .attr('r', 0)
        .transition()
        .delay((d, i) => 1200 + i * 60)
        .duration(300)
        .attr('opacity', 1)
        .attr('r', 5)
    }

    dots
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 7)
          .attr('fill', '#3B82F6')

        let tooltipHtml = `
          <div><strong>${d[xAxis]}</strong></div>
          <div>${yAxis}: ${d[yAxis].toLocaleString()}</div>
        `
        if (secondaryYAxis) {
          tooltipHtml += `<div>${secondaryYAxis}: ${d[secondaryYAxis].toLocaleString()}</div>`
        }
        tooltip
          .style('opacity', 1)
          .html(tooltipHtml)
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 50) + 'px')
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5)
          .attr('fill', 'white')

        tooltip.style('opacity', 0)
      })

    return () => {
      tooltip.remove()
    }
  }, [data, xAxis, yAxis, secondaryYAxis, animation, gradientId])

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-gray-500 mb-4">{description}</p>
        )}
        <div ref={containerRef} className="w-full">
          <svg ref={svgRef} className="w-full" style={{ minHeight: '350px' }} />
        </div>
      </div>
    </motion.div>
  )
}

export default LineChart
