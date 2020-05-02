import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Input,Form } from 'antd'
import { Button } from '@components'

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
function ForgotPassord(props) {

  const { getFieldDecorator } = props.form
  function handleSubmit(e) {
    e.preventDefault()
  }
  return (
    <div>
      <Title>Forgot Password</Title>
      <Form className='g-form-box' onSubmit={handleSubmit}>
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
        <SigninButton type='primary' htmlType="submit">Send Email</SigninButton>
      </Form>
    </div>
  )

}

export default Form.create({name:'forgotPassword'})(ForgotPassord)
