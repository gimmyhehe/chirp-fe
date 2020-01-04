import { connect } from 'react-redux'
import { getUserInfo } from '../actions/user'
import { SigninForm } from '@pages'

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, {getUserInfo})(SigninForm)
