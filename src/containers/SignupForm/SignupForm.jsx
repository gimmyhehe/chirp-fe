import React,{ Component } from 'react'
import styled,{ keyframes } from 'styled-components'
import { fadeInUp } from 'react-animations'
import api from '../../api'
import { Link } from 'react-router-dom'
import { shouldContainLetters, shouldContainNumber, shouldNotHaveSpecialChar } from '../../utils/validation'
import cookies from '../../utils/cookies'
import { Form, Input, Alert } from 'antd'
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

const SignupLink = styled(Link)`
  margin: 18px 0 0;
  text-decoration: underline;
  text-align: center;
  color: #000;
  font-weight: 600;
  font-size: 14px;
  display: block;
`
const SignupProtocol = styled.p`
  font-size: 11px;
  text-align: center;
  margin-top: 24px;
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

class SignupForm extends Component{

  state = {
    confirmDirty: false,
    error: false,
    errorMsg: ''
  }

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
          } else if(response.code === 1001) {
            NProgress.done()
            this.setState({
              error: true,
              errorMsg: response.message
            })

          } else {
            NProgress.done()
            this.setState({
              error: true,
              errorMsg: response.message
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

  render(){
    const { getFieldDecorator } = this.props.form
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
        <Title>Sign Up</Title>
        <FormBox onSubmit={this.handleSubmit}>
          <Form.Item label='First Name'>
            {
              getFieldDecorator('firstName', {
                rules: [{ required: true, message: 'Please enter your first name.' }],
              })(
                <CustomInput placeholder="Given name"></CustomInput>
              )
            }
          </Form.Item>
          <Form.Item label='Last Name'>
            {
              getFieldDecorator('lastName', {
                rules: [{ required: true, message: 'Please enter your last name.' }],
              })(
                <CustomInput placeholder="Family name"></CustomInput>
              )
            }
          </Form.Item>
          <Form.Item label='Email'>
            {
              getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'Please enter a valid email address.',
                }, { required: true, message: 'Please enter a valid email address.' }],
                validateTrigger: ['onBlur']
              })(
                <CustomInput placeholder="Your email"></CustomInput>
              )
            }
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
                }, {
                  validator: shouldContainLetters
                }, {
                  validator: shouldContainNumber
                }, {
                  validator: shouldNotHaveSpecialChar
                }], validateFirst: true,
                validateTrigger: ['onBlur']
              })(
                <CustomInput  type="password" placeholder="Your password"></CustomInput>
              )
            }

          </Form.Item>
          <Form.Item label='Confirm Password'>
            {
              getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
                validateTrigger: ['onBlur']
              })(
                <CustomInput  type="password" placeholder="Type password again"></CustomInput>
              )
            }
          </Form.Item>
          <SignupProtocol>By clicking sign up, you agree to our <span onClick={() => window.open('https://www.onepro.io/terms')} style={{color: '#4a90e2', textDecoration: 'underline', cursor: 'pointer'}}>Terms</span> and <span onClick={() => window.open('https://www.onepro.io/privacy')} style={{color: '#4a90e2', textDecoration: 'underline', cursor: 'pointer'}}>Privacy Policy</span>.</SignupProtocol>
          <SigninButton type='primary' htmlType="submit">Sign Up</SigninButton>
          <SignupLink to='/signin'>Has Account? Sign In</SignupLink>
        </FormBox>
      </CenterBox>
    )
  }
}

export default Form.create()(SignupForm)
