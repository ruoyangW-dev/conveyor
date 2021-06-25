import React from 'react'
import { showButtonColumn } from './Table'
import * as R from 'ramda'
import { SortButton } from './Sort'
import { getNextSortKey } from './Sort.js'

type THeadProps = {
  schema: any
  modelName: string
  fieldOrder: any
  editable: boolean
  deletable: boolean
  detailField: any
  data: any
  tableView: any
  fromIndex: any
  customProps: any
}
export const THead = ({
  schema,
  modelName,
  fieldOrder,
  editable,
  deletable,
  detailField,
  data,
  tableView,
  fromIndex,
  customProps
}: THeadProps) => {
  // first check if sortable on model level
  const tableSortable =
    fromIndex && schema.isTableSortable({ modelName, customProps })
  const actions = schema.getActions(modelName)
  const onSort = R.path(['tableOptions', 'sort'], actions)
  return (
    <thead>
      <tr>
        <THList
          {...{
            schema,
            modelName,
            fieldOrder,
            editable,
            deletable,
            detailField,
            data,
            tableView,
            fromIndex,
            customProps,
            tableSortable,
            onSort
          }}
        />
        {showButtonColumn({ deletable, editable, detailField }) && (
          <th className="table_btn_col" />
        )}
      </tr>
    </thead>
  )
}

type THListProps = {
  schema: any
  modelName: string
  fieldOrder: any
  data: any
  tableView: any
  fromIndex: any
  customProps: any
  tableSortable: any
  onSort: any
}
const THList = ({
  schema,
  modelName,
  fieldOrder,
  data,
  tableView,
  fromIndex,
  customProps,
  tableSortable,
  onSort
}: THListProps) => {
  return fieldOrder.map((fieldName: string, idx: number) => {
    if (fromIndex === true) {
      if (
        schema.shouldDisplayIndex({
          modelName,
          fieldName,
          customProps
        }) === false
      ) {
        return null
      }
    }

    const sortKeyObj = R.path([modelName, 'sort'], tableView) as any
    // now check if field level is sortable as well
    const showSort = tableSortable
      ? schema.isSortable({ modelName, fieldName, customProps })
      : false
    const sortKey =
      R.prop('fieldName', sortKeyObj) === fieldName
        ? R.prop('sortKey', sortKeyObj)
        : undefined
    return (
      <th
        key={`${idx}-${modelName}-${fieldName}`}
        className="conv-formatted-th"
        onClick={() =>
          showSort
            ? onSort({
                modelName,
                fieldName,
                sortKey: getNextSortKey(sortKey)
              })
            : {}
        }
      >
        <Header
          {...{
            modelName,
            fieldName,
            title: schema.getFieldLabel({
              modelName,
              fieldName,
              data,
              customProps
            }), // this is the actual 'data' list, not 'node'
            onSort,
            showSort,
            sortKeyObj
          }}
        />
      </th>
    )
  })
}

type HeaderProps = {
  modelName: string
  fieldName: string
  title: string
  onSort: any
  showSort: boolean
  sortKeyObj: any
}
export const Header = ({
  modelName,
  fieldName,
  title,
  onSort,
  showSort,
  sortKeyObj
}: HeaderProps) => {
  return (
    <div className="header">
      <div className="title">
        <span className="header-title">{title}</span>
      </div>
      <div className={'header-overflow'}>
        {showSort && (
          <SortButton {...{ modelName, fieldName, onSort, sortKeyObj }} />
        )}
      </div>
    </div>
  )
}
