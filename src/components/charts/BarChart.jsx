import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'

function BarChart({ data, xAxis, yAxis, title, description, animation = true }) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)
    const width = container.clientWidth
    const height = 350
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }

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
        .attr('fill', '#64748b')
        .attr('font-size', '12px')
        .text(yAxis)
      )

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

    const bars = svg.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d[xAxis]))
      .attr('width', x.bandwidth())
      .attr('fill', 'url(#barGradient)')
      .attr('rx', 4)
      .style('cursor', 'pointer')

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3B82F6')

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#1D4ED8')

    if (animation) {
      bars
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 30)
        .ease(d3.easeCubicOut)
        .attr('y', d => y(d[yAxis]))
        .attr('height', d => y(0) - y(d[yAxis]))
    } else {
      bars
        .attr('y', d => y(d[yAxis]))
        .attr('height', d => y(0) - y(d[yAxis]))
    }

    bars
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', '#60A5FA')

        tooltip
          .style('opacity', 1)
          .html(`
            <div><strong>${d[xAxis]}</strong></div>
            <div>${yAxis}: ${d[yAxis].toLocaleString()}</div>
          `)
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 40) + 'px')
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', 'url(#barGradient)')

        tooltip.style('opacity', 0)
      })

    return () => {
      tooltip.remove()
    }
  }, [data, xAxis, yAxis, animation])

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

export default BarChart
