import React,{ Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Input,Form } from 'antd'
import api from '../../api'
import cookies from '../../utils/cookies'
import { Button } from '@components'
import NProgress from 'nprogress'

const Title = styled.h1`
  font-size: 36px;
  letter-spacing: -0.86px;
  text-align: center;
  font-weight: 600;
  margin-top: 108px;
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
  margin: 8px 0 0 24px;
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
          api.login(values).then(async (response)=>{
            console.log(response)
            response = JSON.parse(response)
            await this.props.getUserInfo()
            console.log(this.props.user)
            // let res = await getUserInfo()
            // console.log(res)
            if (response.code == 10007) {

              NProgress.set(0.5)
              cookies.set('userName', values.email)
              cookies.set('password', values.password)
              cookies.set('uid', response.uid)

              // await this.props.getUserInfo(values.email, 0)
              NProgress.done()

              const pathname =
                this.props.location.state && this.props.location.state.from
              const history = pathname
                ? { pathname }
                : {
                  pathname: 'chirpall',
                  state: { userName: values.email, businessId: 0 }
                }
              this.props.history.push(history)
            } else {
              NProgress.done()
              this.setState({
                error: true
              })
            }
            NProgress.done()
          },e=>{ console.log(e) })

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
    const { getFieldDecorator } = this.props.form
    return(
      <div>
        <Title>Sign In</Title>
        <FormBox onSubmit={this.handleSubmit}>
          <Form.Item label='Email'>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'Please enter a valid email address.',
              }, { required: true, message: 'Please enter a valid email address.' }],
              validateTrigger: ['onBlur']
            })(
              <CustomInput placeholder="Your email"></CustomInput>
            )}
          </Form.Item>
          <Form.Item label='Password'>
            {
              getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Please enter your password.',
                }, {
                  validator: this.validateToNextPassword,
                }, {
                  min: 8, message: 'The password should contain at least 8 characters, at least one number and at least one letter. Upper case letter and special letter are recommended.'
                }
                ], validateFirst: true,
                validateTrigger: ['onBlur']
              })(
                <CustomInput  type="password" placeholder="Your password"></CustomInput>
              )
            }
          </Form.Item>
          <ForgotPwd to='/signup'>Forgot Password?</ForgotPwd>
          <SigninButton type='primary' htmlType="submit">Sign In</SigninButton>
          <SignupLink to='/signup'>No Account? Create One</SignupLink>
        </FormBox>
      </div>
    )
  }
}
export default Form.create({name:'signinForm'})(SigninForm)
