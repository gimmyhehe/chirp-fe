const moment = require('moment')
const random = require('string-random')

export function formatValueForSignUp(value) {
  const formmaterValue = {
    emailAddress: value.email,
    hashedPassword: value.password,
    firstName: value.firstName,
    lastName: value.lastName,
    businessTimeZoneId: value.businessTimeZoneId,
  }
  return formmaterValue
}

export function formatValueForCreateClient(value) {
  let formmaterValue = {
    customerAccountType: value.clientType,
    emailAddress: value.email,
    customerNote: value.notes || '',
  }
  if (value.clientType === 2) {
    formmaterValue.businessName = value.companyName
  }
  if (value.clientType === 1) {
    formmaterValue.firstName = value.firstName
    formmaterValue.lastName = value.lastName
  }
  return formmaterValue
}

export function formatValueForClientsList(clientsList) {
  let formmattedValue
  if (clientsList.status === undefined) {
    formmattedValue = clientsList.map((client, index) => {
      let returnValue
      if (!client.clientName) {
        //Personal
        returnValue = {
          client: `${client.firstName} ${client.lastName}`
        }
      } else {
        returnValue = {
          client: client.clientName
        }
      }
      return {
        ...returnValue,
        key: index,
        customerId: client.customerId,
        email: client.emailAddress,
        contact: client.contactName || '',
        status: client.customerAccountStatus
      }
    })
  } else {
    formmattedValue = []
  }
  return formmattedValue
}

export function formatNameForClientsList(clientsList) {
  const formmattedValue = clientsList.map((client, index) => {
    if (!client.clientName) {
      //Personal
      return {
        client: `${client.firstName} ${client.lastName}`,
        customerId: client.customerId,
        key: index
      }
    } else {
      return {
        client: client.clientName,
        customerId: client.customerId,
        key: index
      }
    }
  })
  return formmattedValue
}

export function formatValueForCreateWork(value) {
  /**
   * formatted_startValue
   * formatted_endValue
   * timeStartValue
   * timeEndValue
   * July 16 2018 11:14 pm
   * moment('July 16 2018 11:14 pm', 'MMM DD YYYY hh:mm a')
   */
  let scheduleStartTime, scheduleEndTime
  if (value.timeOfStartDate && value.timeOfStartDate.length > 0) {
    scheduleStartTime = moment(
      `${value.formatted_startValue} ${value.timeOfStartDate}`,
      'MMM DD YYYY hh:mm a'
    ).format('X')
    scheduleEndTime = moment(
      `${value.formatted_endValue} ${value.timeOfEndDate}`,
      'MMM DD YYYY hh:mm a'
    ).format('X')
  } else {
    (scheduleStartTime = moment(value.formatted_startValue).format('X')),
    (scheduleEndTime = moment(`${value.formatted_endValue} 11:59 pm`, 'MMM DD YYYY hh:mm a' ).format('X'))
  }
  const fmtStartTime = moment
    .unix(Number(scheduleStartTime))
    .format('YYYY MM DD HH:mm')
  const formattedValue = {
    workName: value.workName,
    customerId: value.customerId,
    scheduleStartTime: scheduleStartTime, //10
    scheduleEndTime: scheduleEndTime,
    workDescription: value.notes,
    fmtStartTime: fmtStartTime
  }
  return formattedValue
}

export function formatValueForWorkList(worksList) {
  if (worksList.length > 0 && worksList.status === undefined) {
    const formmattedValue = worksList.map((work, index) => {
      return {
        key: index,
        workName: work.workName,
        client: work.clientName,
        dateStart: moment(work.scheduleStartTime, 'X').format('MM-DD-YYYY'),
        pay: '',
        status: work.workStatus,
        customerWorkId: work.customerWorkId,
        customerId: work.customerId
      }
    })
    return formmattedValue
  } else {
    return []
  }
}

export function formatValueForInvoicesList(value) {
  if (value && value.length > 0) {
    const formatedInvoicesList = value.map((invoice, index) => {
      return {
        key: index,
        invoiceNumber: invoice.customerWorkInvoiceId,
        // dateBilled: invoice.invoiceDate,
        dateBilled: moment(invoice.invoiceDate).format('MM-DD-YYYY'),
        client: invoice.clientName,
        amount: invoice.invoiceTotalAmount,
        status: invoice.invoiceStatus
      }
    })
    return formatedInvoicesList
  }
  return []
}
