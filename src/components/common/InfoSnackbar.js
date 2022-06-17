import React, { useMemo } from 'react'
import { Alert, Snackbar, Slide } from '@mui/material'

function SlideTransition(props) {
    return <Slide {...props} />;
}

function InfoSnackbar({ msg, setOpen, open, autoHideDuration = 3000, error = false, direction = 'left', vertical = 'top', horizontal = 'right' }) {
    const SlideTransitionFactory = () => { return (props) => SlideTransition({ ...props, direction }) }
    const localSlideTransition = useMemo(SlideTransitionFactory, [])
    return (
        <Snackbar TransitionComponent={localSlideTransition} anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={autoHideDuration} onClose={(e, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setOpen(false);
        }}>
            <Alert variant='filled' onClose={() => setOpen(false)} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
                {msg}
            </Alert>
        </Snackbar>

    )
}

export default InfoSnackbar
