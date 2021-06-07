import React from 'react'
import { Link } from 'react-router-dom'

/**
 * React Component for Create Button
 * @param onClick
 * @return Rendered React Component
 */
const CreateButton: React.FunctionComponent<{ onClick: any }> = ({ onClick }) => (
  <Link
    to="/Create"
    onClick={onClick}
    className="conv-create-button"
    role="button"
    replace
  >
    Create
  </Link>
)

export default CreateButton
