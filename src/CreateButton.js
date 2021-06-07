import React from 'react'
import { Link } from 'react-router-dom'

/**
 * React Component for Create Button
 * @param onClick
 * @param to
 * @return Rendered React Component
 */
const CreateButton = ({ onClick, to }) => (
  <Link
    to={`/Create/${to}`}
    onClick={onClick}
    className="conv-create-button"
    role="button"
    replace
  >
    Create
  </Link>
)

export default CreateButton
