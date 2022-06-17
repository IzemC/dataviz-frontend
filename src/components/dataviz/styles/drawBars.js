import * as d3 from 'd3'



function drawBars(svg, plot, data, width, height, margin, xAttrib, yAttrib, settings) {
    const t = d3.transition()
        .duration(300)
        .ease(d3.easeLinear);

    const scaleX = d3.scaleBand().domain(data.map(d => d[xAttrib]).sort()).range([0, width], 1)
    const scaleY = d3.scaleLinear().domain(d3.extent(data, d => d[yAttrib])).range([height, 0])
    const axisY = d3.axisLeft().scale(scaleY)
    const axisX = d3.axisBottom().scale(scaleX)

    d3.select(svg).select('g#y_axis').node() ? d3.select(svg).select('g#y_axis').transition(t)
        .call(axisY) : d3.select(svg).append('g')
            .attr('id', 'y_axis')
            .attr('transform', `translate(${margin.right}, ${-margin.bottom})`)
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

    plot.selectAll('rect').data(data, d => d.id).join(
        enter => enter
            .append('rect')
            .attr('width', scaleX.bandwidth())
            .attr('height', (d) => Math.abs(height - scaleY(d[yAttrib])))
            .attr('y', (d) => scaleY(d[yAttrib]))
            .attr('x', (d) => scaleX(d[xAttrib]))
        ,
        update => update
            .transition(t)
            .attr('width', scaleX.bandwidth())
            .attr('height', (d) => Math.abs(height - scaleY(d[yAttrib])))
            .attr('y', (d) => scaleY(d[yAttrib]))
            .attr('x', (d) => scaleX(d[xAttrib]))
        ,
        exit => exit
            .remove()
    ).attr('fill', settings.fillColor)
}

export default drawBars
