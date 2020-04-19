import { connect } from 'react-redux'
import { UserSetting } from '@pages'

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps, null)(UserSetting)
