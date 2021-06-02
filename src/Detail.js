import React from 'react'
import * as R from 'ramda'
import { DeleteButton, Table } from './table/Table'
import Field, { getRelSchemaEntry } from './table/Field'
import { skipOverride, useOverride } from './Utils'
import { RecursiveTab } from './Tabs'
import CreateButton from './CreateButton'
import {
  EditSaveButton,
  EditCancelButton,
  isFieldEditing,
  getFieldEditData,
  InlineEditButton,
  FileDelete,
  TableEditButton,
  getFieldErrorEdit,
  EditInput
} from './Edit'
import { Popover, PopoverContent } from './Popover'
import Input from './form/Input'
import { Link, Redirect } from 'react-router-dom'
import { inputTypes } from './consts'
import { DeleteDetail } from './delete/DeleteDetail'
import { FaAngleDown, FaAngleRight } from 'react-icons/fa'

const LabelInfoPopover = ({ LabelInfoComponent, fieldLabel }) => (
  <Popover
    Content={
      <PopoverContent>
        <LabelInfoComponent />
      </PopoverContent>
    }
    labelValue={fieldLabel}
  />
)

export const CollapseTableButton = ({
  modelName,
  fieldName,
  id,
  collapse,
  collapseTableChange
}) => {
  const CollapseTableIcon = collapse ? FaAngleRight : FaAngleDown
  return (
    <CollapseTableIcon
      className={`hide-icon-${collapse ? 'angle-right' : 'angle-down'}`}
      onClick={() =>
        collapseTableChange({ modelName, fieldName, id, collapse })
      }
    />
  )
}

/**
 * Overridable React Component for the Detail Attribute Label
 * @param schema model schema
 * @param modelName the name of the model
 * @param fieldName the name of the field
 * @param node all information about the object (object data as Magql would return it)
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultDetailLabel = ({
  schema,
  modelName,
  fieldName,
  node,
  customProps
}) => {
  const LabelInfoComponent = R.path(
    ['components', 'labelInfo'],
    schema.getField(modelName, fieldName)
  )
  if (skipOverride(LabelInfoComponent)) {
    return null
  }
  const fieldLabel = schema.getFieldLabel({
    modelName,
    fieldName,
    node,
    customProps
  })
  if (LabelInfoComponent) {
    return <LabelInfoPopover {...{ LabelInfoComponent, fieldLabel }} />
  }
  return <span>{fieldLabel}</span>
}

/**
 * Overridable React Component for the Detail Attribute
 * @param schema model schema
 * @param modelName the name of the model
 * @param fieldName the name of the field
 * @param node all information about the object (object data as Magql would return it)
 * @param editData information on what is being edited, current state and any errors
 * @param tooltipData displayed tooltip data for objects referenced by the table.
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param id id of the object
 * @param path relative path to current page
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultDetailAttribute = ({
  schema,
  modelName,
  fieldName,
  node,
  editData,
  tooltipData,
  selectOptions,
  failedValidation,
  id,
  path,
  customProps
}) => {
  const actions = schema.getActions(modelName)

  const LabelOverride = schema.getDetailLabelOverride(modelName, fieldName)
  const ValueOverride = schema.getDetailValueOverride(modelName, fieldName)

  const DetailLabel = useOverride(LabelOverride, DefaultDetailLabel)
  const DetailValue = useOverride(ValueOverride, Field)

  const editable = schema.isFieldEditable({
    modelName,
    fieldName,
    node,
    customProps
  })
  const fieldType = R.prop('type', schema.getField(modelName, fieldName))

  if (skipOverride(LabelOverride) && skipOverride(ValueOverride)) {
    return null
  }

  if (isFieldEditing(editData, modelName, node.id, fieldName) !== false) {
    const relSchemaEntry = getRelSchemaEntry({ schema, modelName, fieldName })
    const relModelName = R.prop('modelName', relSchemaEntry)

    const onEditCancelClick = R.path(['edit', 'onAttributeEditCancel'], actions)
    const onEditSubmitClick = R.path(
      ['edit', 'onDetailAttributeSubmit'],
      actions
    )
    const onFileSubmit = R.path(['edit', 'onFileSubmit'], actions)

    const fieldEditData = getFieldEditData(
      editData,
      modelName,
      fieldName,
      node.id
    )
    const creatable = schema.isCreatable({
      modelName: relModelName,
      parentNode: node,
      customProps
    })
    const targetInverseFieldName = R.prop('backref', fieldType)
    const targetModelName = R.prop('target', fieldType)
    const error = getFieldErrorEdit(editData, modelName, fieldName, node.id)

    return (
      <React.Fragment>
        <dt className="conv-detail-label-wrapper">
          <DetailLabel
            {...{ schema, modelName, fieldName, node, customProps }}
          />
        </dt>
        <dd className="conv-detail-value-wrapper">
          <div className="detail-edit">
            <EditInput
              {...{
                schema,
                modelName,
                fieldName,
                node,
                editData: fieldEditData,
                error,
                selectOptions,
                failedValidation
              }}
            />
          </div>
          <div className="inline-btn-group">
            <EditSaveButton
              {...{
                onClick:
                  fieldType === 'file'
                    ? () => onFileSubmit({ modelName, fieldName, id })
                    : () => onEditSubmitClick({ modelName, fieldName, id })
              }}
            />
            <EditCancelButton
              {...{
                onClick: () => onEditCancelClick({ modelName, id, fieldName }),
                modelName,
                id
              }}
            />
            {R.type(fieldType) === 'Object' && creatable && (
              <DetailCreateButton
                {...{
                  schema,
                  modelName,
                  fieldName,
                  node,
                  editData: fieldEditData,
                  error,
                  selectOptions
                }}
              />
            )}
          </div>
          <div className="inline-btn-group">
            <EditSaveButton
              {...{
                onClick:
                  fieldType === 'file'
                    ? () => onFileSubmit({ modelName, fieldName, id })
                    : () => onEditSubmitClick({ modelName, fieldName, id })
              }}
            />
            <EditCancelButton
              {...{
                onClick: () => onEditCancelClick({ modelName, id, fieldName }),
                modelName,
                id
              }}
            />
            {R.type(fieldType) === 'Object' && creatable && (
              <DetailCreateButton
                {...{
                  schema,
                  targetInverseFieldName,
                  targetModelName,
                  path,
                  node
                }}
              />
            )}
          </div>
        </dd>
      </React.Fragment>
    )
  } else {
    const onEdit = R.path(['edit', 'onAttributeEdit'], actions)
    const onFileDelete = R.path(['delete', 'onFileDelete'], actions)
    const isFileType = fieldType === inputTypes.FILE_TYPE
    const hasValue = R.propOr(false, fieldName, node)

    return (
      <React.Fragment>
        <dt className="conv-detail-label-wrapper">
          <DetailLabel
            {...{ schema, modelName, fieldName, node, customProps }}
          />
        </dt>
        <dd className="conv-detail-value-wrapper">
          <DetailValue
            {...{
              schema,
              modelName,
              fieldName,
              node,
              id,
              tooltipData,
              customProps
            }}
          />
          {editable && (
            <InlineEditButton
              {...{
                onEditClick: () =>
                  onEdit({
                    modelName,
                    fieldName,
                    id,
                    value: R.prop(fieldName, node)
                  })
              }}
            />
          )}
          {editable && isFileType && hasValue && (
            <FileDelete
              {...{
                id,
                fieldName,
                node,
                id,
                tooltipData,
                customProps
              }}
            />
          )}
          {editable && (
            <InlineEditButton
              {...{
                onEditClick: () =>
                  onEdit({
                    modelName,
                    fieldName,
                    id,
                    value: R.prop(fieldName, node)
                  })
              }}
            />
          )}
          {editable && isFileType && hasValue && (
            <FileDelete
              {...{
                id,
                fieldName,
                onFileDelete: () => onFileDelete({ modelName, fieldName, id })
              }}
            />
          )}
        </dd>
      </React.Fragment>
    )
  }
}

export const DetailCreateButton = ({
  schema,
  targetModelName,
  path,
  targetInverseFieldName,
  node
}) => {
  const onCreateClick = R.path(
    ['create', 'onDetailCreate'],
    schema.getActions(targetModelName)
  )

  const onClick = () =>
    onCreateClick({
      modelName: targetModelName,
      path,
      targetInverseFieldName,
      node
    })
  return <CreateButton {...{ onClick }} />
}

export const DefaultDetailTableTitleWrapper = ({ children }) => {
  return (
    <div className="title-label-container">
      <h4>{children}</h4>
    </div>
  )
}

/**
 * Overridable React Component for the Detail One-to-Many Table Title
 * @param schema model schema
 * @param modelName the name of the model
 * @param fieldName the name of the field
 * @param id id of the object
 * @param targetInverseFieldName the name of the field on the other model that refers to this model
 * @param targetModelName the name of the other model linked to by this table
 * @param path relative path to current page
 * @param node all information about the object (object data as Magql would return it)
 * @param collapsable boolean, can collapse the table
 * @param collapse boolean, whether or not the table is collapsed
 * @param collapseTableChange method called whenever the table is collapsed or opened
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultDetailO2MTableTitle = ({
  schema,
  modelName,
  fieldName,
  id,
  targetInverseFieldName,
  targetModelName,
  path,
  node,
  collapsable,
  collapse,
  collapseTableChange,
  customProps
}) => {
  const creatable = schema.isCreatable({
    modelName: targetModelName,
    parentNode: node,
    customProps
  })

  return (
    <DefaultDetailTableTitleWrapper>
      {collapsable && (
        <CollapseTableButton
          {...{
            modelName,
            fieldName,
            id,
            collapse,
            collapseTableChange
          }}
        />
      )}
      <DefaultDetailLabel
        {...{ schema, modelName, fieldName, node, customProps }}
      />
      {creatable && (
        <DetailCreateButton
          {...{
            schema,
            targetModelName,
            path,
            targetInverseFieldName,
            node
          }}
        />
      )}
    </DefaultDetailTableTitleWrapper>
  )
}

/**
 * Overridable React Component for the Detail Many-to-Many Table Title
 * @param schema model schema
 * @param modelName the name of the model
 * @param id id of the object
 * @param fieldName the name of the field
 * @param node all information about the object (object data as Magql would return it)
 * @param targetInverseFieldName the name of the field on the other model that refers to this model
 * @param path relative path to current page
 * @param targetModelName the name of the other model linked to by this table
 * @param collapsable boolean, can collapse the table
 * @param collapse boolean, whether or not the table is collapsed
 * @param collapseTableChange method called whenever the table is collapsed or opened
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultDetailM2MTableTitle = ({
  schema,
  modelName,
  id,
  fieldName,
  node,
  targetInverseFieldName,
  path,
  targetModelName,
  collapsable,
  collapse,
  collapseTableChange,
  customProps
}) => {
  const editable = schema.isFieldEditable({
    modelName,
    fieldName,
    node,
    customProps
  })

  return (
    <div className="title-label-container">
      <h4>
        {collapsable && (
          <CollapseTableButton
            {...{
              modelName,
              fieldName,
              id,
              collapse,
              collapseTableChange
            }}
          />
        )}
        {schema.getFieldLabel({ modelName, fieldName, node, customProps })}
      </h4>
      {editable && (
        <div className="conv-edit-title-label-container">
          <TableEditButton
            {...{
              schema,
              modelName,
              id,
              fieldName,
              targetInverseFieldName,
              node,
              path,
              targetModelName
            }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Overridable React Component for the Detail Many-to-Many Field Label
 * @param schema model schema
 * @param modelName the name of the model
 * @param fieldName the name of the field
 * @param node all information about the object (object data as Magql would return it)
 * @param targetInverseFieldName the name of the field on the other model that refers to this model
 * @param path relative path to current page
 * @param targetModelName the name of the other model linked to by this table
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultDetailM2MFieldLabel = ({
  schema,
  modelName,
  fieldName,
  node,
  targetInverseFieldName,
  path,
  targetModelName,
  customProps
}) => {
  const creatable = schema.isCreatable({
    modelName: targetModelName,
    parentNode: node,
    customProps
  })
  const required = R.prop('required', schema.getField(modelName, fieldName))
  const Label = () => (
    <div className="title-label-container">
      <h4>
        {schema.getFieldLabel({ modelName, fieldName, node, customProps })}
      </h4>
      {required && ' *'}
      {creatable && (
        <DetailCreateButton
          {...{
            schema,
            targetModelName,
            path,
            targetInverseFieldName,
            node
          }}
        />
      )}
    </div>
  )
  return Label
}

/**
 * Overridable React Component for the Detail Table
 * @param schema model schema
 * @param modelName the name of the model
 * @param id id of the object
 * @param fieldName name of the field
 * @param node all information about the object (object data as Magql would return it)
 * @param path relative path to current page
 * @param editData information on what is being edited, current state and any errors
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param tooltipData displayed tooltip data for objects referenced by the table.
 * @param tableView has sort and pagination information, as well as filtering info
 * @param modalData delete detail modal information
 * @param customProps user defined props and customization
 * @param summary summary information for the footer
 * > ex: sum of table column, optional if no footer
 * @return Rendered React Component
 */
export const DefaultDetailTable = ({
  schema,
  modelName,
  id,
  fieldName,
  node,
  path,
  editData,
  selectOptions,
  failedValidation,
  tooltipData,
  tableView,
  modalData,
  customProps,
  summary
}) => {
  const fieldType = R.path(
    [modelName, 'fields', fieldName, 'type'],
    schema.schemaJSON
  )
  const targetInverseFieldName = R.prop('backref', fieldType)
  const targetModelName = R.prop('target', fieldType)
  const data = R.propOr(null, fieldName, node)
  const fieldOrder = R.path(
    [modelName, 'fields', fieldName, 'type', 'tableFields'],
    schema.schemaJSON
  )
  const actions = schema.getActions(modelName)
  const onDelete = R.path(['delete', 'onDetailDelete'], actions)
  const onEditSubmit = R.path(['edit', 'onDetailTableEditSubmit'], actions)
  const type = schema.getType(modelName, fieldName)
  const collapse = R.path(
    [modelName, 'fields', fieldName, 'collapse'],
    tableView
  )
  const collapseTableChange = R.path(
    ['tableOptions', 'collapseTableChange'],
    actions
  )
  const collapsable = schema.getCollapsable(modelName, fieldName)

  if (!data) {
    return <div className="container">Loading...</div>
  }

  const ValueOverride = schema.getDetailValueOverride(modelName, fieldName)
  const DetailValue = useOverride(ValueOverride, Table)

  if (type.includes('OneToMany')) {
    const LabelOverride = schema.getDetailLabelOverride(modelName, fieldName)
    const DetailLabel = useOverride(LabelOverride, DefaultDetailO2MTableTitle)
    return (
      <div
        key={`Fragment-${id}-${targetModelName}-${fieldName}`}
        className={'conv-detail-table conv-detail-table-' + targetModelName}
      >
        <DetailLabel
          {...{
            schema,
            modelName,
            fieldName,
            id,
            targetInverseFieldName,
            node,
            path,
            targetModelName,
            collapsable,
            collapse,
            collapseTableChange,
            customProps
          }}
        />
        <DetailValue
          key={`Table-${id}-${targetModelName}-${fieldName}`}
          {...{
            schema,
            parentId: id,
            parentModelName: modelName,
            parentFieldName: fieldName,
            modelName: targetModelName,
            editData,
            selectOptions,
            failedValidation,
            tooltipData,
            node,
            data,
            onDelete,
            onEditSubmit: ({ ...props }) =>
              onEditSubmit({
                parentModelName: modelName,
                parentId: id,
                ...props
              }),
            fieldOrder,
            tableView,
            collapse,
            modalData,
            customProps,
            summary
          }}
        />
      </div>
    )
  } else if (type === 'ManyToMany') {
    if (isFieldEditing(editData, modelName, id, fieldName)) {
      const actions = schema.getActions(modelName)
      const onEditInputChange = R.path(['edit', 'onEditInputChange'], actions)
      const onSaveClick = R.path(['edit', 'onDetailAttributeSubmit'], actions)
      const onCancelClick = R.path(['edit', 'onAttributeEditCancel'], actions)

      const LabelOverride = schema.getDetailLabelOverride(modelName, fieldName)
      const DetailLabel =
        LabelOverride ||
        DefaultDetailM2MFieldLabel({
          schema,
          modelName,
          fieldName,
          node,
          targetInverseFieldName,
          path,
          targetModelName,
          customProps
        })

      return (
        <div
          className={'conv-detail-table conv-detail-table-' + targetModelName}
        >
          <Input
            {...{
              schema,
              modelName,
              fieldName,
              node,
              value: getFieldEditData(editData, modelName, fieldName, id),
              error: getFieldErrorEdit(editData, modelName, fieldName, id),
              selectOptions,
              failedValidation,
              customLabel: DetailLabel,
              onChange: ({ ...props }) =>
                onEditInputChange({
                  id,
                  modelName,
                  ...props
                }),
              customProps
            }}
          />
          <div className="table-btn-padding">
            <EditSaveButton
              {...{
                onClick: () =>
                  onSaveClick({
                    modelName,
                    id,
                    fieldName
                  })
              }}
            />
            <EditCancelButton
              {...{
                onClick: () =>
                  onCancelClick({
                    modelName,
                    id,
                    fieldName
                  })
              }}
            />
          </div>
        </div>
      )
    }

    const LabelOverride = schema.getDetailLabelOverride(modelName, fieldName)
    const DetailLabel = useOverride(LabelOverride, DefaultDetailM2MTableTitle)

    if (skipOverride(LabelOverride) && skipOverride(ValueOverride)) {
      return null
    }

    return (
      <div
        key={`Fragment-${id}-${targetModelName}-${fieldName}`}
        className={'conv-detail-table conv-detail-table-' + targetModelName}
      >
        <DetailLabel
          {...{
            schema,
            modelName,
            id,
            fieldName,
            node,
            targetInverseFieldName,
            path,
            targetModelName,
            collapsable,
            collapse,
            collapseTableChange,
            customProps
          }}
        />
        <DetailValue
          key={`Table-${id}-${targetModelName}-${fieldName}`}
          {...{
            schema,
            parentId: id,
            parentModelName: modelName,
            parentFieldName: fieldName,
            modelName: targetModelName,
            editData,
            selectOptions,
            failedValidation,
            tooltipData,
            node,
            data,
            onDelete,
            onEditSubmit: ({ ...props }) =>
              onEditSubmit({
                parentModelName: modelName,
                parentId: id,
                ...props
              }),
            fieldOrder,
            tableView,
            collapse,
            modalData,
            customProps
          }}
        />
      </div>
    )
  }
}

export const partitionDetailFields = ({
  schema,
  modelName,
  node,
  include = null,
  customProps
}) => {
  let detailFields = schema.getDetailFields({ modelName, node, customProps })

  if (include) {
    detailFields = detailFields.filter((fieldName) =>
      R.includes(fieldName, include)
    )
  }
  return R.partition((fieldName) => {
    const detailAttribute = R.prop(
      'detailAttribute',
      schema.getField(modelName, fieldName)
    )
    if (!R.isNil(detailAttribute)) {
      return !detailAttribute
    }
    return (
      schema.isOneToMany(modelName, fieldName) ||
      schema.isManyToMany(modelName, fieldName)
    )
  }, detailFields)
}

/**
 * Overridable React Component for the Detail Page Title
 * @param schema model schema
 * @param modelName the name of the model
 * @param node all information about the object (object data as Magql would return it)
 * @param modalData delete detail modal information
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultDetailPageTitle = ({
  schema,
  modelName,
  node,
  modalData,
  customProps
}) => {
  const model = schema.getModelLabel({ modelName, node, customProps })
  const label = schema.getDisplayValue({ modelName, node, customProps })
  const actions = schema.getActions(modelName)
  const onDelete = R.path(['delete', 'onDetailDeleteFromDetailPage'], actions)
  const onDeleteWarning = R.path(['delete', 'onDeleteWarning'], actions)
  const modalId = 'confirm-delete-' + modelName
  const id = R.prop('id', node)
  const HeaderLink = schema.getHasIndex(modelName) ? (
    <Link to={'/' + modelName}>{model}</Link>
  ) : (
    model
  )
  return (
    <div
      className={
        'conv-default-detail-page-title conv-default-detail-page-title-' +
        modelName
      }
    >
      <h2>
        {HeaderLink}:<b> {label}</b>
      </h2>
      {schema.isDeletable({ modelName, node, customProps }) && (
        <div className="conv-float-right">
          <DeleteButton {...{ modalId, onDeleteWarning, modelName, id }} />
          <DeleteDetail
            {...{
              schema,
              id,
              modalId,
              modelName,
              onDelete,
              modalData,
              customProps
            }}
          />
        </div>
      )}
    </div>
  )
}

const DetailAttributeList = ({
  schema,
  modelName,
  id,
  node,
  modalData,
  descriptionList,
  editData,
  tooltipData,
  selectOptions,
  failedValidation,
  path,
  tableView,
  customProps
}) => {
  return descriptionList.map((fieldName) => {
    if (
      schema.shouldDisplayDetail({
        modelName,
        fieldName,
        node,
        customProps
      }) === false
    ) {
      return null
    }
    const override = schema.getDetailFieldOverride(modelName, fieldName)
    const DetailAttribute = useOverride(override, DefaultDetailAttribute)

    // same props go into DetailTable & DetailAttribute (even if not used) override gets all same props
    return (
      <DetailAttribute
        key={`DetailAttribute-${id}-${modelName}-${fieldName}`}
        {...{
          schema,
          modelName,
          fieldName,
          node,
          selectOptions,
          failedValidation,
          editData,
          tooltipData,
          modalData,
          path,
          id,
          tableView,
          customProps
        }}
      />
    )
  })
}

const DetailTableList = ({
  schema,
  modelName,
  id,
  node,
  modalData,
  tableFields,
  editData,
  tooltipData,
  selectOptions,
  failedValidation,
  path,
  tableView,
  customProps,
  summary
}) => {
  return tableFields.map((fieldName) => {
    if (
      schema.shouldDisplayDetail({
        modelName,
        fieldName,
        node,
        customProps
      }) === false
    ) {
      return null
    }
    const override = schema.getDetailFieldOverride(modelName, fieldName)
    const DetailTable = useOverride(override, DefaultDetailTable)

    // same props go into DetailTable & DetailAttribute (even if not used) override gets all same props
    return (
      <DetailTable
        key={`DetailTable-${id}-${modelName}-${fieldName}`}
        {...{
          schema,
          modelName,
          fieldName,
          node,
          selectOptions,
          failedValidation,
          editData,
          tooltipData,
          modalData,
          path,
          id,
          tableView,
          customProps,
          summary
        }}
      />
    )
  })
}

/**
 * Overridable React Component for the Detail Page Content
 * @param schema model schema
 * @param modelName the name of the model
 * @param id id of the object
 * @param node all information about the object (object data as Magql would return it)
 * @param modalData delete detail modal information
 * @param tableFields list of fields with tables to display
 * @param descriptionList list of non-table attribute fields to display
 * @param editData information on what is being edited, current state and any errors
 * @param tooltipData displayed tooltip data for objects referenced by the table.
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param path relative path to current page
 * @param tableView has sort and pagination information, as well as filtering info
 * @param customProps user defined props and customization
 * @param summary summary information for the footer
 * > ex: sum of table column, optional if no footer
 * @return Rendered React Component
 */
export const DetailFields = ({
  schema,
  modelName,
  id,
  node,
  modalData,
  tableFields,
  descriptionList,
  editData,
  tooltipData,
  selectOptions,
  failedValidation,
  path,
  tableView,
  customProps,
  summary
}) => {
  if (!node) {
    return <div className="container">Loading...</div>
  }

  if (!tableFields && !descriptionList) {
    ;[tableFields, descriptionList] = partitionDetailFields({
      schema,
      modelName,
      node,
      customProps
    })
  }

  return (
    <React.Fragment>
      <dl
        className={'conv-detail-attributes conv-detail-attributes-' + modelName}
      >
        <DetailAttributeList
          {...{
            schema,
            modelName,
            id,
            node,
            modalData,
            tableFields,
            descriptionList,
            editData,
            tooltipData,
            selectOptions,
            failedValidation,
            path,
            tableView,
            customProps,
            summary
          }}
        />
      </dl>
      <DetailTableList
        {...{
          schema,
          modelName,
          id,
          node,
          modalData,
          tableFields,
          descriptionList,
          editData,
          tooltipData,
          selectOptions,
          failedValidation,
          path,
          tableView,
          customProps,
          summary
        }}
      />
    </React.Fragment>
  )
}

const Wrapper = ({ children, modelName }) => (
  <div className={'conv-detail-wrapper conv-detail-wrapper-' + modelName}>
    <div>
      <div>{children}</div>
    </div>
  </div>
)

/**
 * Overridable React Component for the Detail Page
 * @param schema model schema
 * @param modelName the name of the model
 * @param id id of the object
 * @param node all information about the object (object data as Magql would return it)
 * @param modalData delete detail modal information
 * @param editData information on what is being edited, current state and any errors
 * @param path relative path to current page
 * @param match 'match' should be passed in by React by default
 * @param tooltipData displayed tooltip data for objects referenced by the table.
 * @param tableView has sort and pagination information, as well as filtering info
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param customProps user defined props and customization
 * @param summary summary information for the footer
 * > ex: sum of table column, optional if no footer
 * @return Rendered React Component
 */
export const DefaultDetail = ({
  schema,
  modelName,
  id,
  node,
  modalData,
  editData,
  path,
  match,
  tooltipData,
  tableView,
  selectOptions,
  failedValidation,
  customProps,
  summary
}) => {
  const DetailTitleOverride = schema.getDetailTitleOverride(modelName)
  const DetailPageOverride = schema.getDetailPageOverride(modelName)

  const tabs = schema.getModelAttribute(modelName, 'tabs')

  const DefaultDetailPage =
    tabs && tabs.length > 0 ? RecursiveTab : DetailFields

  const DetailTitle = useOverride(DetailTitleOverride, DefaultDetailPageTitle)
  const DetailPage = useOverride(DetailPageOverride, DefaultDetailPage)

  if (R.isEmpty(node)) {
    return (
      <div className="conv-detail-wrapper conv-detail-wrapper-loading">
        Loading...
      </div>
    )
  }

  if (node === null) {
    return <Redirect to={`/${modelName}`} />
  }

  if (skipOverride(DetailTitleOverride) && skipOverride(DetailPageOverride)) {
    return null
  }

  return (
    <Wrapper modelName={modelName}>
      <DetailTitle
        key={`DetailTitle-${id}-${schema}-${modelName}`}
        {...{
          schema,
          modelName,
          id,
          node,
          modalData,
          editData,
          path,
          match,
          tooltipData,
          selectOptions,
          customProps
        }}
      />
      <DetailPage
        key={`DetailPage-${id}-${schema}-${modelName}`}
        {...{
          schema,
          modelName,
          id,
          node,
          modalData,
          editData,
          tooltipData,
          match,
          tabs,
          path,
          fields: [],
          tableView,
          selectOptions,
          failedValidation,
          customProps,
          summary
        }}
      />
    </Wrapper>
  )
}

/**
 * Top Level React Component for the Detail Page
 * @param schema model schema
 * @param modelName the name of the model
 * @param id id of the object
 * @param node all information about the object (object data as Magql would return it)
 * @param modalData delete detail modal information
 * @param editData information on what is being edited, current state and any errors
 * @param path relative path to current page
 * @param match 'match' should be passed in by React by default
 * @param tooltipData displayed tooltip data for objects referenced by the table.
 * @param tableView has sort and pagination information, as well as filtering info
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param customProps user defined props and customization
 * @param summary summary information for the footer
 * > ex: sum of table column, optional if no footer
 * @return Rendered React Component
 */
const Detail = ({
  schema,
  modelName,
  id,
  node,
  modalData,
  editData,
  path,
  match, // 'match' should be passed in by React by default
  tooltipData,
  tableView,
  selectOptions,
  failedValidation,
  customProps,
  summary
}) => {
  const DetailOverride = schema.getDetailOverride(modelName)

  const DetailComponent = useOverride(DetailOverride, DefaultDetail)

  return (
    <DetailComponent
      key={`DetailComponent-${id}-${schema}-${modelName}`}
      {...{
        schema,
        modelName,
        id,
        node,
        modalData,
        editData,
        path,
        match,
        tooltipData,
        tableView,
        selectOptions,
        failedValidation,
        customProps,
        summary
      }}
    />
  )
}

export default Detail
