const moment = require('moment')

export function nameSorter(b, a) {
  // 现在是A-Z，a, b调换位置是Z-A
  if (a.charCodeAt(0) !== b.charCodeAt(0)) {
    return a.charCodeAt(0) - b.charCodeAt(0)
  } else {
    return a.length - b.length
  }
}

export function contactSorter(a, b) {
  // 现在是A-Z，a, b调换位置是Z-A
  if (a.length === 0) {
    return b.length - a.length
  } else {
    if (a.charCodeAt(0) !== b.charCodeAt(0)) {
      return a.charCodeAt(0) - b.charCodeAt(0)
    } else {
      return b.length - a.length
    }
  }
}

export function priceSorter(b, a) {
  if (a.length === 0) {
    return b.length - a.length
  } else {
    let formatedA = parseFloat(formatedPrice(a))
    let formatedB = parseFloat(formatedPrice(b))
    if (formatedA - formatedB > 0) {
      return 1
    } else if (formatedA - formatedB < 0) {
      return -1
    } else {
      return 0
    }
  }
}

function formatedPrice(price) {
  let returnValue = ''
  // price
  //   .slice(1)
  //   .split(',')
  //   .forEach(str => {
  //     returnValue = returnValue.concat(str)
  //   })
  returnValue = price.replace(/,/g, '')
  return returnValue
}

export function invoiceNumberSorter(b, a) {
  return parseInt(a) - parseInt(b)
}

export function dateSorter(a, b) {
  return moment(a).format('X') - moment(b).format('X')
}
