
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

const COLORS = ['black', 'lightblue', 'blue', 'orange', 'yellow', 'lightgreen', 'purple', 'red']

const Container = styled.div`
  height: 100vh;
  background-color: #b5e1ef;
`
const Main = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 700px;
  margin: 0;
  margin-right: -50%;
  background-color: #4995ff;
  border: solid 5px;
  border-color: #fff #777 #777 #fff;
  border-radius: 5%;
  transform: translate(-50%, -50%);
`
const BlockArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 600px;
  margin: 0;
  margin-right: -50%;
  transform: translate(-50%, -50%);
`
const AroundBlockArea = styled(BlockArea)`
  width: 306px;
  height: 606px;
  border: solid 3px;
  border-color: white;
`
const MinBlock = styled.div<{ num: number }>`
  float: left;
  width: 30px;
  height: 30px;
  line-height: 30px;
  vertical-align: baseline;
  background-color: ${(props) => COLORS[props.num]};
  border: solid 0.15vh ${(props) => (props.num === 0 ? '#51515166' : 'black')};
`
const NextMinoArea = styled.div`
  position: absolute;
  top: 7%;
  left: 75%;
  width: 140px;
  height: 270px;
  padding-top: 10px;
  font-size: 30px;
  color: white;
  text-align: center;
  background-color: black;
  border: solid 2px white;
  border-color: white;
  border-radius: 10%;
`
const AroundNextMino = styled.div`
  position: relative;
  top: 5%;
  left: 16%;
  width: 109px;
  height: 109px;
`
const NextMino = styled.div`
  width: 100px;
  height: 100px;
`
const NextMinoBlock = styled.div<{ num: number }>`
  float: left;
  width: 25px;
  height: 25px;
  line-height: 30px;
  vertical-align: baseline;
  background-color: ${(props) => COLORS[props.num]};
  border: solid 0.15vh #000;
`
const HoldMinoArea = styled(NextMinoArea)`
  top: 7%;
  left: 6%;
  width: 148px;
  height: 170px;
`
const ScoreArea = styled.div`
  position: absolute;
  top: 37%;
  left: 6%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 148px;
  height: 105px;
  background-color: #000;
  border: solid 2px white;
  border-radius: 10%;
`
const ScoreandLevel = styled.div`
  font-size: 30px;
  color: white;
  text-align: center;
`
const LevelArea = styled(ScoreArea)`
  top: 58%;
`
const GameStateArea = styled(ScoreArea)`
  top: 79%;
`
const Stop = styled.button`
  position: absolute;
  top: 53%;
  left: 75%;
  width: 140px;
  height: 105px;
  font-size: 30px;
  color: white;
  text-align: center;
  background-color: #000;
  border: solid 5px;
  border-color: #fff #777 #777 #fff;
  border-radius: 10%;

  &:hover {
    font-size: 31px;
    cursor: pointer;
    background-color: #2a2a2a;
  }
`
