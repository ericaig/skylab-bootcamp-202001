import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import { IconButton } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ({ index: key, resource, handleDelete, handleEdit }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const [editIsDisabled, setEditIsDisabled] = useState(true)
    const [deleteIsDisabled, setDeleteIsDisabled] = useState(true)
    const [toggleDeleteDialog, setToggleDeleteDialog] = useState(false)

    const handleToggleDeleteDialog = visibility => setToggleDeleteDialog(visibility)
    const handleOpenDropdown = event => setAnchorEl(event.currentTarget)
    const handleCloseDropdown = () => setAnchorEl(null)

    const _handleDelete = () => {
        handleToggleDeleteDialog(false)
        handleDelete(resource)
    }

    const _handleEdit = () => {
        handleEdit()
    }

    useEffect(() => {
        if (typeof handleEdit !== 'function') return
        setEditIsDisabled(false)

        if (typeof handleDelete !== 'function') return
        setDeleteIsDisabled(false)

        return () => {
            setDeleteIsDisabled(true)
            setEditIsDisabled(true)
        }
    }, [])

    return (
        <>
            <IconButton size={'small'} aria-label="Actions" aria-controls={`action-btns-${key}`} aria-haspopup="true" onClick={handleOpenDropdown}>
                <SettingsApplicationsIcon />
            </IconButton>
            <Menu
                id={`action-btns-${key}`}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseDropdown}
            >
                <MenuItem disabled={editIsDisabled} onClick={() => { handleCloseDropdown(); _handleEdit() }}>{"Edit"}</MenuItem>
                <MenuItem disabled={deleteIsDisabled} onClick={() => { handleCloseDropdown(); handleToggleDeleteDialog(true) }}>{"Delete"}</MenuItem>
            </Menu>

            <Dialog
                open={toggleDeleteDialog}
                onClose={() => handleToggleDeleteDialog(false)}
                aria-labelledby={`alert-dialog-title-${key}`}
                aria-describedby={`alert-dialog-description-${key}`}
            >
                <DialogTitle id={`alert-dialog-title-${key}`}>{"Confirm"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id={`alert-dialog-description-${key}`}>
                        {"Are you sure you want to delete this?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleToggleDeleteDialog(false)} color="primary">
                        {"No, I don't"}
                    </Button>
                    <Button onClick={_handleDelete} color="primary" autoFocus>
                        {"Yes, I agree"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
