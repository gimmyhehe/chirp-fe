import React,{ Component } from 'react'
import styled,{ keyframes } from 'styled-components'
import { fadeInUp } from 'react-animations'
import api from '../../api'
import { getParams } from '@utils/tool'
import { connect } from 'react-redux'
import { getChirpList } from '@actions/chirps'
import ChirpSettingFrom from './ChirpSettingForm'
import { Form, Alert   } from 'antd'
import NProgress from 'nprogress'

const CenterBox = styled.div`
  display: inline-block;
  top: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

`


const Title = styled.h1`
  font-size: 36px;
  letter-spacing: -0.86px;
  text-align: center;
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


class ChirpSetting extends Component{

  state = {
    expirationDay: 0,
    pwdChecked: false,
    uploadPermission: false,
    password: null
  }

  handleChange = expirationDay => {
    this.setState({ expirationDay })
  };

  handleSubmit = (e) =>{
    e.preventDefault()
    let searchParams = getParams(this.props.location.search)
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        NProgress.start()
        let { expirationDay,password,uploadPermission } = this.state
        values = {
          cmd : 21,
          chirpName: searchParams.chirpName,
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
  onChange = (pwdChecked)=> {
    this.setState({pwdChecked})
  }
  render(){
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
        <Title>Chirp Setting</Title>
        <ChirpSettingFrom operation ='create' history={this.props.history} chirpName={ getParams(this.props.location.search).chirpName } />
      </CenterBox>
    )
  }
}

export default connect(null, {getChirpList})(Form.create()(ChirpSetting))
