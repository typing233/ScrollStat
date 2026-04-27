import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'

function ScatterChart({ data, xAxis, yAxis, title, description, animation = true }) {
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

    const xExtent = d3.extent(data, d => d[xAxis])
    const yExtent = d3.extent(data, d => d[yAxis])

    const x = d3.scaleLinear()
      .domain([
        xExtent[0] - (xExtent[1] - xExtent[0]) * 0.1,
        xExtent[1] + (xExtent[1] - xExtent[0]) * 0.1
      ])
      .nice()
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain([
        yExtent[0] - (yExtent[1] - yExtent[0]) * 0.1,
        yExtent[1] + (yExtent[1] - yExtent[0]) * 0.1
      ])
      .nice()
      .range([height - margin.bottom, margin.top])

    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d.toLocaleString()))
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

    svg.append('g')
      .call(g => g.append('text')
        .attr('x', width - margin.right)
        .attr('y', height - margin.bottom + 40)
        .attr('fill', '#64748b')
        .attr('font-size', '12px')
        .attr('text-anchor', 'end')
        .text(xAxis)
      )

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

    svg.append('g')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-opacity', 0.5)
      .selectAll('line')
      .data(x.ticks(5))
      .join('line')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)

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

    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => Math.abs(d[yAxis]))])
      .range([5, 15])

    const dots = svg.append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d[xAxis]))
      .attr('cy', d => y(d[yAxis]))
      .attr('fill', 'rgba(59, 130, 246, 0.7)')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')

    const labels = Object.keys(data[0])
    const labelKey = labels.find(l => typeof data[0][l] === 'string' && l !== xAxis && l !== yAxis)

    if (labelKey) {
      svg.append('g')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', d => x(d[xAxis]))
        .attr('y', d => y(d[yAxis]) - 18)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#64748b')
        .text(d => d[labelKey])
        .style('pointer-events', 'none')
    }

    if (animation) {
      dots
        .attr('r', 0)
        .attr('opacity', 0)
        .transition()
        .delay((d, i) => i * 80)
        .duration(600)
        .ease(d3.easeElasticOut)
        .attr('r', d => radiusScale(Math.abs(d[yAxis])))
        .attr('opacity', 1)
    } else {
      dots
        .attr('r', d => radiusScale(Math.abs(d[yAxis])))
        .attr('opacity', 1)
    }

    dots
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', 'rgba(59, 130, 246, 0.9)')
          .attr('stroke', '#1D4ED8')
          .attr('stroke-width', 2)

        const labelValue = labelKey ? d[labelKey] : ''
        tooltip
          .style('opacity', 1)
          .html(`
            <div><strong>${labelValue}</strong></div>
            <div>${xAxis}: ${d[xAxis].toLocaleString()}</div>
            <div>${yAxis}: ${d[yAxis].toLocaleString()}</div>
          `)
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
          .attr('fill', 'rgba(59, 130, 246, 0.7)')
          .attr('stroke', '#3B82F6')
          .attr('stroke-width', 1.5)

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

export default ScatterChart
