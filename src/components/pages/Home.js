import React, { useEffect, useRef, useContext, useState } from 'react'
import axios from 'axios'
import infoContext from '../../contexts/InfoContext'
import * as d3 from 'd3'
import { datasets } from '../common/constants'
import { Container, Select, MenuItem, FormControl, InputLabel, Grid, Switch, TextField, FormControlLabel } from '@mui/material'
import Dataview from '../dataviz/Dataview'

function Home() {

    const [options, setOptions] = useState({
        dataset: datasets[0],
        limit: 30,
        isLimit: true,
        page_size: 10,
        isProgressiveFetch: true,
    })

    // useEffect(() => {
    //     d3.select(window).on('resize', (e) => d3.select(svg).attr('width', window.innerWidth).attr('height', window.innerHeight))
    // }, [])

    return (
        <Container sx={{ padding: '1em', minHeight: '100vh', }}>
            <Grid container display='grid' rowGap='1em' columnGap='1em' gridTemplateRows='1f 4fr' gridTemplateColumns='3fr 1fr'>
                <Grid container alignItems='center' spacing={3} wrap='nowrap'>
                    <Grid item>
                        <FormControl>
                            <FormControlLabel label='Limit dataset size' sx={{ margin: '0', 'span.MuiTypography-root': { paddingLeft: '0.5em' } }} control={<Switch id='limit-set' onChange={(e) => setOptions({ ...options, isLimit: e.target.checked })} checked={options.isLimit} />} />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        {
                            options.isLimit && <TextField label='Limit' type='number' onChange={(e) => setOptions({ ...options, limit: Math.max(0, e.target.value) })} value={options.limit} />
                        }
                    </Grid>
                    <Grid item>
                        <FormControl>
                            <FormControlLabel label='Progressive Loading' sx={{ margin: '0', 'span.MuiTypography-root': { paddingLeft: '0.5em' } }} control={<Switch id='proggressive-set' onChange={(e) => setOptions({ ...options, isProgressiveFetch: e.target.checked })} checked={options.isProgressiveFetch} />} />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        {
                            options.isProgressiveFetch && <TextField label='Batch size' type='number' onChange={(e) => setOptions({ ...options, page_size: Math.max(1, e.target.value) })} value={options.page_size} />
                        }
                    </Grid>
                </Grid>
                <FormControl>
                    <InputLabel htmlFor='dataset-select'>Dataset</InputLabel>
                    <Select id='dataset-select' label='Dateset' onChange={(e) => setOptions({ ...options, dataset: e.target.value })} value={options.dataset}>
                        {datasets.map(d => (<MenuItem key={d.name} value={d}>
                            {d.label}
                        </MenuItem>))}
                    </Select>
                </FormControl>
                <Dataview options={options} />
            </Grid>

        </Container>
    )
}

export default Home


