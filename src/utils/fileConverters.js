export const arrayBufferToStoreValue = (arrayBuffer) => {
  const view = new DataView(arrayBuffer)
  const value = []
  for (let i = 0; i < arrayBuffer.byteLength; ++i) {
    value.push(view.getUint8(i))
  }
  return value
}

export const storeValueToArrayBuffer = (value) => {
  const arrayBuffer = new ArrayBuffer(value.length)
  const view = new DataView(arrayBuffer)
  for (let i = 0; i < value.length; ++i) {
    view.setUint8(i, value[i])
  }
  return arrayBuffer
}
