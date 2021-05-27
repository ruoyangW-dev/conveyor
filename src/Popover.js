import { Tooltip } from 'react-tippy'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import React from 'react'

export const PopoverContent = ({ children }) => (
  <div className="conv-popover-content">{children}</div>
)
export const Popover = ({ labelValue, Content }) => {
  return (
    <React.Fragment>
      <Tooltip
        theme="light"
        trigger="mouseenter"
        position="left"
        className="conv-popover-content"
        html={Content}
      >
        <a href="#">
          <AiOutlineInfoCircle />
        </a>
      </Tooltip>
      {labelValue}
    </React.Fragment>
  )
}
