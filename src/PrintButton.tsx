import React from 'react'
import printJS from 'print-js'

type PrintButtonProps = { url: string }
const PrintButton = ({ url }: PrintButtonProps) => (
  <button
    onClick={() =>
      printJS({
        printable: url,
        documentTitle: 'Image',
        type: 'image',
        style: 'img {display: block; margin: auto;}'
      })
    }
    className="conv-print-button"
    role="button"
  >
    Print
  </button>
)

export default PrintButton
