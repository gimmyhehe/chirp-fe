import { connect } from 'react-redux'
import { doLogin } from '@actions/user'
import { SigninForm } from '@pages'

const mapStateToProps = state => ({
  user: state.user,
  chirps: state.chirps
})

export default connect(mapStateToProps, { doLogin })(SigninForm)
