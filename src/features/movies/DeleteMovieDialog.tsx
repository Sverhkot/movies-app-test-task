import * as React from 'react'
import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import { useDeleteMovieMutation } from './apiSlice'

type DeleteMovieDialogProps = {
  movieId: string
	onSuccess?: () => void | Promise<void>
}

export default function AlertDialog({movieId, onSuccess}: DeleteMovieDialogProps) {
  const [open, setOpen] = useState(false)
	const [deleteMovie] = useDeleteMovieMutation()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
	const handleDelete = async () => {
		try {
			await deleteMovie(movieId).unwrap()
			await onSuccess?.()
		} catch (err) {
			console.error('Failed to delete movie:', err)
		}
		handleClose()
	}

  return (
    <React.Fragment>
			<IconButton
					aria-label="delete" 
					onClick={handleClickOpen}
					sx={{ mr: 1 }}
			>
					<DeleteIcon />
			</IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this movie?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button 
						onClick={() => void handleDelete()}
						autoFocus
					>
            Yes
          </Button>
        </DialogActions>
      </Dialog>	
    </React.Fragment>
  )
}
