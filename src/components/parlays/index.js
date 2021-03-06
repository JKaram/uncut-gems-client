import React, { Fragment, useState, useEffect } from "react"
import styled from "styled-components"
import useVisualMode from "../../hooks/useVisualMode"

import Loading from "./source/loading"
import CreateParlay from "./source/createParlay"
import ShowParlay from "./source/showParlay"
import ClosedParlay from './source/closedParlay'
import FillParlay from "./source/fillParlay"
import ActiveParlay from "./source/activeParlay"

import Title from './source/title'
import axios from "axios"
import moment from "moment"

const Container = styled.div`
`

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`

const Parlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`
const Search = styled.input`
  max-width: 600px;
  height: 20px;
  width: 100%;

  margin-bottom: 20px;

  font-size: 18px;
  padding: 10px;

  overflow:hidden;
  resize: none;  

  margin: 0 auto;

`

const ResultContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 20px;
  max-width: 600px;
`

const SearchResult = styled.button`
  width: 100%;
  background: #000;
  padding: 10px;
  max-width: 600px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`

const ButtonList = styled.div`
  display: flex; 
  flex-direction: column;
  max-width: 600px;
  width:100%;
  margin: 0 auto;
`

const Button = styled.button`
  max-width: 600px;
  width:100%;
  
  padding: 10px 5px;

  border-bottom: 1px solid #DBDBDB;

  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #DBDBDB;
  }
`

const Parlays = ({ user, games, parlays, user_bets, bets, participants, scores, users, rankings }) => {
  
  // constants to handle visual transitions.
  const CREATE = "CREATE"
  const ACTIVE = "ACTIVE"
  const OPEN = "OPEN"
  const CLOSED = "CLOSED"
  const SEARCH = "SEARCH"
  const LOADING = "LOADING"
  const JOIN = "JOIN"

  // get the visual mode for create button.
  const { mode, transition } = useVisualMode(CREATE)
  // parlays that the user has participated in.
  const [searchRes, setSearchRes] = useState([])
  const [title, setTitle] = useState('Create a Parlay')

  const searching = (value) => {
    setSearchRes([])
    if (value === "")
      return setSearchRes(["No results"])
    const parlayIds = userParlays()
    const results = parlays.filter(parlay => {
      if (!(parlayIds.includes(parlay.id)) &&
        parlay.current_status === 'open' &&
        parlay.name.includes(value))
        return setSearchRes(prev => [...prev, parlay])
    })
  }

  // get participants given a parlay id
  const getParticipants = (parlay_id) => {
    const filtered = participants.filter(participant => {
      if (parlay_id === participant.parlay_id)
        return participant
    })
    return filtered
  }

  // get user parlays.
  const userParlays = () => {
    const parlayIds = []
    const userParlays = participants.map(participant => {
      if (participant.user_name === user.user_name)
        parlayIds.push(participant.parlay_id)
    })
    return parlayIds
  }

  // get active parlays.
  const getActiveParlays = () => {
    const parlayIds = userParlays()
    const activeParlays = parlays.filter(parlay => {
      // check to see the differnce in dates.
      if (parlay.current_status === 'open' &&
        Date.now() >= (parlay.start_time * 1000)) {
        axios.put(`/api/parlays/set_active/${parlay.id}`, {
          current_status: 'in-progress'
        }, 
        {baseURL: 'https://uncut-gems-api-server.herokuapp.com'}
        )
          .catch(err => console.log(err))
        if (parlayIds.includes(parlay.id)) {
          parlay.current_status = 'in-progress'
          return parlay
        }
      }

      if (parlayIds.includes(parlay.id) &&
        parlay.current_status === 'in-progress')
        return parlay
    })
    return activeParlays.sort((a, b) => b.id - a.id)
  }

  // get open parlays the user has participated in.
  const getOpenParlays = (max) => {
    const parlayIds = userParlays()
    const openParlays = parlays.filter(parlay => {
      if (parlayIds.includes(parlay.id) &&
          parlay.current_status === 'open')
        return parlay
    })
    return openParlays.sort((a, b) => b.id - a.id)
  }

  const getAdminParlays = () => {
    const parlayIds = userParlays()
    const admin = parlays.filter(parlay => {
      if (parlay.admin === user.id &&
        !parlayIds.includes(parlay.id))
        return parlay
    })
    return admin.sort((a, b) => b.id - a.id)
  }

  // get closed parlays the user has participated in.
  const getClosedParlays = () => {
    const parlayIds = userParlays()
    const closedParlays = parlays.filter(parlay => {
      if (parlayIds.includes(parlay.id) &&
        parlay.current_status === 'close')
        return parlay
    })
    return closedParlays.sort((a, b) => b.id - a.id)
  }

  const getRankingsForParlays = (parlayID) => {
    return rankings[parlayID]
  }

  
  // get bets for a given parlay
  const getBets = (parlay_id) => {
    const filtered = bets.filter(bet => {
      if (bet.parlay_id === parlay_id)
        return bet
    })
    return filtered.sort((a, b) => b.id - a.id)
  }

  const getUserBets = (parlay_id) => {
    const filtered = user_bets.filter(bet => {
      if (bet.parlay_id === parlay_id)
        return bet
    })
    return filtered.sort((a, b) => b.id - a.id)
  }



  // helper function for the search feature.
  const search = (value) => {
    setSearchRes([])
    if (value === '')
      return setSearchRes([])
    parlays.map(parlay => {
      if (parlay.name.includes(value))
        return setSearchRes(prev => [...prev, parlay])
      return null
    })
  }
  // if the user has participated in a parlay (filled out a bet form)
  if (!user || Object.keys(user).length === 0)
    return <div></div>

  const buffer = (newMode) => {
    transition(LOADING)
    setTimeout(() => {
      transition(newMode)
    }, 1250)
  }

  return (
    <Container>
      {mode === LOADING && <Loading />}
      {mode === CREATE && (
        <Fragment>
          <Title
            title={'Create Parlay'}
            buffer={buffer}
          />
          <CreateParlay
            user={user}
            onSubmit={() => buffer(OPEN)}
            games={games.filter(game => {
              const today = [moment().day(), moment().month()]
              const gameDate = [
                new Date(game.timestamp * 1000).getDay(),
                new Date(game.timestamp * 1000).getMonth()
              ]
              if (today[0] === gameDate[0] &&
                  today[1] === gameDate[1] &&
                  game.status === 'NS')
                return game
            })}
          />
        </Fragment>
      )}
      {mode === ACTIVE && (
        <Fragment>
          <Title
            title={`Active Parlays`}
            buffer={buffer}
            number={getActiveParlays().length}
          />
          {
            getActiveParlays().map(parlay => {
              return (
                <Div key={parlay.id}>
                  <ActiveParlay
                    rankings={rankings}
                    name={parlay.name}
                    user_bets={getUserBets(parlay.id)}
                    bets={getBets(parlay.id)}
                    start_time={parlay.start_time}
                    participants={getParticipants(parlay.id)}
                    entry={parlay.fee}
                    parlay_id={parlay.id}
                    parlays={parlays}
                    scores={scores}
                    users={users}
                    games={games}
                  />
                </Div>
              )
            })
          }
        </Fragment>
      )}
      {mode === OPEN && (
        <Fragment>
          {
            getAdminParlays().length > 0 && (
              <Title
                title={`Parlays To Fill`}
                buffer={buffer}
                number={getAdminParlays().length}
              />
            )
          }
          {
            getAdminParlays().map(parlay => {
              return (
                <Div key={parlay.fee * parlay.id}>
                  <FillParlay
                    user={user}
                    users={users}
                    cancelled={true}
                    parlay_name={parlay.name}
                    parlay_id={parlay.id}
                    parlay_fee={parlay.fee}
                    parlay_admin={parlay.admin}
                    games={games}
                    allBets={bets}
                    onSubmit={() => buffer(OPEN)}
                    participants={participants}
                  />
                </Div>
              )
            })
          }
        </Fragment>
      )}
      {mode === OPEN && (
        <Fragment>
          <Title
            title={`Open Parlays`}
            buffer={buffer}
            number={getOpenParlays().length}
          />
         
          {
            getOpenParlays().map(parlay => {
              return (
                <Div key={parlay.id}>
                  <ShowParlay
                    users={users}
                    name={parlay.name}
                    bets={getBets(parlay.id).length}
                    participants={getParticipants(parlay.id)}
                    entry={parlay.fee}
                    start_time={parlay.start_time}
                  />
                </Div>
              )
            })
          }
        </Fragment>
      )}
      {mode === CLOSED && (
        <Fragment>
          <Title
            title={`Closed Parlays`}
            buffer={buffer}
            number={getClosedParlays().length}
          />
        
          {
            getClosedParlays().map(parlay => {
              return (
                <Div key={parlay.id}>
                  <ClosedParlay
                    users={users}
                    name={parlay.name}
                    rankings={getRankingsForParlays(parlay.id)}
                    bets={getBets(parlay.id).length}
                    participants={[...getParticipants(parlay.id)]}
                    entry={parlay.fee}
                    start_time={parlay.start_time}
                  />
                </Div>
              )
            })
          }
        </Fragment>
      )}
      {mode === SEARCH && (
        <Fragment>
          <Title
            title={'Search'}
            buffer={buffer}
          />
          <SearchContainer>
            <Search placeholder='Search Open Parlays...' type="text" onChange={(e) => searching(e.target.value)} />
          </SearchContainer>
          <ResultContainer>
            {
              searchRes.map(search => {
                if (search.name)
                  return (
                    <SearchResult onClick={() => {
                      setSearchRes([search])
                      buffer(JOIN)
                    }}>{search.name}</SearchResult>
                  )
              })
            }
          </ResultContainer>
        </Fragment>
      )}
      {mode === JOIN && (
        
        
        <Fragment>
          {
            searchRes.map(parlay => {
              return (
                <Div key={parlay.fee * parlay.id}>
                  <FillParlay
                    user={user}
                    users={users}
                    cancelled={false}
                    parlay_id={parlay.id}
                    parlay_name={parlay.name}
                    parlay_fee={parlay.fee}
                    parlay_admin={parlay.admin}
                    games={games}
                    allBets={bets}
                    onSubmit={() => {
                      buffer(OPEN)
                      setSearchRes([])
                    }}
                    participants={participants}
                  />
                </Div>
              )
            })
          }
        </Fragment>
      )}
    </Container>
  )
}

export default Parlays
