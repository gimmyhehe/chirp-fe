import React,{ Component } from 'react'
import styled from 'styled-components'
import api from '../../api'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import { Form, Input,Slider,Switch,Modal   } from 'antd'
import { Button } from '@components'
import NProgress from 'nprogress'
const FormBox = styled(Form)`
  &&{
    width: 424px;
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
  padding:24px 8px 14px;
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
      expirationDay:  0,
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
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        NProgress.start()
        let { expirationDay,password,uploadPermission } = this.state
        values = {
          cmd : 21,
          chirpName: this.props.chirpName,
          isUploadPermitted: +uploadPermission,
          expiration: `${expirationDay}d`,
          password: password
        }
        try {
          console.log(values)
          const response = await api.createChirp(values)
          console.log(response)
          if (response.code === 10022) {
            await this.props.getChirpList()
            NProgress.done()
            this.setState({
              error: false
            })
            this.props.history.replace('/chirpall')
          } else {
            NProgress.done()
            this.setState({
              error: true,
              errorMsg: response.msg
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
  handleSave =(e)=>{
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if(!err){
        console.log(this.props)
        let { expirationDay,password,uploadPermission,pwdChecked } = this.state
        values = {
          cmd : 27,
          chirpName: this.props.currentChirp.id,
          isUploadPermitted: +uploadPermission,
          expiration: `${expirationDay}d`,
          passwordEnabled: +pwdChecked,
          password: password
        }
        const response = await api.createChirp(values)
        console.log(response)
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
    this.setState({ modalVisible: false})
  }
  onChange = (pwdChecked)=> {
    this.setState({pwdChecked})
  }
  render(){
    const { getFieldDecorator } = this.props.form
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
      7: '7Day'
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
              <Switch defaultChecked={this.state.pwdChecked} onChange={this.onChange}></Switch>
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
              <Switch
                defaultChecked={this.state.uploadPermission}
                onChange={(uploadPermission)=>{ this.setState({uploadPermission})}}
              ></Switch>
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
          <ButtonGroup />
        </FormBox>
      </div>
    )
  }
}

export default connect(null, {getChirpList})(Form.create({name:'chirpSettingForm'})(ChirpSettingForm))
