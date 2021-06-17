export const convertUTCToLocalDate = (date: any) => {
  if (!date) {
    return date
  }
  date = new Date(date)
  date = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  )
  return date
}

export const convertLocalToUTCDate = (date: any) => {
  if (!date) {
    return date
  }
  date = new Date(date)
  date = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  )
  return date
}
