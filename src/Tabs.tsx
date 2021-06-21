import React from 'react'
import * as R from 'ramda'
import { Route, Switch, NavLink, Redirect } from 'react-router-dom'
import { DetailFields, partitionDetailFields } from './Detail'

type TabFieldsProps = {
  match: any
  tabs: any
  fields: any
  component: any
  schema: any
  modelName: string
  id: any
  node: any
  path: any
  editData: any
  tooltipData: any
  modalData: any
  selectOptions: any
  tableView: any
  customProps: any
}
const TabFields = ({
  match,
  tabs,
  fields,
  component: Component,
  schema,
  modelName,
  id,
  node,
  path,
  editData,
  tooltipData,
  modalData,
  selectOptions,
  tableView,
  customProps
}: TabFieldsProps) => {
  if (Component) {
    return (
      <Component
        {...{
          match,
          tabs,
          fields,
          schema,
          editData,
          modelName,
          tooltipData,
          id,
          node,
          path,
          modalData,
          selectOptions,
          tableView,
          customProps
        }}
      />
    )
  }

  const [tableFields, descriptionList] = partitionDetailFields({
    schema,
    modelName,
    node,
    include: fields,
    customProps
  })

  return (
    <div className="mt-3 conv-tab-fields">
      <DetailFields
        {...{
          schema,
          modelName,
          id,
          node,
          modalData,
          path,
          tableFields,
          tooltipData,
          editData,
          descriptionList,
          selectOptions,
          tableView,
          customProps,
          summary: undefined,
          failedValidation: undefined
        }}
      />
    </div>
  )
}

type RecursiveTabProps = {
  match: any
  tabs: any
  fields: any
  component: any
  schema: any
  modelName: any
  id: any
  node: any
  modalData: any
  editData: any
  tooltipData: any
  path: any
  selectOptions: any
  tableView: any
  customProps: any
}

export const RecursiveTab = ({
  match,
  tabs,
  fields,
  component,
  schema,
  modelName,
  id,
  node,
  modalData,
  editData,
  tooltipData,
  path,
  selectOptions,
  tableView,
  customProps
}: RecursiveTabProps) => {
  if (tabs.length === 1) {
    return (
      <RecursiveTab
        {...{
          match,
          tabs: R.pathOr([], [0, 'tabs'], tabs),
          fields: R.pathOr([], [0, 'fields'], tabs),
          component: R.pathOr(null, [0, 'component'], tabs),
          schema,
          modelName,
          id,
          node,
          path,
          editData,
          modalData,
          tooltipData,
          selectOptions,
          tableView,
          customProps
        }}
      />
    )
  }

  return (
    <div>
      <TabFields
        {...{
          match,
          tabs,
          fields,
          component,
          schema,
          modelName,
          editData,
          tooltipData,
          id,
          node,
          path,
          modalData,
          selectOptions,
          tableView,
          customProps
        }}
      />
      <ul className="nav nav-pills">
        {tabs.map((tab: any) => (
          <li key={`${R.prop('pillId', tab)}-link`}>
            <NavLink
              to={`${R.prop('url', match)}/${R.prop('pillId', tab)}`}
              className="nav-link"
            >
              {R.prop('name', tab)}
            </NavLink>
          </li>
        ))}
      </ul>
      <Switch>
        {tabs.map((tab: any) => {
          const matchAppend = {
            isExact: R.prop('isExact', match),
            params: R.assoc(
              'pillId',
              R.prop('pillId', tab),
              R.prop('params', match)
            ),
            path: R.prop('path', match) + '/:pillId',
            url: R.prop('url', match) + `/${R.prop('pillId', tab)}`
          }

          return (
            <Route
              key={`${R.prop('pillId', tab)}-route`}
              path={`${R.prop('url', match)}/${R.prop('pillId', tab)}`}
              render={(renderProps) => (
                <RecursiveTab
                  {...{
                    match: matchAppend,
                    tabs: R.propOr([], 'tabs', tab),
                    fields: R.propOr([], 'fields', tab),
                    component: R.propOr(null, 'component', tab),
                    schema,
                    modelName,
                    id,
                    node,
                    modalData,
                    editData,
                    tooltipData,
                    path,
                    selectOptions,
                    tableView,
                    customProps,
                    ...R.dissoc('match', renderProps)
                  }}
                />
              )}
            />
          )
        })}
        {R.pathOr(false, [0, 'pillId'], tabs) ? (
          <Route
            exact
            path={`${R.prop('url', match)}`}
            render={() => (
              <Redirect
                to={`${R.prop('url', match)}/${R.path([0, 'pillId'], tabs)}`}
              />
            )}
          />
        ) : (
          ''
        )}
      </Switch>
    </div>
  )
}
