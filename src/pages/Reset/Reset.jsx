import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { getParams } from '@utils/tool'
import styled from 'styled-components'
import { Input,Form, message } from 'antd'
import { Button } from '@components'
import api from '@/api'
import { shouldContainLetters, shouldContainNumber, shouldNotHaveSpecialChar } from '@/utils/validation'

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
function Reset(props) {

  const { getFieldDecorator } = props.form
  const location = useLocation()
  const history = useHistory()
  const { token } = getParams(location.search)
  const compareToFirstPassword = (rule, value, callback) => {
    const form = props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('The confirm password does not match the new password.')
    } else {
      callback()
    }
  }
  const getPasswordRules = ()=> {
    return {
      rules: [{
        required: true, message: 'Please enter your password.',
      }, {
        min: 8, message: 'The password should contain at least 8 characters, at least one number and at least one letter. Upper case letter and special letter are not recommended.'
      }, {
        validator: shouldContainLetters
      }, {
        validator: shouldContainNumber
      }, {
        validator: shouldNotHaveSpecialChar
      }], validateFirst: true,
      validateTrigger: ['onBlur']
    }
  }

  const getConfirmRules = ()=> {
    return {
      rules: [{
        required: true, message: 'Please confirm your password!',
      }, {
        validator: compareToFirstPassword,
      }],
      validateTrigger: ['onBlur']
    }
  }

  const handleSubmit = (e)=> {
    e.preventDefault()
    props.form.validateFields(async (err, values) => {
      if(!err){
        const params = {
          token,
          password: values.password
        }
        const res = await api.resetPassword(params)
        if(res.code === 0){
          message.success('Reset password success. You can signin now.')
          history.replace('/signin')
        }else{
          message.error(res.message)
        }
      }
    })
  }
  return (
    <div>
      <Title>Reset Password</Title>
      <Form className='g-form-box' onSubmit={handleSubmit}>
        <Form.Item label='New Password'>
          {
            getFieldDecorator('password', getPasswordRules())(
              <CustomInput  type="password" placeholder="Your password"></CustomInput>
            )
          }

        </Form.Item>
        <Form.Item label='Confirm Password'>
          {
            getFieldDecorator('confirm', getConfirmRules())(
              <CustomInput  type="password" placeholder="Type password again"></CustomInput>
            )
          }
        </Form.Item>
        <SigninButton type='primary' htmlType="submit">Reset</SigninButton>
      </Form>
    </div>
  )

}

export default Form.create({name:'reset'})(Reset)
