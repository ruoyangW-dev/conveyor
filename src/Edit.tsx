import React from 'react'
import * as R from 'ramda'
import Input from './form/Input'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Modal } from './Modal'

export const InlineEditButton = ({ onEditClick }: { onEditClick: any }) => (
  <FaEdit className="edit-icon" onClick={onEditClick} />
)

export const FileDeleteIcon = ({ modalId }: { modalId: string }) => (
  <MdDelete
    className="trash-icon"
    data-toggle="modal"
    data-target={'#' + modalId}
  />
)

export const FileDelete = ({
  id,
  fieldName,
  onFileDelete
}: {
  id: string
  fieldName: string
  onFileDelete: any
}) => {
  // do not begin modalId with number
  const modalId = `${fieldName}-${id}-file-delete-modal`
  return (
    <React.Fragment>
      <FileDeleteIcon {...{ modalId }} />
      <Modal
        {...{
          id: modalId,
          title: 'Are you sure you want to delete this file?',
          className: 'conv-delete-file-modal'
        }}
      >
        <div className="conv-file-delete">
          <div className="conv-btn-group">
            <button className="conv-btn-outline-secondary" data-dismiss="modal">
              Cancel
            </button>
            <button
              className="conv-btn-outline-danger"
              data-dismiss="modal"
              onClick={onFileDelete}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export const getFieldEditData = (
  editData: any,
  modelName: string,
  fieldName: string,
  id: string
) => R.path([modelName, id, fieldName, 'currentValue'], editData)

export const getFieldErrorEdit = (
  editData: any,
  modelName: string,
  fieldName: string,
  id: string
) => R.path([modelName, id, fieldName, 'errors'], editData)

export const isEditing = (editData: any, modelName: string, id: string) =>
  R.pathOr(false, [modelName, id], editData)

export const isFieldEditing = (
  editData: any,
  modelName: string,
  id: string,
  fieldName: string
) => {
  const idEditData = R.pathOr({}, [modelName, id], editData)
  return fieldName in idEditData
}

const EditButton = ({ onClick }: { onClick: any }) => {
  return (
    <button className="conv-edit-button" onClick={onClick}>
      Edit
    </button>
  )
}

type RowEditButtonProps = {
  schema: any
  modelName: string
  id: string
  node: any
}
export const RowEditButton = ({
  schema,
  modelName,
  id,
  node
}: RowEditButtonProps) => {
  const actions = schema.getActions(modelName)
  const onEditClick = R.path(['edit', 'onTableRowEdit'], actions) as any
  return (
    <EditButton {...{ onClick: () => onEditClick({ modelName, id, node }) }} />
  )
}

type TableEditButtonProps = {
  schema: any
  modelName: string
  id: string
  fieldName: string
  node: any
}
export const TableEditButton = ({
  schema,
  modelName,
  id,
  fieldName,
  node
}: TableEditButtonProps) => {
  const actions = schema.getActions(modelName)
  const onEditClick = R.path(['edit', 'onAttributeEdit'], actions) as any

  return (
    <EditButton
      {...{
        onClick: () =>
          onEditClick({
            modelName,
            id,
            fieldName,
            value: R.prop(fieldName, node)
          })
      }}
    />
  )
}

export const EditSaveButton = ({ onClick }: { onClick: any }) => {
  return (
    <button className="conv-edit-save-button" onClick={onClick}>
      Save
    </button>
  )
}

export const EditCancelButton = ({ onClick }: { onClick: any }) => {
  return (
    <button className="conv-edit-cancel-button" onClick={onClick}>
      Cancel
    </button>
  )
}

type EditInputProps = {
  schema: any
  modelName: string
  fieldName: string
  node: any
  editData: any
  error: any
  selectOptions: any
  customProps?: any
}
export const EditInput = ({
  schema,
  modelName,
  fieldName,
  node,
  editData,
  error,
  selectOptions,
  customProps = undefined
}: EditInputProps) => {
  const actions = schema.getActions(modelName)
  const onEditInputChange = R.path(
    ['edit', 'onEditInputChange'],
    actions
  ) as any
  return (
    <Input
      key={fieldName}
      {...{
        selectOptions,
        schema,
        onChange: ({ ...props }) =>
          onEditInputChange({ id: node.id, modelName, ...props }),
        fieldName,
        modelName,
        value: editData,
        error,
        inline: true,
        customProps,
        customLabel: undefined // TODO: Optional param in ./form/input
      }}
    />
  )
}
