import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import { Grid, Stack, Box, Typography, TextField } from '@mui/material'

const drag = (simulation) => {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = d.x
        d.fy = d.y
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

export default function Graph({ data, defSettings }) {
    const width = 400
    const height = 400
    const svgRef = useRef(null)

    const [svg, setSvg] = useState()
    const [settings, setSettings] = useState({})

    useEffect(() => {
        setSettings({ ...defSettings, radius: 10 })
    }, [defSettings])

    const zoom = d3.zoom().on("zoom", e => {
        d3.select(svg).selectAll('g').attr("transform", e.transform);
    });

    useEffect(() => {
        setSvg(svgRef.current)
    }, [svgRef])


    useEffect(() => {
        if (svg && data) {
            let extractedNodes = data.reduce((prev, curr) => ({ ...prev, ...curr.sentence_entities.reduce((prev, curr) => ({ ...prev, [curr[0]]: { isEntity: true }, [curr[1]]: { isCategory: true } }), {}), ...curr.sentence_keywords.reduce((prev, curr) => ({ ...prev, [curr[0]]: { isKeyword: true }, [curr[1]]: { isCategory: true } }), {}) }), {})
            const graph = {
                links: data.reduce((prev, curr) => [...prev, ...curr.sentence_entities.map(e => ({ id: `e_${curr.id}_${e[0]}_${e[1]}`, source: e[0], target: e[1] })), ...curr.sentence_keywords.map(k => ({ id: `k_${curr.id}_${k[0]}_${k[1]}`, source: k[0], target: k[1] }))], []),
                nodes: Object.keys(extractedNodes).map(n => ({ id: n, ...extractedNodes[n] })),
            }
            const simulation = d3.forceSimulation(graph.nodes)
                .force("link", d3.forceLink(graph.links).id(d => d.id))
                .force("charge", d3.forceManyBody().strength(-3))
                .force("center", d3.forceCenter(width / 2, height / 2));

            const link = d3.select(svg).select('g#links').node() ? d3.select(svg).select('g#links')
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(graph.links, d => d.id)
                .join("line")
                .attr("stroke-width", d => Math.sqrt(d.value))
                .attr('marker-end', 'url(#arrowhead)') :
                d3.select(svg).append('g')
                    .attr("id", "links")
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 0.6)
                    .selectAll("line")
                    .data(graph.links, d => d.id)
                    .join("line")
                    .attr("stroke-width", d => Math.sqrt(d.value))
                    .attr('marker-end', 'url(#arrowhead)')

            const node = d3.select(svg).select('g#nodes').node() ? d3.select(svg).select('g#nodes')
                .attr("stroke", "#fff")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", .5)
                .selectAll("circle")
                .data(graph.nodes, d => d.id)
                .join("circle")
                .attr("r", (d) => d.isCategory ? 5 : 3)
                .attr("fill", (d) => (d.isCategory && settings.categoryColor) || (d.isEntity && settings.entityColor) || (d.isKeyword && settings.keywordColor))
                .attr("stroke", (d) => d.isCategory ? 5 : 3)
                .call(drag(simulation))
                :
                d3.select(svg).append("g")
                    .attr("id", "nodes")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)
                    .selectAll("circle")
                    .data(graph.nodes, d => d.id)
                    .join("circle")
                    .attr("r", (d) => (3))
                    .call(drag(simulation));
            const label = d3.select(svg).select('g#labels').node() ?
                d3.select(svg).select('g#labels')
                    .style("fill", "#444")
                    .style("font-size", 3)
                    .selectAll("text")
                    .data(graph.nodes, d => d.id)
                    .join("text")
                    .text(function (d) { return d.id || '*Empty*' })
                    .style("pointer-events", "none")
                    .attr("dx", (d) => (5))
                    .style("alignment-baseline", "middle") :
                d3.select(svg).append('g')
                    .attr("id", "labels")
                    .style("fill", "#444")
                    .style("font-size", 3)
                    .selectAll("text")
                    .data(graph.nodes, d => d.id)
                    .join("text")
                    .text(function (d) { return d.id || '*Empty*' })
                    .style("pointer-events", "none")
                    .attr("dx", (d) => (5))
                    .style("alignment-baseline", "middle");
            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

                label
                    .attr("x", d => d.x)
                    .attr("y", d => d.y);
            });
            return () => simulation.stop()
        }
    }, [data, svg, settings])

    useEffect(() => {
        if (svg) {
            d3.select(svg)
                .attr('viewBox', `0 0 ${width} ${height}`)
                .call(zoom)
            d3.select(svg).append("defs").
                append("marker")
                .attr("id", 'arrowhead')
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 38)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("fill", '#7f93a5')
                .attr("d", 'M0,-5L10,0L0,5');
        }

    }, [svg])

    return (
        <>
            <Grid item padding='2em 1em 1em 0'>
                <Grid item sx={{ borderRadius: '15px', border: '0.1px solid #7f93a5' }}>
                    <div>
                        <svg ref={svgRef} />
                    </div>
                </Grid>
            </Grid>
            <Grid item padding='2em 0 1em 1em'>
                <Stack spacing={2}>
                    <Typography variant='h5'>Settings</Typography>
                    <Box height='2em' />

                    <Stack direction='row' alignItems='center' width='max-content' spacing={2}>
                        <Typography >Category node color</Typography>
                        <Box flexGrow='1' />
                        <TextField onChange={(e) => setSettings({ ...settings, categoryColor: e.target.value })} value={settings.categoryColor} />
                        <div >
                            <Box height='1.5em' width='1.5em' borderRadius='100%' backgroundColor={settings.categoryColor} />
                        </div>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography >Entity node color</Typography>
                        <Box flexGrow='1' />
                        <TextField onChange={(e) => setSettings({ ...settings, entityColor: e.target.value })} value={settings.entityColor} />
                        <div >
                            <Box height='1.5em' width='1.5em' borderRadius='100%' backgroundColor={settings.entityColor} />
                        </div>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography >Keyword node color</Typography>
                        <Box flexGrow='1' />
                        <TextField onChange={(e) => setSettings({ ...settings, keywordColor: e.target.value })} value={settings.keywordColor} />
                        <div >
                            <Box height='1.5em' width='1.5em' borderRadius='100%' backgroundColor={settings.keywordColor} />
                        </div>
                    </Stack>
                </Stack>
            </Grid>
        </>
    )
}

