import React from 'react'
import * as R from 'ramda'

export const TFoot = ({
  schema,
  modelName,
  parentModelName,
  parentFieldName,
  fieldOrder,
  summary,
  fromIndex,
  buttonColumnExists,
  customProps,
}) => {
  const getSummaryPath = fieldName => fromIndex ? [modelName, fieldName] : [parentModelName, parentFieldName, fieldName]

  const checkFooterField = fieldName => {
      const summaryPath = getSummaryPath(fieldName)
      const schemaPath = [modelName, 'fields', fieldName, 'showFooter']
      return(
        R.path(summaryPath, summary) &&
        R.path(schemaPath, schema.schemaJSON)
      )
    }

  const showFooter = R.any(
    checkFooterField,
    fieldOrder
  )

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

const ThFootList = ({
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
}) => {
  if (buttonColumnExists) {
    fieldOrder.push(null)
  }
  return fieldOrder.map((fieldName, idx) => {
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
    let total = R.path(summaryPath, summary)

    if (schema.getType(modelName, fieldName) === 'currency')
     total = new Intl.NumberFormat('en-US', {
       style: 'currency', currency: 'USD'
     }).format(total)

    return (
     <th key={`${idx}-${modelName}-${fieldName}`} className='conv-formatted-th'>
       <div className="footer">
         <div className="sum">
           {total}
         </div>
       </div>
     </th>
    )
    })
}

