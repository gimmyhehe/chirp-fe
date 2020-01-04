import React,{ Component } from 'react'
import styled,{ keyframes } from 'styled-components'
import { fadeInUp } from 'react-animations'
import api from '../../api'
import { Link } from 'react-router-dom'
import { shouldContainLetters, shouldContainNumber, shouldNotHaveSpecialChar } from '../../utils/validation'
import cookies from '../../utils/cookies'
import { Form, Input, Alert, Avatar } from 'antd'
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
const ButtonBox = styled.div`
  width: 326px;
  margin: 48px auto 0;
  display: flex;
`
const UserImg = styled.div`
  margin: 24px 0 16px;
  text-align: center;
`
const UserName = styled.div`
  text-align: center;
  font-size:17px;
  letter-spacing:-0.41px;
  font-weight: 600;
`

const fadeInUpAnimation = keyframes`${fadeInUp}`
const AlertWrapper = styled.div`
    position:absolute;
    z-index: 2;
    top: 100px;
    width: 340px;
    animation: 0.5s ${fadeInUpAnimation};
`

class UserSettings extends Component{

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
        <Title>User Setting</Title>
        <FormBox onSubmit={this.handleSubmit}>
          <UserImg><Avatar size={64} icon="user" /></UserImg>

          <UserName>user name</UserName>
          <Form.Item label='First Name'>
            {
              getFieldDecorator('firstName', {
                initialValue: 'firstName',
                rules: [{ required: true, message: 'Please enter your first name.' }],
              })(
                <CustomInput placeholder="Given name"></CustomInput>
              )
            }
          </Form.Item>
          <Form.Item label='Last Name'>
            {
              getFieldDecorator('lastName', {
                initialValue: 'lastName',
                rules: [{ required: true, message: 'Please enter your last name.' }],
              })(
                <CustomInput placeholder="Family name"></CustomInput>
              )
            }
          </Form.Item>
          <Form.Item label='New Password'>
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
          <ButtonBox>
            <Button style={{width:'152px',height:'48px'}} type='normal'>Cancel</Button>
            <Button style={{width:'152px',height:'48px',marginRight:'0'}} type='primary'>Save</Button>
          </ButtonBox>
        </FormBox>
      </CenterBox>
    )
  }
}

export default Form.create()(UserSettings)
