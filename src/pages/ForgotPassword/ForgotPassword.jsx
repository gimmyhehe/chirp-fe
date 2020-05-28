import React from 'react'
import styled from 'styled-components'
import api from '@/api'
import { Input, Form, Modal, message } from 'antd'
import { Button } from '@components'
import nProgress from 'nprogress'

const Title = styled.h1`
  font-size: 1.8rem;
  letter-spacing: -0.86px;
  text-align: center;
  font-weight: 600;
  margin-top: 5rem;
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
    props.form.validateFields(async (err, values) => {
      if(!err){
        nProgress.start()
        const res = await api.forgotPassword({ email: values.email })
        nProgress.done()
        if(res.code===0){
          Modal.success({
            title: 'Success',
            content: 'An email is send to your inbox. It may take a few minutes. Please check your inbox and complete to reset your password.',
          })
        }else{
          message.error(res.message)
        }
      }
    })
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
