import React,{ Component } from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
import { Button } from '@components'
import twitter from '@assets/icon/twitter.png'

const TextBox = styled.div`
  margin-top: 179px;
  margin-left 146px;
`
const Title = styled.span`
  font-size: 44px;
  font-weight: 600;
`
const Desc = styled.p`
  font-size: 34px;
  width: 654px;
  margin-top: 14px;
`

const ChirpForm = styled.div`
  width: 375px;
  height: 403px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.14);
  position: relative;
  overflow: hidden;
  background-color: #fff;
  position: absolute;
  top: 105px;
  right: 10%;
`
const TwitterLeft = styled.div`
  width: 75px;
  height: 66px;
  position: absolute;
  top: 65px;
  left: 110px;
  background-image: url(${twitter});
  background-size: cover;
`
const TwitterRight = styled(TwitterLeft)`
  transform: rotateY(180deg);
  width: 54px;
  left: 210px;
  top: 109px;
  height: 48px;
`
const ButtonBox = styled.div`
  width: 326px;
  margin: 48px auto 0;
  display: flex;
`
export default class ChirpJoin extends Component{
  render(){
    return (
      <div>
        <TextBox>
          <Title>Share anything with anyone</Title>
          <Desc>Share your thoughts, photos, videos and documents with a meaningful name. Simple and fast.
          </Desc>
        </TextBox>
        <ChirpForm>
          <TwitterLeft></TwitterLeft>
          <TwitterRight></TwitterRight>
          <Input style={{marginTop: '203px',width: '326px',height:'56px'}} placeholder="Enter chirp name here…"></Input>
          <ButtonBox>
            <Button style={{width:'152px',height:'48px'}} type='normal'>Create</Button>
            <Button style={{width:'152px',height:'48px',marginRight:'0'}} type='normal'>Join</Button>
          </ButtonBox>
        </ChirpForm>
      </div>
    )
  }
}
