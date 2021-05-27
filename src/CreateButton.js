import React from 'react'
import { Link } from 'react-router-dom'

const CreateButton = ({ onClick }) => (
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
