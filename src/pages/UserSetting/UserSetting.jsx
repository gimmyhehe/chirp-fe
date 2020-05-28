import React,{ Component } from 'react'
import styled,{ keyframes } from 'styled-components'
import { fadeInUp } from 'react-animations'
import api from '@/api'
import { shouldContainLetters, shouldContainNumber, shouldNotHaveSpecialChar } from '@/utils/validation'
import { Form, Input, Alert, Avatar, message, Modal } from 'antd'
import { Button } from '@components'
import NProgress from 'nprogress'


const CustomInput = styled(Input)`
&&{
  width: 327px;
  height: 49px;
  margin-top: 8px;
}
`

const Title = styled.h1`
  font-size: 1.8rem;
  letter-spacing: -0.86px;
  text-align: center;
  font-weight: 600;
`

const ButtonBox = styled.div`
  width: 100%;
  margin: 2.4rem auto 0;
  display: flex;
  justify-content: space-between;
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

  resetPassword = ()=> {
    Modal.info({
      title: 'Reset password success',
      content: (
        <p>reset password success! you should relogin now! </p>
      ),
      async onOk() {
        await api.logout().then(() => {
        }).catch((error)=>{ console.error(`logout error ${error}`) })
        this.props.history.replace('/signin')
      },
    })
  }

  handleSubmit = (e) =>{
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        NProgress.start()
        let params = {
          token: this.props.user.token,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password
        }
        try {
          const response = await api.modifyUser(params)
          if (response.code === 0) {
            NProgress.done()
            if(values.password){
              this.resetPassword()
            }else{
              message.success('Modify userInfo success.')
              this.props.updateUser(response.data)
            }

          }else {
            NProgress.done()
            message.error(response.message)
          }
        } catch (err) {
          NProgress.done()
          console.log(err)
          this.setState({
            error: true,
            errorMsg: 'Currently service not avaliable Please retry later'
          })
        }
      }
    })
  }

  handleCancel = ()=> {
    this.props.form.setFieldsValue(
      {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        password: undefined,
        confirm: undefined
      }
    )
  }
  render(){
    const userData = this.props.user
    const { getFieldDecorator } = this.props.form
    const getPasswordRules = ()=> {
      if( this.props.form.getFieldValue('password') || this.props.form.getFieldValue('confirm') ){
        return {
          rules: [{
            required: true, message: 'Please enter your password.',
          }, {
            validator: this.validateToNextPassword,
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
      }else{
        return {}
      }
    }

    const getConfirmRules = ()=> {
      if( this.props.form.getFieldValue('password') || this.props.form.getFieldValue('confirm') ){
        return {
          rules: [{
            required: true, message: 'Please confirm your password!',
          }, {
            validator: this.compareToFirstPassword,
          }],
          validateTrigger: ['onBlur']
        }
      }else{
        return {}
      }
    }

    return(
      <div className='center-box'>
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
        <Form className='g-form-box'>
          <UserImg><Avatar size={64} icon="user" /></UserImg>

          <UserName>{`${userData.firstName} ${userData.lastName}`}</UserName>
          <Form.Item label='First Name'>
            {
              getFieldDecorator('firstName', {
                initialValue: userData.firstName,
                rules: [{ required: true, message: 'Please enter your first name.' }],
              })(
                <CustomInput placeholder="First Name"></CustomInput>
              )
            }
          </Form.Item>
          <Form.Item label='Last Name'>
            {
              getFieldDecorator('lastName', {
                initialValue: userData.lastName,
                rules: [{ required: true, message: 'Please enter your last name.' }],
              })(
                <CustomInput placeholder="Family name"></CustomInput>
              )
            }
          </Form.Item>
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
          <ButtonBox>
            <Button
              style={{width:'152px', maxWidth: '10rem', height:'48px'}}
              type='normal'
              onClick = { this.handleCancel }
            >Cancel</Button>
            <Button style={{width:'152px', maxWidth: '10rem', height:'48px',marginRight:'0'}} onClick={this.handleSubmit} type='primary'>Save</Button>
          </ButtonBox>
        </Form>
      </div>
    )
  }
}

export default Form.create()(UserSettings)
