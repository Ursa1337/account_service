export function dateWithOffset(offsetDate: number): Date {
  let date = new Date()
  return new Date(date.setDate(date.getDate() + offsetDate))
}

export function generateToken(length: number): string {
  let result = ''
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_'
  let charactersLength = characters.length
  let date = new Date().getTime().toString(16)
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result.slice(date.length) + date
}
