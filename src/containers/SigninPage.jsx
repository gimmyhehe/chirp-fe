import { connect } from 'react-redux'
import { getUserInfo } from '@actions/user'
import { getChirpList } from '@actions/chirps'
import { SigninForm } from '@pages'

const mapStateToProps = state => ({
  user: state.user,
  chirps: state.chirps
})

export default connect(mapStateToProps, {getUserInfo,getChirpList})(SigninForm)
