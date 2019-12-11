export default class Storage {
  constructor(name, initialValue = {}, storage = sessionStorage) {
    this.name = name
    this.storage = storage
    this.data = storage[this.name]
      ? JSON.parse(storage[this.name])
      : initialValue
  }

  set = (key, value) => {
    this.data[key] = value
    this.storage[this.name] = JSON.stringify(this.data)
  }

  get = (key, defaultValue = undefined) => {
    if (!this.storage[this.name]) return defaultValue
    const data = JSON.parse(this.storage[this.name])
    return data[key]
  }

  remove = (key) => {
    delete this.data[key]
    this.storage[this.name] = JSON.stringify(this.data)
  }

  clear = () => {
    this.data = {}
    this.storage[this.name] = JSON.stringify(this.data)
  }
}

export const user = new Storage('user')
export const clients = new Storage('client')
export const works = new Storage('works')
export const staffs = new Storage('staffs')
export const invoices = new Storage('invoices')
