import React from 'react'
import * as R from 'ramda'
import { Modal } from '../Modal'

const exclusionCondition = (key: string) =>
  !R.includes(key, ['__typename', 'id'])

const getHeaders = (schema: any, modelName: string, node: any) =>
  R.keys(R.pickBy((_, key) => exclusionCondition(key))(node))

const getRowFields = (
  schema: any,
  modelName: string,
  node: any,
  nodeOrder?: any[]
) => {
  const fieldDefinitions = schema.getFields(modelName)
  if (!nodeOrder) {
    nodeOrder = Object.keys(node)
  }
  // 'key' is fieldName, id, or __typename
  const fields = nodeOrder.map((key: any) => {
    const value = R.prop(key, node)
    const override = R.path(
      [modelName, 'deleteModal', 'rows', key],
      schema.schemaJSON
    ) as any
    if (override) {
      return override({ schema, modelName, node, fieldName: key })
    }
    if (value === Object(value)) {
      const targetModel = R.path(
        [key, 'type', 'target'],
        fieldDefinitions
      ) as string
      return getRowFields(schema, targetModel, value)
    }

    if (exclusionCondition(key)) {
      if (schema.isEnum(modelName, key)) {
        const label = schema.getEnumLabel(modelName, key, value)
        return label === undefined ? '' : label
      } else {
        return value
      }
    }
  }) as Array<any>

  // Issues with R.pipe
  return R.flatten(
    R.map(R.when(Array.isArray, R.join(' ')))(
      R.reject((val) => val === undefined)(fields)
    )
  )
}

type RowProps = {
  schema: any
  nodeModelName: string
  node: any
  editedHeaderFields: string[]
}
const Row = ({ schema, nodeModelName, node, editedHeaderFields }: RowProps) => {
  const fields = getRowFields(
    schema,
    nodeModelName,
    node,
    editedHeaderFields
  ) as any
  return (
    <tr>
      {fields.map((field: any, index: any) => (
        <td key={index}>{field}</td>
      ))}
    </tr>
  )
}

const HeaderRow = ({ headers }: { headers: string[] }) => {
  return (
    <tr>
      {headers.map((head: any, index: any) => (
        <th key={index}>{head}</th>
      ))}
    </tr>
  )
}

type ReviewTableProps = { schema: any; table: any[]; customProps: any }
const ReviewTable = ({ schema, table, customProps }: ReviewTableProps) => {
  let headers = []
  let editedHeaderFields = undefined as any
  const node = table[0]
  const nodeModelName = R.prop('__typename', node)
  if (!R.isEmpty(table)) {
    // get headers from schema
    const customHeaders = R.path(
      [nodeModelName, 'deleteModal', 'headers'],
      schema.schemaJSON
    )

    if (!customHeaders) {
      // pick fields that 'node' contains & order them by 'fieldOrder'
      const headerFields = getHeaders(schema, nodeModelName, node)
      const fieldOrder = R.propOr(
        [],
        'fieldOrder',
        schema.getModel(nodeModelName)
      ) as string[]

      editedHeaderFields = R.filter(
        R.identity as any,
        fieldOrder.map((field: string) =>
          R.includes(field, headerFields) ? field : undefined
        )
      )
    } else {
      editedHeaderFields = customHeaders
    }

    // turn fieldNames in to labels
    headers = editedHeaderFields.map((fieldName: string) =>
      schema.getFieldLabel({
        modelName: nodeModelName,
        fieldName,
        data: table,
        customProps
      })
    )
  }
  const tableDisplayName = schema.getModelLabel({
    modelName: R.propOr('', '__typename', R.head(table)),
    data: table,
    customProps
  })
  return (
    <div
      className={
        'conv-delete-modal-table conv-delete-modal-table-' + nodeModelName
      }
    >
      <h5>{tableDisplayName}</h5>
      <table>
        <tbody>
          <HeaderRow
            {...{
              headers
            }}
          />
          {table &&
            table.map((node: any, index: number) => (
              <Row
                key={`${index}-${node.id}`}
                {...{
                  schema,
                  nodeModelName: R.prop('__typename', node),
                  node,
                  editedHeaderFields
                }}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * React Component Delete Warning Modal
 * @param schema model schema
 * @param modelName the name of the model
 * @param id id of the object to be deleted
 * @param modalId id of modal div
 * @param title title of Modal, default 'Confirm Delete'
 * @param onDelete function called when a row is deleted
 * @param modalData delete detail modal information
 * @param parentId id of parent, if being shown from Detail page
 * @param parentModelName name of parent model, if being shown from Detail page
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
type DeleteDetailProps = {
  schema: any
  modelName: string
  id: string
  modalId: string
  title?: string
  onDelete: any
  modalData: { Delete: any[] }
  parentModelName?: string
  parentId?: string
  customProps: any
}
export const DeleteDetail = ({
  schema,
  modelName,
  id,
  modalId,
  title = 'Confirm Delete',
  onDelete,
  modalData,
  parentModelName = undefined,
  parentId = undefined,
  customProps
}: DeleteDetailProps) => {
  const modalStore = R.prop('Delete', modalData)
  const actions = schema.getActions(modelName)
  const onCancelDelete = R.path(['delete', 'onCancelDelete'], actions) as any
  return (
    <Modal {...{ id: modalId, title, className: 'conv-delete-modal' }}>
      <span>
        <strong>The following entries will be deleted:</strong>
      </span>
      {!modalStore && <div className={'text-center'}>...loading</div>}
      {modalStore &&
        modalStore.map((table: any, index: any) => (
          <ReviewTable
            key={`${index}-${R.propOr('', '__typename', R.head(table))}`}
            {...{ schema, table, customProps }}
          />
        ))}
      <div className="conv-modal-footer">
        <div className="conv-btn-group">
          <button
            className="conv-btn-outline-secondary "
            data-dismiss="modal"
            onClick={() => onCancelDelete()}
          >
            Cancel
          </button>
          <button
            className="conv-btn-outline-danger "
            data-dismiss="modal"
            onClick={() =>
              onDelete({
                id: id,
                parentModel: parentModelName,
                parentId,
                modelName
              })
            }
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}

type RemoveDetailProps = {
  schema: any
  id: string
  modalId: string
  title: string
  onRemove: any
  modelName: string
  parentModelName: string
  parentFieldName: string
  parentId: string
  node: any
  customProps: any
}
export const RemoveDetail = ({
  schema,
  id,
  modalId,
  title = 'Confirm Removal',
  onRemove,
  modelName,
  parentModelName,
  parentFieldName,
  parentId,
  node,
  customProps
}: RemoveDetailProps) => {
  const name = schema.getDisplayValue({ modelName, node, customProps })
  const parentField = schema.getFieldLabel({
    modelName: parentModelName,
    fieldName: parentFieldName,
    node,
    customProps
  })
  return (
    <Modal {...{ id: modalId, title, className: 'conv-delete-modal' }}>
      <span>
        <strong>{`Do you want to remove ${name} from ${parentField}?`}</strong>
        {` Note: ${name} will not be deleted, but the relationship will be cut.`}
      </span>
      <div className="conv-modal-footer">
        <div className="conv-btn-group">
          <button className="conv-btn-outline-secondary " data-dismiss="modal">
            Cancel
          </button>
          <button
            className="conv-btn-outline-danger "
            data-dismiss="modal"
            onClick={() =>
              onRemove({
                modelName: parentModelName,
                fieldName: parentFieldName,
                id: parentId,
                removedId: id
              })
            }
          >
            Confirm Removal
          </button>
        </div>
      </div>
    </Modal>
  )
}
