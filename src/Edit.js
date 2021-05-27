import React from 'react'
import * as R from 'ramda'
import Input from './form/Input'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Modal } from './Modal'

export const InlineEditButton = ({ onEditClick }) => (
  <FaEdit className="edit-icon" onClick={onEditClick} />
)

export const FileDeleteIcon = ({ modalId }) => (
  <MdDelete
    className="trash-icon"
    data-toggle="modal"
    data-target={'#' + modalId}
  />
)

export const FileDelete = ({ id, fieldName, onFileDelete }) => {
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

export const getFieldEditData = (editData, modelName, fieldName, id) =>
  R.path([modelName, id, fieldName, 'currentValue'], editData)

export const getFieldErrorEdit = (editData, modelName, fieldName, id) =>
  R.path([modelName, id, fieldName, 'errors'], editData)

export const isEditing = (editData, modelName, id) =>
  R.pathOr(false, [modelName, id], editData)

export const isFieldEditing = (editData, modelName, id, fieldName) => {
  const idEditData = R.pathOr({}, [modelName, id], editData)
  return fieldName in idEditData
}

const EditButton = ({ onClick }) => {
  return (
    <button className="conv-edit-button" onClick={onClick}>
      Edit
    </button>
  )
}

export const RowEditButton = ({ schema, modelName, id, node }) => {
  const actions = schema.getActions(modelName)
  const onEditClick = R.path(['edit', 'onTableRowEdit'], actions)
  return (
    <EditButton {...{ onClick: () => onEditClick({ modelName, id, node }) }} />
  )
}

export const TableEditButton = ({ schema, modelName, id, fieldName, node }) => {
  const actions = schema.getActions(modelName)
  const onEditClick = R.path(['edit', 'onAttributeEdit'], actions)

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

export const EditSaveButton = ({ onClick }) => {
  return (
    <button className="conv-edit-save-button" onClick={onClick}>
      Save
    </button>
  )
}

export const EditCancelButton = ({ onClick }) => {
  return (
    <button className="conv-edit-cancel-button" onClick={onClick}>
      Cancel
    </button>
  )
}

export const EditInput = ({
  schema,
  modelName,
  fieldName,
  node,
  editData,
  error,
  selectOptions,
  failedValidation,
  customProps
}) => {
  const actions = schema.getActions(modelName)
  const onEditInputChange = R.path(['edit', 'onEditInputChange'], actions)
  return (
    <Input
      key={fieldName}
      {...{
        selectOptions,
        failedValidation,
        schema,
        onChange: ({ ...props }) =>
          onEditInputChange({ id: node.id, modelName, ...props }),
        fieldName,
        modelName,
        node,
        value: editData,
        error,
        inline: true,
        customProps
      }}
    />
  )
}
