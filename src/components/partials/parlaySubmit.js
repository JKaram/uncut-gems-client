import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import axios from 'axios';

import styled from "styled-components"

const Button = styled.button`
  background-color: #555555; /* Green */
  border: 1px solid #fff;
  color: white;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;

  cursor:pointer;
`

const Fee = styled.div`
  margin-bottom:10px;

  text-align:center;
`

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ParlaySubmit({data, user, parlay_id,parlay_fee, expected, onSubmit, participants}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (bets) => {
    if (expected === data.length) {
      // check to see if they are already a participant.
      const filter = participants.filter(participant => {
        if (participant.parlay_id === parlay_id &&
            participant.user_name === user.user_name)
          return participant
      })
      if (filter.length === 0) {
        axios.post("/api/parlays/participants", {
          user_name: user.user_name,
          parlay_id: parlay_id
        })
        .catch(err => console.log(err))

        bets.map(bet => {
          axios.post("/api/parlays/bets/fill", {
            selection: bet.selection,
            bet_id: bet.bet_id,
            parlay_id: parlay_id,
            user_id: user.user_name
          })
          .catch(err => console.log(err))
        })
      }
    } else {
      alert("fill out the entire form!")
      return
    }
  }

  return (
    <div>
      <Button type="button" onClick={handleOpen}>
        Submit Picks
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h1>Confirm Bet</h1>
            <Fee>The entry fee is {parlay_fee} Gems</Fee>
            <Button onClick={() => {
              handleSubmit(data) 
              handleClose()
              onSubmit()
            }}>
              Confirm
            </Button>
            <Button onClick={() => handleClose()}>Cancel</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
