import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '@api'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import NProgress from 'nprogress'
import { Input,message, Form } from 'antd'
import {  Button } from '@components'
import twitter from '@assets/icon/twitter.png'

const CenterBox = styled.div`
  margin: 100px auto 0;
  max-width: 1200px;
  width: 100%;
`
const ImgBox = styled.div`
  position: relative;
  height: 200px;
`

const TextBox = styled.div`
  margin-top: 74px;
  display: inline-block;
  vertical-align: top;
  width: 32rem;
  width: 52%;
  margin-right: 2rem;
  @media (max-width: 900px){
    display: none;
  }
`
const SmallDesc = styled.p`
  font-size: 18px;
  @media (min-width: 900px){
    display: none;
  }
`

const Title = styled.span`
  font-size: 2.2rem;
  font-weight: 600;
`
const Desc = styled.p`
  font-size: 1.7rem;
  width: 100%;
  margin-top: 14px;
`

const ChirpForm = styled(Form)`
&&{
  display: inline-block;
  margin: 0;
  padding-bottom: 48px;
  @media (max-width: 900px){
    display: block;
    margin: 0 auto;
  }
}
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
  width: 100%;
  margin: 48px auto 0;
  display: flex;
  justify-content: space-between;
  .ant-btn{
    width: 152px;
    height: 48px;
    max-width: 10rem;
  }
`
class ChirpJoin extends Component{
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
  createChirp = () =>{
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
      await this.props.getChirpList()
      NProgress.done()
      this.props.history.replace('chirpindex')
    }else if(res.code == 10030){
      this.setState({hasPassword:true})
      message.warning('This chirp need a password!')
      NProgress.done()
    }else{
      message.error(res.msg)
      NProgress.done()
    }
  }
  render(){
    return (
      <CenterBox>
        <TextBox>
          <Title>Share anything with anyone</Title>
          <Desc>Share your thoughts, photos, videos and documents with a meaningful name. Simple and fast.
          </Desc>
        </TextBox>
        <ChirpForm className='g-form-box'>
          <ImgBox>
            <TwitterLeft></TwitterLeft>
            <TwitterRight></TwitterRight>
          </ImgBox>
          <SmallDesc>Share anything with anyone using a chirp name</SmallDesc>
          <Input
            style={{ height:'56px'}}
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
            <Button style={{width:'152px', height:'48px'}} type='normal' onClick={this.createChirp}>Create</Button>
            <Button style={{width:'152px',height:'48px',marginRight:'0'}} type='normal' onClick={this.joinChirp}>Join</Button>
          </ButtonBox>
        </ChirpForm>
      </CenterBox>
    )
  }
}


export default connect(null, {getChirpList})(ChirpJoin)
