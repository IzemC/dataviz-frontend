import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import { Grid, FormControlLabel, Radio, Stack, Box, Typography, TextField, Select, FormControl, InputLabel, MenuItem } from '@mui/material'
import { margin } from '../common/constants'
import drawBars from './styles/drawBars'
import drawPoints from './styles/drawPoints'
import drawLines from './styles/drawLines'

export default function Plot({ data, defSettings, reload }) {
    let width = 400
    let height = 400
    const aspectRatio = height / width
    const svgRef = useRef(null)
    const [settings, setSettings] = useState({})
    const [svg, setSvg] = useState()
    useEffect(() => {
        setSettings({ ...defSettings, radius: 10 })
    }, [defSettings])

    useEffect(() => {
        setSvg(svgRef.current)
    }, [svgRef])

    useEffect(() => {
        if (svg && data) {
            width = svg.parentElement.clientWidth - margin.right - margin.left
            height = (svg.parentElement.clientWidth - margin.top - margin.bottom) * aspectRatio
            d3.select(svg)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            const plot = d3.select(svg).select('g#plot').node() ? d3.select(svg).select('g#plot') : d3.select(svg).append('g').attr('id', 'plot')
            plot.attr('transform', `translate(${margin.right},${-margin.bottom})`)

            switch (settings.style) {
                case 'bars':
                    drawBars(svg, plot, data, width, height, margin, settings.xAttrib, settings.yAttrib, settings)
                    break
                case 'points':
                    drawPoints(svg, plot, data, width, height, margin, settings.xAttrib, settings.yAttrib, settings)
                    break
                case 'lines':
                    drawLines(svg, plot, data, width, height, margin, settings.xAttrib, settings.yAttrib, settings)
                    break
            }

        }
    }, [data, svg, settings])

    useEffect(() => {
        if (svg) {
            svg.innerHTML = ''
            reload()
        }
    }, [settings])

    useEffect(() => {
        if (svg) {
            d3.select(svg)
                .attr('viewBox', `0 0 ${width} ${height} `)
        }
    }, [svg])

    return (
        <>
            <Grid item padding='2em 1em 1em 0'>
                <Grid item padding='1em' sx={{ borderRadius: '15px', border: '0.1px solid #7f93a5' }}>
                    <div>
                        <svg ref={svgRef} />
                    </div>
                </Grid>
            </Grid>
            <Grid item padding='2em 0 1em 1em'>
                <Stack spacing={2}>
                    <Typography variant='h5'>Settings</Typography>
                    <Box height='2em' />

                    <Typography variant='h7'>Plot style</Typography>
                    <FormControlLabel label='Bars'
                        control={
                            <Radio
                                checked={settings.style === 'bars'}
                                onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                                value="bars"
                            />
                        }
                    />
                    <FormControlLabel label='Points'
                        control={
                            <Radio
                                checked={settings.style === 'points'}
                                onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                                value="points"
                            />
                        }
                    />
                    <FormControlLabel label='Lines'
                        control={
                            <Radio
                                checked={settings.style === 'lines'}
                                onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                                value="lines"
                            />
                        }
                    />
                    <Box height='2em' />
                    <Stack direction='row' spacing={2} width='100%'>
                        <FormControl flex='1'>
                            <InputLabel id='x-axis-label'>X-Axis variable</InputLabel>
                            <Select
                                labelId='x-axis-label'
                                value={settings.xAttrib || defSettings.xAttrib}
                                onChange={(e) => setSettings({ ...settings, xAttrib: e.target.value })}
                            >
                                {Object.keys(data?.[0] || {})?.filter(k => k != 'id').map(v => <MenuItem value={v}>{v}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl flex='1'>
                            <InputLabel id='y-axis-label'>Y-Axis variable</InputLabel>
                            <Select
                                labelId='y-axis-label'
                                value={settings.yAttrib || defSettings.yAttrib}
                                onChange={(e) => setSettings({ ...settings, yAttrib: e.target.value })}
                            >
                                {Object.keys(data?.[0] || {})?.filter(k => k != 'id' && typeof (data[0][k]) != 'string').map(v => <MenuItem value={v}>{v}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Box height='2em' />
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography >Color</Typography>
                        <Box flexGrow='1' />
                        <TextField onChange={(e) => setSettings({ ...settings, fillColor: e.target.value })} value={settings.fillColor} />
                        <div >
                            <Box height='1.5em' width='1.5em' borderRadius='100%' backgroundColor={settings.fillColor} />
                        </div>
                    </Stack>
                </Stack>
            </Grid>
        </>
    )
}

