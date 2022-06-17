import React from 'react'
import { Modal, CircularProgress, Box } from '@mui/material'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    border: 'none'
};

export default function LoadingModal({ open }) {
    return (
        <Modal
            open={open}
            BackdropProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.5)' } }}
        >
            <Box sx={style}>
                <CircularProgress />
            </Box>
        </Modal>
    )
}
