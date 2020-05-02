import React,{ Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Input,Form } from 'antd'
import cookies from '../../utils/cookies'
import { Button } from '@components'
import { store } from '@store'
import NProgress from 'nprogress'

const Title = styled.h1`
  font-size: 1.8rem;
  letter-spacing: -0.86px;
  text-align: center;
  font-weight: 600;
  margin-top: 5rem;
`
const SignupLink = styled(Link)`
  margin: 18px 0 0;
  text-decoration: underline;
  text-align: center;
  color: #000;
  font-weight: 600;
  font-size: 14px;
  display: block;
`
const ForgotPwd = styled(SignupLink)`
  text-decoration: underline;
  margin: 8px 0 0 0;
  display: inline-block;
`
const CustomInput = styled(Input)`
&&{
  width: 327px;
  height: 49px;
  margin-top: 8px;
}
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


class SigninForm extends Component{

  handleSubmit = (e) =>{
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        NProgress.start()
        values = {
          email: values.email,
          password: values.password,
          deviceID: '123'
        }
        try {
          this.props.doLogin(values).then((res)=>{
            console.log(res)
            let { user } = store.getState()
            if(user.isLogin){
              cookies.set('userEmail', values.email, { expires: '1d' })
              cookies.set('password', values.password, { expires: '1d' })
              let prevLocation =
              this.props.location.state && this.props.location.state.from
              let to = prevLocation ? prevLocation : { pathname: 'chirpindex' }
              this.props.history.push(to)
            }
          })
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

  render(){
    if(this.props.user.isLogin){
      this.props.history.replace('/')
    }
    const { getFieldDecorator } = this.props.form
    return(
      <div>
        <Title>Sign In</Title>
        <Form className='g-form-box' onSubmit={this.handleSubmit}>
          <Form.Item label='Email'>
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: 'Please enter a valid email address.',},
                { required: true, message: 'Please enter a valid email address.' }
              ],
              validateTrigger: ['onBlur']
            })(
              <CustomInput placeholder="Your email"></CustomInput>
            )}
          </Form.Item>
          <Form.Item label='Password'>
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    required: true, message: 'Please enter your password.',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                  {
                    min: 8, message: 'The password should contain at least 8 characters, at least one number and at least one letter. Upper case letter and special letter are recommended.'
                  }
                ],
                validateFirst: true,
                validateTrigger: ['onBlur']
              })(
                <CustomInput  type="password" placeholder="Your password"></CustomInput>
              )
            }
          </Form.Item>
          <ForgotPwd to='/forgotpassword'>Forgot Password?</ForgotPwd>
          <SigninButton type='primary' htmlType="submit">Sign In</SigninButton>
          <SignupLink to='/signup'>No Account? Create One</SignupLink>
        </Form>
      </div>
    )
  }
}
export default Form.create({name:'signinForm'})(SigninForm)
