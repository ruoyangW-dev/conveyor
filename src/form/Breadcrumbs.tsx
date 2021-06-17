import React from 'react'
import * as R from 'ramda'

/**
 * React component for page breadcrumbs
 * @param schema model schema
 * @param formStack information about calling page and errors
 * @param customProps user defined props and customization
 */
export const Breadcrumbs = ({
  schema,
  formStack,
  customProps
}: {
  schema: any
  formStack: any
  customProps: any
}) => {
  const stack = R.prop('stack', formStack)
  const index = R.prop('index', formStack)
  return (
    <nav aria-label="breadcrumbs" className="conv-breadcrumbs">
      <ol>
        {stack.map((crumb: any, idx: string) => {
          const modelName = R.prop('modelName', crumb)
          const actions = schema.getActions(modelName)
          const modelDisplayName = schema.getModelLabel({
            modelName,
            customProps
          })
          const onBreadcrumbClick = R.path(
            ['create', 'onBreadcrumbClick'],
            actions
          ) as any
          return (
            <li
              className={`conv-breadcrumb-item ${index === idx && 'active'}`}
              key={`create-breadcrumb-${idx}`}
            >
              {index === idx && modelDisplayName}
              {index !== idx && (
                <a href="#" onClick={() => onBreadcrumbClick({ index: idx })}>
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
