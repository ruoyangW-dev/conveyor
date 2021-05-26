import React from 'react'
import printJS from 'print-js'

const PrintButton = ({ url }) => (
  <button
    onClick={() =>
      printJS({
        printable: url,
        documentTitle: 'Image',
        type: 'image',
        style: 'img {display: block; margin: auto;}'
      })
    }
    className="btn btn-sm btn-outline-success conv-print-button"
    role="button"
  >
    Print
  </button>
)

export default PrintButton
