import React from 'react'
import * as R from 'ramda'

type TFootProps = {
  schema: any
  modelName: string
  parentModelName: string
  parentFieldName: string
  fieldOrder: any
  summary: any
  fromIndex: any
  buttonColumnExists: boolean
  customProps: any
}
export const TFoot = ({
  schema,
  modelName,
  parentModelName,
  parentFieldName,
  fieldOrder,
  summary,
  fromIndex,
  buttonColumnExists,
  customProps
}: TFootProps) => {
  const getSummaryPath = (fieldName: string) =>
    fromIndex
      ? [modelName, fieldName]
      : [parentModelName, parentFieldName, fieldName]

  const checkFooterField = (fieldName: string): any => {
    const summaryPath = getSummaryPath(fieldName)
    const schemaPath = [modelName, 'fields', fieldName, 'showFooter']
    return R.path(summaryPath, summary) && R.path(schemaPath, schema.schemaJSON)
  }

  const showFooter = R.any(checkFooterField, fieldOrder)

  if (!showFooter) {
    return null
  }

  return (
    <tfoot>
      <tr>
        <ThFootList
          {...{
            schema,
            modelName,
            parentModelName,
            parentFieldName,
            fieldOrder,
            summary,
            fromIndex,
            customProps,
            getSummaryPath,
            checkFooterField,
            buttonColumnExists
          }}
        />
      </tr>
    </tfoot>
  )
}

type ThFootListProps = {
  schema: any
  modelName: string
  fieldOrder: any
  summary: any
  fromIndex: any
  customProps: any
  getSummaryPath: any
  checkFooterField: any
  buttonColumnExists: boolean
}
const ThFootList = ({
  schema,
  modelName,
  fieldOrder,
  summary,
  fromIndex,
  customProps,
  getSummaryPath,
  checkFooterField,
  buttonColumnExists
}: ThFootListProps) => {
  if (buttonColumnExists) {
    fieldOrder.push(null)
  }
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

    if (!checkFooterField(fieldName)) {
      return <th key={`${idx}-${modelName}-${fieldName}`} />
    }
    const summaryPath = getSummaryPath(fieldName)
    let total = R.path(summaryPath, summary) as any

    if (schema.getType(modelName, fieldName) === 'currency')
      total = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(total)

    return (
      <th
        key={`${idx}-${modelName}-${fieldName}`}
        className="conv-formatted-th"
      >
        <div className="footer">
          <div className="sum">{total}</div>
        </div>
      </th>
    )
  })
}
