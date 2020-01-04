/*
 * @Author: your name
 * @Date: 2019-12-14 15:50:02
 * @LastEditTime : 2019-12-29 12:06:20
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \chrip-fe\src\api\index.js
 */
import app from './app'
import chirp from './chirp'
// import clients from './clients'
// import documents from './documents'
// import invoices from './invoices'
// import staffs from './staffs'
import user from './user'
// import works from './works'

export default {
  ...app,
  ...chirp,
  // ...clients,
  // ...documents,
  // ...invoices,
  // ...staffs,
  ...user,
  // ...works,
}
