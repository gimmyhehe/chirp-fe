import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '@api'
import NProgress from 'nprogress'
import { Input,message } from 'antd'
import {  Button } from '@components'
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
  padding-bottom: 48px;
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
  constructor(props){
    super(props)
    this.state = {
      chirpName: null,
      hasPassword: false,
      chirpPassword: null
    }
  }
  handleChange = (e)=>{
    this.setState({chirpName: e.target.value})
  }
  handleChangePWD = (e)=>{
    this.setState({chirpPassword: e.target.value})
  }
  createChirp = (e) =>{
    console.log(this.state.chirpName)
    this.props.history.push({
      pathname: '/chirpsetting',
      search: `chirpName=${this.state.chirpName}`
    })
  }
  joinChirp = async ()=>{
    let params = {
      cmd: 23,
      chirpName: this.state.chirpName
    }
    if(this.state.hasPassword) params.password = this.state.chirpPassword
    NProgress.start()
    let res =await api.joinChirp(params)
    if(res.code == 10025){
      message.success('join the chirp success!')
      NProgress.done()
      this.props.history.replace('chirpall')
    }else if(res.code == 10030){
      this.setState({hasPassword:true})
      message.warning('This chirp need a password!')
      NProgress.done()
    }
  }
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
          <Input
            style={{marginTop: '203px',width: '326px',height:'56px'}}
            placeholder="Enter chirp name here…"
            value={this.state.chirpName}
            onChange={this.handleChange}
          ></Input>
          {
            this.state.hasPassword ?
              <Input
                style={{marginTop: '20px',width: '326px',height:'56px'}}
                placeholder="Enter password for this chirp…"
                value={this.state.chirpPassword}
                onChange={this.handleChangePWD}
              ></Input> :null
          }

          <ButtonBox>
            <Button style={{width:'152px',height:'48px'}} type='normal' onClick={this.createChirp}>Create</Button>
            <Button style={{width:'152px',height:'48px',marginRight:'0'}} type='normal' onClick={this.joinChirp}>Join</Button>
          </ButtonBox>
        </ChirpForm>
      </div>
    )
  }
}
