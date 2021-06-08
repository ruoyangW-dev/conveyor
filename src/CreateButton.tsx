import React from 'react'
import { Link } from 'react-router-dom'

/**
 * React Component for Create Button
 * @param onClick
 * @param to
 * @return Rendered React Component
 */
type CreateButtonProps = { onClick: any; to: string }
const CreateButton = ({ onClick, to }: CreateButtonProps) => (
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
