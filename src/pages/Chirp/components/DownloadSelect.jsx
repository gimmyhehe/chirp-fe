import React from 'react'
import styled from 'styled-components'
import checkIcon from '@assets/icon/check.svg'
import selectCheckIcon from '@assets/icon/select-check.svg'

const Check = styled.div`
  width: 40px;
  height 40px;
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 9;
  border-radius: 20px;
  background: rgba(0,0,0,0.2) url(${checkIcon}) no-repeat;
  background-size: cover;
  cursor: pointer;
`
const SelectCheck = styled(Check)`
  background-image: url(${selectCheckIcon});
`

export default function DownloadSelect(props) {
  const { selected, changeSelected  } = props
  if(selected == null){
    return null
  }else if(selected){
    return ( <SelectCheck onClick={changeSelected}/> )
  }else{
    return ( <Check onClick={changeSelected} /> )
  }

}
