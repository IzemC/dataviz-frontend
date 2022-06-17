import React, { useState } from 'react'
import { ThemeProvider } from "@mui/material/styles"
import theme from './theme'
import CssBaseline from '@mui/material/CssBaseline'
import InfoContext from './contexts/InfoContext'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from './components/pages/Home'
import NotFound from './components/common/NotFound'
import InfoSnackbar from './components/common/InfoSnackbar'
import LoadingModal from './components/common/LoadingModal'

// populateDB(d3.csvParse(yp), d3.csvParse(genz))
function App() {

    const [infoState, setInfoState] = useState({
        loading: {},
        open: false,
        msg: '',
        error: false
    });
    const setOpenGlobalSnackbar = (open) => {
        setInfoState({ ...infoState, open })
    }
    const setGlobalLoading = (name, value) => {
        setInfoState((state) => ({ ...state, loading: { ...state.loading, [name]: value } }))
    }
    const setGlobalSnackbar = ({ msg, error }) => {
        setInfoState((state) => ({ ...state, open: true, msg, error }))
    }
    return (
        <InfoContext.Provider value={{ infoState, setInfoState, setGlobalLoading, setGlobalSnackbar }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <LoadingModal open={Object.keys(infoState.loading).some(v => infoState.loading[v])} />
                <InfoSnackbar open={infoState.open} setOpen={setOpenGlobalSnackbar} error={infoState.error} msg={infoState.msg} />
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </InfoContext.Provider>
    )
}

export default App
