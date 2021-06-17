export const validColorCheck = (colorStr: string) => {
  if (
    !(colorStr === null || typeof colorStr === 'undefined') &&
    colorStr.length === 7
  ) {
    const pattern = /#[0-f][0-f][0-f][0-f][0-f][0-f]/
    if (colorStr.match(pattern) !== null) {
      return true
    }
  }
  return false
}
