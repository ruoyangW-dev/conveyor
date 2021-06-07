import React from 'react'
import { Link } from 'react-router-dom'

/**
 * React Component for Link to Detail
 * @param modelName the name of the model
 * @param id id of object associated with the row
 * @param children
 * @return Rendered React Component
 */
const DetailLink: React.FunctionComponent<{ modelName: string, id: string, children: React.ReactNode }> = ({ modelName, id, children }) => (
  <Link to={`/${modelName}/${id}`}>{children}</Link>
)

export default DetailLink
