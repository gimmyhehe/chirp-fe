import React,{ Component } from 'react'
import styled,{ keyframes } from 'styled-components'
import { fadeInUp } from 'react-animations'
import api from '../../api'
import cookies from '../../utils/cookies'
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

const CustomInput = styled(Input)`
&&{
  width: 327px;
  height: 49px;
  margin-top: 8px;
}
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
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        NProgress.start()
        values = {
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          email: values.email,
        }
        try {
          const response = await api.signUp(values)
          console.log(response)
          if (response.code === 0) {
            values = response.data
            cookies.set('userName', values.email)
            cookies.set('businessId', 0)
            NProgress.done()
            this.setState({
              error: false
            })
            alert('sign up success!')
            // const login = await Promise.resolve(
            //   api.login({
            //     emailAddress: values.emailAddress,
            //     hashedPassword: values.hashedPassword,
            //   })
            // )
            // if(login.code === 200) this.props.history.push('/home')
          } else if(response.code === 400) {
            NProgress.done()
            if(response.message === 'This email has been registered') {
              this.setState({
                error: true,
                errorMsg: 'Email Address already being used'
              })
            }
          } else {
            NProgress.done()
            this.setState({
              error: true,
              errorMsg: 'Currently sign up service not avaliable Please retry later'
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
              this.state.pwdChecked ? <Input style={{height:'40px'}} placeholder='type password here…' /> :null
            }
          </Item>
          <Item>
            <div>
              <Label>Upload Permission</Label>
              <Switch></Switch>
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
            <SigninButton type='primary' htmlType="submit">Skip</SigninButton>
          </ButtonBox>
        </FormBox>
      </CenterBox>
    )
  }
}

export default Form.create()(ChirpSetting)
