import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '../../api'
import { connect } from 'react-redux'
import { createChirp as createChirpAction, updateChirp } from '@actions/chirps'
import { Form, Input,Slider,Switch,Modal, message   } from 'antd'
import { Button } from '@components'
import NProgress from 'nprogress'

const CustomSwitch = styled(Switch)`
  &.ant-switch{
    transition: unset;
    min-width: unset;
    width: 28px;
    height: 19px;
    border: #000 solid 3px;
    background: #fff;
    &::after{
      transition: right 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
      transition: unset;
      width: 19px;
      height: 19px;
      border: 3px #000 solid;
      top: -3px;
      left: -3px;
    }
  }
  &.ant-switch-checked{
    background: #4b9d0b;
    border: none;
    &::after{
      left: unset;
      right: 3px;
      top: 3px;
      transform: unset;
      width: 13px;
      height: 13px;
      border: none;
    }
  }
`
const FormBox = styled(Form)`
  &&{
    width: 424px;
    max-width: 100vw;
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
const Item = styled(Form.Item)`
  padding: 1.2rem 0.4rem 0.7rem;
  border-bottom: rgb(216,219,226) 1px solid;
  .ant-switch{
    float: right;
    margin: 4px 0 4px;
  }
  p{
    margin: 0;
    line-height: 1.45;
  }
`
const ButtonBox = styled.div`
  width: 100%;
  margin: 20px auto 0;
  display: flex;
`

const CustomButton = styled(Button)`
&&{
  width: 327px;
  height: 48px;
  margin: 0 auto;
  display: block;
}
`
const SettingButton = styled(CustomButton)`
&&{
  width : 160px;
  max-width: 10rem;
  max-height: 3rem;
}
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

class ChirpSettingForm extends Component{

  constructor(porps){
    super(porps)
    let defaultSetting = {
      expirationDay:  30,
      pwdChecked:  false,
      uploadPermission:  false,
      password:  null
    }
    this.state = {
      modalVisible: false,
      ...defaultSetting,
      ...this.props.chirpSetting
    }

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
    this.props.form.validateFields(async (err) => {
      if (!err) {
        NProgress.start()
        let { expirationDay,password,uploadPermission } = this.state
        let param = {
          cmd : 21,
          chirpName: this.props.chirpName,
          isUploadPermitted: +uploadPermission,
          expiration: `${expirationDay}d`,
          password: password
        }
        try {
          const response = await api.createChirp(param)
          if(response.error){
            NProgress.done()
            return
          }
          if (response.code === 10022) {
            await this.props.createChirpAction(response.data)
            NProgress.done()
            this.props.history.replace('/chirpindex')
          } else {
            NProgress.done()
            Modal.error({ content: response.msg })
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
  handleSave =(e)=>{
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if(!err){
        let { expirationDay,password,uploadPermission,pwdChecked } = this.state
        values = {
          cmd : 27,
          chirpId: this.props.currentChirp.id,
          isUploadPermitted: +uploadPermission,
          expiration: `${expirationDay}d`,
          passwordEnabled: +pwdChecked,
          password: password
        }
        const response = await api.saveChirpSetting(values)
        console.log(response)
        if(response.error){
          return
        }
        if( response.code == 10033 ){
          message.success('save setting success')
          this.props.updateChirp( {
            id: this.props.currentChirp.id,
            uploadPermissionEnabled: +uploadPermission,
            expiredDate: this.props.currentChirp.createTime + expirationDay *24*60*60*1000  } )

          this.props.hide()
        }else{
          this.setState({ modalVisible: false})
          message.error(response.msg)
        }
      }else{
        console.log(err)
      }
    })
  }
  handleDelete = () =>{
    this.setState({ modalVisible: true})
  }
  handleCancel = ()=>{
    this.setState({ modalVisible: false})
  }
  handleDeleteChirp = ()=>{
    // to do deletechirp
    let param = { 'cmd':29,'chirpId':this.props.currentChirp.id}
    api.deleteChirp(param).then(()=>{
      this.props.hide()
    })
      .catch(err=>{
        message.error('delete chirp fail')
        console.log(err)
      })
    this.setState({ modalVisible: false})
  }
  onChange = (pwdChecked)=> {
    this.setState({pwdChecked})
  }
  render(){
    const ButtonGroup = () =>{
      if(this.props.operation == 'create'){
        return (
          <ButtonBox>
            <CustomButton type='primary' htmlType="submit">Create</CustomButton>
          </ButtonBox>
        )
      }else{
        return (
          <ButtonBox>
            <SettingButton type='primary' onClick={this.handleSave}>Save</SettingButton>
            <SettingButton type='normal' onClick={this.handleDelete}>Delete Chirp</SettingButton>
          </ButtonBox>
        )
      }
    }
    const { expirationDay } = this.state
    const marks ={
      1: '1Day',
      365: '365Day'
    }
    return(
      <div>
        <Modal
          title="Delete Chirp"
          visible={this.state.modalVisible}
          onOk={this.handleDeleteChirp}
          confirmLoading={this.confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>Are you sure to delete this chirp?</p>
        </Modal>
        <FormBox onSubmit={this.handleSubmit}>
          <Item>
            <div>
              <Label>Password</Label>
              <CustomSwitch defaultChecked={this.state.pwdChecked} onChange={this.onChange}></CustomSwitch>
            </div>
            <p>Setting password will avoid people join chirp with only chirp name.</p>
            {
              this.state.pwdChecked ?
              // getFieldDecorator('password',{
              //   rules:[
              //     {
              //       required: true,
              //       message: 'Please input your password!',
              //     },
              //   ],
              //   validateTrigger: ['onBlur']
              // })(<Input.Password style={{height:'40px'}} placeholder='type password here…' />)
                <Input
                  style={{height:'40px'}}
                  value={this.state.password}
                  onChange = {(e)=>{
                    this.setState({password:e.target.value})
                  }}
                  placeholder='type password here…'
                />
                :null
            }
          </Item>
          <Item>
            <div>
              <Label>Upload Permission</Label>
              <CustomSwitch
                defaultChecked={this.state.uploadPermission}
                onChange={(uploadPermission)=>{ this.setState({uploadPermission})}}
              ></CustomSwitch>
            </div>
            <p>This will allow everyone in the chirp upload files.</p>
          </Item>
          <Item style={{borderBottom:'none'}}>
            <Label>Chirp Expiration Date</Label>
            <CustomSlider marks={marks} min={1} max={365}
              onChange={this.handleChange}
              tipFormatter={(value)=> `${value}Day` }
              value={expirationDay}
              defaultValue={30} />
            <p>You can have a maximum of 365 days if you had account with us.  </p>
          </Item>
          <ButtonGroup />
        </FormBox>
      </div>
    )
  }
}

export default connect(null, { createChirpAction, updateChirp})(Form.create({name:'chirpSettingForm'})(ChirpSettingForm))
