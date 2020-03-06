import React,{ Component } from 'react'
import styled,{ keyframes } from 'styled-components'
import { fadeInUp } from 'react-animations'
import api from '../../api'
import { getParams } from '@utils/tool'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import { Form, Input, Alert,Slider,Switch   } from 'antd'
import { Button } from '@components'
import NProgress from 'nprogress'

const CenterBox = styled.div`
  display: inline-block;
  top: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

`


const Title = styled.h1`
  font-size: 36px;
  letter-spacing: -0.86px;
  text-align: center;
  font-weight: 600;
`
const FormBox = styled(Form)`
  &&{
    width: 375px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.14);
    position: relative;
    overflow: hidden;
    background-color: #fff;
    margin: 0 auto;
    padding: 0 24px 24px;
    .ant-form-item{
      margin-bottom:0;
    }
    .ant-form-item-label{
      font-size: 14px;
      line-height: unset;
      margin: 20px 0 0 0;
      font-weight: 600;
    }
    .ant-form-item-required::before{
      display: none;
    }
  }
`
const Item = styled.div`
  padding:24px 8px 14px;
  border-bottom: rgb(216,219,226) 1px solid;
  .ant-switch{
    float: right;
  }
`
const ButtonBox = styled.div`
  width: 326px;
  margin: 20px auto 0;
  display: flex;
`

const SigninButton = styled(Button)`
&&{
  width: 327px;
  height: 48px;
  margin: 0 auto;
  display: block;
  margin-top: 16px;
}
`

const fadeInUpAnimation = keyframes`${fadeInUp}`
const AlertWrapper = styled.div`
    position:absolute;
    z-index: 2;
    top: 100px;
    width: 340px;
    animation: 0.5s ${fadeInUpAnimation};
`
const CustomSlider = styled(Slider)`
  .ant-tooltip-inner{
    background: unset;
    box-shadow: none;
    color: rgb(75,157,11);
    transform: translate(0, 10px);
  }
`
const Label = styled.span`
  font-size:20px;
  letter-spacing: 0.35px;
  font-weight:600;
`

class ChirpSetting extends Component{

  state = {
    expirationDay: 0,
    pwdChecked: false,
    uploadPermission: false,
    password: null
  }

  handleChange = expirationDay => {
    this.setState({ expirationDay })
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('The confirm password does not match the new password.')
    } else {
      callback()
    }
  }

  handleSubmit = (e) =>{
    e.preventDefault()
    let searchParams = getParams(this.props.location.search)
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        NProgress.start()
        let { expirationDay,password,uploadPermission } = this.state
        values = {
          cmd : 21,
          chirpName: searchParams.chirpName,
          isUploadPermitted: +uploadPermission,
          expiration: `${expirationDay}d`,
          password: password
        }
        try {
          console.log(values)
          const response = await api.createChirp(values)
          console.log(response)
          if (response.code === 10022) {
            await this.props.getChirpList()
            NProgress.done()
            this.setState({
              error: false
            })
            this.props.history.replace('/chirpall')
          } else {
            NProgress.done()
            this.setState({
              error: true,
              errorMsg: response.msg
            })
          }
        } catch (err) {
          NProgress.done()
          console.log(err)
          this.setState({
            error: true,
            errorMsg: 'Currently sign up service not avaliable Please retry later'
          })
        }
      }
    })
  }
  onChange = (pwdChecked)=> {
    this.setState({pwdChecked})
  }
  render(){
    const { expirationDay } = this.state
    const marks ={
      1: '1Day',
      7: '7Day'
    }
    return(
      <CenterBox>
        {
          this.state.error ? (
            <AlertWrapper>
              <Alert
                message="Sign up Fail"
                description={this.state.errorMsg}
                type="error"
                showIcon
                closable
                onClose={() => {
                  this.setState({
                    error: false
                  })
                }}
              />
            </AlertWrapper>
          ) : null
        }
        <Title>Chirp Setting</Title>
        <FormBox onSubmit={this.handleSubmit}>
          <Item>
            <div>
              <Label>Password</Label>
              <Switch defaultChecked={this.state.pwdChecked} onChange={this.onChange}></Switch>
            </div>
            <p>Setting password will avoid people join chirp with only chirp name.</p>
            {
              this.state.pwdChecked ?
                <Input
                  style={{height:'40px'}}
                  value={this.state.password}
                  onChange = {(e)=>{
                    this.setState({password:e.target.value})
                  }}
                  placeholder='type password here…'
                /> :null
            }
          </Item>
          <Item>
            <div>
              <Label>Upload Permission</Label>
              <Switch
                defaultChecked={this.state.uploadPermission}
                onChange={(uploadPermission)=>{ this.setState({uploadPermission})}}
              ></Switch>
            </div>
            <p>This will allow everyone in the chirp upload files.</p>
          </Item>
          <Item style={{borderBottom:'none'}}>
            <Label>Chirp Expiration Date</Label>
            <CustomSlider marks={marks} min={1} max={7}
              onChange={this.handleChange}
              tipFormatter={(value)=> `${value}Day` }
              value={expirationDay}
              defaultValue={3} />
            <p>You can have a maximum of 365 days if you had account with us.  </p>
          </Item>
          <ButtonBox>
            <SigninButton type='primary' htmlType="submit">Create</SigninButton>
          </ButtonBox>
        </FormBox>
      </CenterBox>
    )
  }
}

export default connect(null, {getChirpList})(Form.create()(ChirpSetting))
