import React, { useState } from "react";
import styled from "styled-components"

import ShowParticipants from './showParticipants'
import { findAllByAltText } from "@testing-library/react"

import UserRanked from './userRanked'

const Article = styled.article` 
  background-color: #fff;
  width: 600px;
  

  margin: 30px auto 0;
  border: 1px solid rgba(219,219,219);
    

  &:hover {
    box-shadow: 0 8px 6px -6px black;
    cursor: pointer;
  }
`

const Header = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 20px;
`

const Title = styled.h1`
 

`

const Rankings = styled.section`
    display: flex;
    justify-content: center;

    margin: 10px auto;
  `

const User = styled.div`
    display:flex;
    flex-direction: column;
    align-items:center;
    align-content: flex-end;
    padding: 0 10px;
    cursor:pointer;

`
const Name = styled.div` 
  font-size: 18px;
  margin-top: 5px;
`

const MoreUsers = styled.p`
  display:flex;
  align-items:flex-end;
`

const ParlayInfo = styled.section`
    display: flex;
    flex-direction: column;
    align-items:center;

    margin: 10px;
    
  `

const Info = styled.h1`
    margin: 5px;
  `

export default function ClosedParlay({ name, bets, participants, entry, start_time, rankings, users }) {
  

  const displayRank = (rank) => {
    const rankObj = rankings[rank]
    return rankObj || [];
  }
  
console.log(1)
  return (

    <Article>
      <Header>
        <Title>
          {name}
        </Title>
        <div></div>

        <Info><img src="https://toppng.com/uploads/preview/em-svg-png-icon-free-download-gem-icon-11563228146u2haxp4svc.png" alt="gem-icon" height="20px" width="20px" /> {participants.length * entry} </Info>
      </Header>

      <Rankings>
       
        {
          displayRank(1).map(player => {
            const names = Object.keys(player)
            for (let i = 0; i < names.length || i === 3; i++) {

              return (
                <UserRanked 
                username={names[i]}
                rank={1} 
                userphoto={'https://i.imgur.com/XhF02ie.png'}
                points={player[names][0]}
                />
              )
            }
          })
        

        }
        {
          displayRank(2).map(player => {
            const names = Object.keys(player)
            for (let i = 0; i < names.length || i === 2; i++) {

              return (
                <UserRanked 
                username={names[i]}
                rank={2} 
                userphoto={'https://i.imgur.com/XhF02ie.png'}
                points={player[names][0]}
                />
              )
            }
          })

        }
        {
        
        
          displayRank(3).map(player => {
            const names = Object.keys(player)
            for (let i = 0; i < names.length || i === 1; i++) {

              return (
                <UserRanked 
                username={names[i]}
                rank={3} 
                userphoto={'https://i.imgur.com/XhF02ie.png'}
                points={player[names][0]}
                />
              )
            }
          })

        } 
        


      

      </Rankings>
      
      <ShowParticipants 
          participants={participants}
        />

    </Article>
  );

}

