import React from 'react'
import * as R from 'ramda'

export const Breadcrumbs = ({ schema, formStack, customProps }) => {
  const stack = R.prop('stack', formStack)
  const index = R.prop('index', formStack)
  return (
    <nav aria-label="breadcrumbs" className="conv-breadcrumbs">
      <ol className="breadcrumb">
        {stack.map((crumb, idx) => {
          const modelName = R.prop('modelName', crumb)
          const actions = schema.getActions(modelName)
          const modelDisplayName = schema.getModelLabel({
            modelName,
            customProps
          })
          const onBreadcrumbClick = R.path(
            ['create', 'onBreadcrumbClick'],
            actions
          )
          return (
            <li
              className={`breadcrumb-item ${index === idx && 'active'}`}
              key={`create-breadcrumb-${idx}`}
            >
              {index === idx && modelDisplayName}
              {index !== idx && (
                <a
                  href="#"
                  onClick={(evt) => onBreadcrumbClick({ index: idx })}
                >
                  {modelDisplayName}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
