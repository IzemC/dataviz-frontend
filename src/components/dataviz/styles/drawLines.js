import * as d3 from 'd3'


function drawLines(svg, plot, data, width, height, margin, xAttrib, yAttrib, settings) {
    const t = d3.transition()
        .duration(300)
        .ease(d3.easeLinear);

    const scaleX = d3.scalePoint().domain(data.map(d => d[xAttrib])).range([0, width])
    const scaleY = d3.scaleLinear().domain(d3.extent(data, d => d[yAttrib])).range([height, 0])
    const lineGenerator = d3.line().x(d => scaleX(d[xAttrib])).y(d => scaleY(d[yAttrib])).curve(d3.curveBasis)
    const axisY = d3.axisLeft().scale(scaleY)
    const axisX = d3.axisBottom().scale(scaleX)

    d3.select(svg).select('g#y_axis').node() ? d3.select(svg).select('g#y_axis').transition(t)
        .call(axisY) : d3.select(svg).append('g')
            .attr('id', 'y_axis')
            .attr('transform', `translate(${margin.right}, ${- margin.bottom})`)
            .call(axisY)
    d3.select(svg).select('g#x_axis').node() ? d3.select(svg).select('g#x_axis').transition(t)
        .call(axisX).selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start") : d3.select(svg).append('g')
            .attr('id', 'x_axis')
            .attr('transform', `translate(${margin.right}, ${height - margin.bottom})`)
            .call(axisX)
            .selectAll("text")


    plot.selectAll('path').data([lineGenerator(data)])
        .join('path')
        .attr('stroke', settings.fillColor)
        .attr('fill', 'transparent')
        .attr('d', d => d)

}

export default drawLines
