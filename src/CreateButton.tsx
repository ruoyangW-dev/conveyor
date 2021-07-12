import React from 'react'
import { Link } from 'react-router-dom'

/**
 * React Component for Create Button
 * @param onClick
 * @param to
 * @return Rendered React Component
 */
type CreateButtonProps = { onClick: any; to: string; fromIndex: boolean }
const CreateButton = ({ onClick, to, fromIndex }: CreateButtonProps) => (
  <Link
    to={`/Create/${to}`}
    onClick={onClick}
    className="conv-create-button"
    role="button"
    replace={!fromIndex}
  >
    Create
  </Link>
)

export default CreateButton
