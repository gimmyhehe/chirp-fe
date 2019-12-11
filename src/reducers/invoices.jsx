import * as actionTypes from '@constants/actionTypes'
import { invoices } from '@utils/storage'

export default (state = {
  invoiceList: invoices.get('invoiceList', []),
  retrievedClientId: '',
  invoiceDetail: invoices.get('invoiceDetail', []),
  invoicedWorks: invoices.get('invoicedWorks', []),
  notInvoicedWorks: invoices.get('notInvoicedWorks', [])
}, action) => {

  switch (action.type) {
    // Invoice list
    case actionTypes.INVOICES_INFO_PENDING:
      return {
        ...state,
        invoiceList: [],
        loading: true
      }
    case actionTypes.INVOICES_INFO_FULFILLED:
      invoices.set('invoiceList', action.invoiceList)
      return {
        invoiceList: action.invoiceList,
        loading: false
      }
    case actionTypes.INVOICES_INFO_REJECTED:
      invoices.set('error', action.error)
      return {
        ...state,
        error: action.error,
        loading: false
      }
    default:
      return {
        ...state,
        loading: false
      }

    /**
     * Create/Modify invoice
     */
    // get notInvoicedWorks
    case actionTypes.INVOICE_NOT_INVOICED_WORKS_PENDING:
      return {
        ...state,
        notInvoicedWorks: [],
        loading: true
      }
    case actionTypes.INVOICE_NOT_INVOICED_WORKS_UPDATE:
      invoices.set('notInvoicedWorks', action.notInvoicedWorks)
      return {
        ...state,
        notInvoicedWorks: action.notInvoicedWorks,
        loading: false
      }
    case actionTypes.INVOICE_NOT_INVOICED_WORKS_REJECTED:
      return {
        notInvoicedWorks: [],
        loading: false
      }

    /**
     * Modify invoice
     */
    // get invoiceDetail
    case actionTypes.INVOICE_INVOICED_WORKS_PENDING:
      return {
        ...state,
        invoiceDetail: [],
        invoicedWorks: [],
        getInvoicedWorksLoading: true
      }
    case actionTypes.INVOICE_INVOICED_WORKS_UPDATE:
      invoices.set('invoiceDetail', action.invoiceDetail)
      return {
        ...state,
        invoiceDetail: action.invoiceDetail,
        invoicedWorks: action.invoiceDetail.data.addedWorksList,
        getInvoicedWorksLoading: false
      }
    case actionTypes.INVOICE_INVOICED_WORKS_REJECTED:
      return {
        invoiceDetail: [],
        invoicedWorks: [],
        getInvoicedWorksLoading: false
      }
  }
}
