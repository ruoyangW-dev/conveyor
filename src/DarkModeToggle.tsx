import React from 'react'
import { IoMdSunny, IoMdMoon } from 'react-icons/io'

export const DarkModeToggle: React.FunctionComponent<{
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  isDarkMode: boolean
  className: string
}> = ({ onClick, isDarkMode, className }) => {
  const ModeIndicator = isDarkMode ? IoMdSunny : IoMdMoon
  return (
    <button onClick={onClick} className={'conv-dark-mode-toggle ' + className}>
      <ModeIndicator className="conv-dark-mode-indicator" size={30} />
    </button>
  )
}
