import React from "react"
import styled from "styled-components"

const Article = styled.div` 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 80vw;
  height: 20vh;
  margin: 2vw auto 0;
  border: 1px solid rgba(219,219,219);
  cursor: pointer;

  @media only screen and (min-width: 768px) {
    width: 60vw;
  }

  &:hover {
    box-shadow: 0px 8px 6px -6px #000;
  }
`

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100%;
  
`

const Img = styled.img`
  display: flex;
  align-self: center;
  width: 15%;
  height: 50%;

  @media only screen and (min-width: 768px) {
    width: 20%;
  }
`

export default function Create({onClick}) {
  return (
    <Article>
      <Button><Img onClick={onClick} src="https://cdn2.iconfinder.com/data/icons/mixed-communication-and-ui-pack/48/general_pack_NEW__add-512.png"/></Button>
    </Article>
  );

}

