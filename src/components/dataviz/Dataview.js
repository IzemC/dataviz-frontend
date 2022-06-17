import React, { useEffect, useState, useContext } from 'react'
import Graph from './Graph'
import Plot from './Plot'
import axios from 'axios'
import infoContext from '../../contexts/InfoContext'
import { api_url } from '../common/constants'

function Dataview({ options }) {
    const [data, setData] = useState([])
    const [mutation, setMutation] = useState(0)
    const { setGlobalLoading, setGlobalSnackbar } = useContext(infoContext)
    const reload = () => setMutation(mutation + 1)


    useEffect(() => {
        let abort = false;

        const fetchData = async ({ name, page, page_size, get_all }) => {
            let query = get_all ? '/get_all' : `?${page ? `page=${page}&` : ''}${page_size ? `page_size=${page_size}&` : ''}`
            try {
                if (get_all)
                    setGlobalLoading('data', true)
                let res = await axios.get(`${api_url}${name}${query}`)
                if (get_all)
                    setGlobalLoading('data', false)
                return res.data
            } catch (err) {
                if (get_all)
                    setGlobalLoading('data', false)
                setGlobalSnackbar({ error: true, msg: 'Network error' })
                return { err }
            }
        }



        const getDataset = async ({ dataset, page_size, isLimit, isProgressiveFetch, limit }) => {
            const name = dataset.name
            if (isProgressiveFetch)
                return progressiveDatasetFetch({ name, page_size, limit, isLimit })
            if (isLimit)
                return progressiveDatasetFetch({ name, page_size: limit, limit, isLimit })
            let res = await fetchData({ name, get_all: true })
            if (!res.err)
                setData(() => res.slice(0, 1000)) // hard limit of 1000 to avoid browser crash
        }

        const progressiveDatasetFetch = async ({ name, page_size, limit, isLimit }) => {
            let res;
            let page = 1;
            let count = 0
            do {
                res = await fetchData({ name, page, page_size })
                if (res.err)
                    return res.err
                page += 1
                count += res.results.length
                if (!isLimit)
                    setData((state) => [...state, ...res.results])
                else
                    setData((state) => [...state, ...res.results.slice(0, limit - state.length)])
            } while (res.next && (!isLimit || count < limit) && !abort)
        }

        setData([])
        if (options)
            getDataset(options)

        return () => { abort = true }
    }, [options, mutation])
    return (
        <>
            {options.dataset?.type == 'graph' && <Graph data={data} defSettings={options.dataset} reload={reload} />}
            {options.dataset?.type == 'plot' && <Plot data={data} defSettings={options.dataset} reload={reload} />}
        </>
    )
}

export default Dataview
