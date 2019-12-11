import * as actionTypes from '@constants/actionTypes'
import api from '@api'

/**
 * Get invoices info
 * for Invoice list
 */
export function getAllInvoices(userName, businessId) {
  return async (dispatch) => {
    dispatch({ type: actionTypes.ALL_INVOICES_INFO_PENDING })
    try {
      const invoiceList = await api.getAllInvoices(userName, businessId)
      dispatch({ type: actionTypes.ALL_INVOICES_INFO_FULFILLED, invoiceList })
    } catch(error) {
      const invalidValue = !userName || !businessId
      if (invalidValue) {
        dispatch({ type: actionTypes.ALL_INVOICES_INFO_REJECTED, error: new Error(0) })
      } else {
        dispatch({ type: actionTypes.ALL_INVOICES_INFO_REJECTED, error })
      }
    }
  }
}

/**
 * Get invoices info
 * for Invoice list
 */
export function getInvoicesInfo(userName, businessId, clientId) {
  return async (dispatch) => {
    dispatch({ type: actionTypes.INVOICES_INFO_PENDING })
    try {
      const invoiceList = await api.getInvoices(userName, businessId, clientId)
      dispatch({ type: actionTypes.INVOICES_INFO_FULFILLED, invoiceList })
    } catch(error) {
      const invalidValue = !userName || !businessId
      if (invalidValue) {
        dispatch({ type: actionTypes.INVOICES_INFO_REJECTED, error: new Error(0) })
      } else {
        dispatch({ type: actionTypes.INVOICES_INFO_REJECTED, error })
      }
    }
  }
}

/**
 * Get not invoiced works
 */
export function getNotInvoicedWorks(userName, businessId, clientId) {
  return async (dispatch) => {
    dispatch({ type: actionTypes.INVOICE_NOT_INVOICED_WORKS_PENDING, notInvoicedWorks: 'loading' })
    try {
      const notInvoicedWorks = await api.getNotInvoicedWorks(userName, businessId, clientId)
      /**
       * add not invoiced status indicator
       * if 'notInvoiced', display in pop up panel
       * if 'invoiced', display in table
       */
      notInvoicedWorks.data.forEach((element) => {
        element.status = 'notInvoiced'
      })

      dispatch({ type: actionTypes.INVOICE_NOT_INVOICED_WORKS_UPDATE, notInvoicedWorks })
    } catch (error) {
      const invalidValue = !userName || !businessId
      if (invalidValue) {
        dispatch({ type: actionTypes.INVOICES_INFO_REJECTED, error: new Error(0) })
      } else {
        dispatch({ type: actionTypes.INVOICES_INFO_REJECTED, error })
      }
    }
  }
}

/**
 * Get invoiced works
 * for Modify invoice only
 */
export function getInvoiceDetail(userName, businessId, invoiceId) {
  return async (dispatch) => {
    dispatch({ type: actionTypes.INVOICE_INVOICED_WORKS_PENDING, invoiceDetail: 'loading'})
    try {
      const invoiceDetail = await api.getInvoiceDetail(userName, businessId, invoiceId)
      /**
       * add invoiced status indicator
       * if 'notInvoiced', display in pop up panel
       * if 'invoiced', display in table
       */
      invoiceDetail.data.addedWorksList.forEach((element) => {
        element.status = 'invoiced'
      })

      dispatch({ type: actionTypes.INVOICE_INVOICED_WORKS_UPDATE, invoiceDetail })
    } catch (error) {
      const invalidValue = !userName || !businessId
      if (invalidValue) {
        dispatch({ type: actionTypes.INVOICES_INFO_REJECTED, error: new Error(0) })
      } else {
        dispatch({ type: actionTypes.INVOICES_INFO_REJECTED, error })
      }
    }
  }
}


export default{
  getInvoicesInfo,
  getNotInvoicedWorks,
  getInvoiceDetail,
}
