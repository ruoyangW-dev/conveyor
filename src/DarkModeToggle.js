import React from 'react'
import { IoMdSunny, IoMdMoon } from 'react-icons/io'

export const DarkModeToggle = ({ onClick, isDarkMode, className}) => {
  //const isDarkMode = false//useSelector(R.path(['settings', 'isDarkMode']))
  const ModeIndicator = isDarkMode ? IoMdSunny : IoMdMoon
  return (
    <button
      onClick={onClick}
      className={`conv-dark-mode-toggle `+ className}
    >
      <ModeIndicator className="d-inline mode-indicator ml-auto" size={30} />
    </button>
  )
}