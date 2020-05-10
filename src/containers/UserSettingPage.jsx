import { connect } from 'react-redux'
import { UserSetting } from '@pages'
import { updateUser } from '@/actions/user'
const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps, { updateUser })(UserSetting)
