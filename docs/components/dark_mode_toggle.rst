

******************************
Dark Mode Toggle
******************************

*How to use:*
import { DarkModeToggle } from '@autoinvent/conveyor'
import { toggleDarkMode, selectDarkMode } from '@autoinvent/conveyor-redux'

const isDarkMode = useSelector(selectDarkMode)

<DarkModeToggle
    isDarkMode={isDarkMode}
    onClick={() => dispatch(toggleDarkMode())}
    className="my-css-class-name"
/>