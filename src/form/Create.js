import React from 'react'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import Input, { relationshipLabelFactory } from './Input'
import { Breadcrumbs } from './Breadcrumbs'
import { isAutoFocusInput } from '../input/index'
import { skipOverride, useOverride } from '../Utils'

const getFieldErrorCreate = ({ formStack, stackIndex, fieldName }) =>
  R.path(['stack', stackIndex, 'errors', fieldName], formStack)

export const makeCreateLabel = ({
  schema,
  modelName,
  fieldName,
  customProps
}) => {
  const type = R.prop('type', schema.getField(modelName, fieldName))
  if (R.type(type) !== 'Object') {
    return null
  }
  const actions = schema.getActions(modelName)
  const onStackCreate = R.path(['create', 'onStackCreate'], actions)
  const targetModel = R.path(
    ['type', 'target'],
    schema.getField(modelName, fieldName)
  )

  const onClick = () => onStackCreate({ modelName: targetModel })

  const CreateLabel = relationshipLabelFactory({
    schema,
    modelName,
    fieldName,
    onClick,
    customProps
  })
  return CreateLabel
}

const getDisabledValue = ({ schema, modelName, fieldName, form }) => {
  const type = schema.getType(modelName, fieldName)

  if (type.includes('ToMany')) {
    return R.path(['fields', fieldName, 0, 'label'], form)
  } else {
    return R.path(['fields', fieldName, 'label'], form)
  }
}

/**
 * Overridable React Component for the Create Page Title
 * @param schema model schema
 * @param modelName the name of the model
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultCreateTitle = ({ schema, modelName, customProps }) => {
  return <h1>Create {schema.getModelLabel({ modelName, customProps })}</h1>
}

const FieldInputList = ({
  schema,
  modelName,
  formStack,
  stackIndex,
  form,
  selectOptions,
  failedValidation,
  customProps,
  onKeyDown,
  onChange,
  fieldOrder
}) => {
  let autoFocusAdded = false

  return fieldOrder.map((fieldName) => {
    if (
      schema.shouldDisplayCreate({ modelName, fieldName, customProps }) ===
      false
    ) {
      return null
    }

    const disabled = schema.isFieldDisabled({
      modelName,
      fieldName,
      formStack,
      customProps
    })
    const value = disabled
      ? getDisabledValue({ schema, modelName, fieldName, form })
      : R.path(['fields', fieldName], form)
    const error = getFieldErrorCreate({
      formStack,
      stackIndex,
      fieldName
    })
    let autoFocus = false
    if (
      !autoFocusAdded &&
      isAutoFocusInput(schema.getType(modelName, fieldName))
    ) {
      autoFocus = true
      autoFocusAdded = true
    }
    return (
      <div className="conv-create-field" key={`defaultCreatePage-${fieldName}`}>
        <Input
          {...{
            schema,
            modelName,
            fieldName,
            value,
            error,
            selectOptions,
            failedValidation,
            onChange,
            disabled,
            formStack,
            customLabel: makeCreateLabel({
              schema,
              modelName,
              fieldName,
              customProps
            }),
            autoFocus,
            onKeyDown,
            customProps,
            showPopover: true
          }}
        />
      </div>
    )
  })
}

/**
 * Overridable React Component for the Create Page Content
 * @param schema model schema
 * @param modelName the name of the model
 * @param formStack information about calling page
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultCreatePage = ({
  schema,
  modelName,
  formStack,
  selectOptions,
  failedValidation,
  customProps
}) => {
  const stackIndex = R.prop('index', formStack)
  const originFieldName = R.prop('originFieldName', formStack)
  const stack = R.prop('stack', formStack)
  const form = R.prop(stackIndex, stack)

  const origin = R.prop('originModelName', formStack)
  const fieldOrder = schema.getCreateFields({ modelName, customProps })
  if (origin && stackIndex === 0) {
    const index = fieldOrder.indexOf(originFieldName)
    if (index !== -1) {
      fieldOrder.splice(index, 1)
    }
    fieldOrder.splice(0, 0, originFieldName)
  }

  const actions = schema.getActions(modelName)
  const onChange = R.path(['create', 'onInputChange'], actions)
  const onCancel = R.path(['create', 'onCancel'], actions)
  const onSave = R.path(['create', 'onSave'], actions)
  const disableButtons = stackIndex !== stack.length - 1

  const onKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      return onSave({ modelName })
    }
  }

  return (
    <div className={'conv-create-page conv-create-page-' + modelName}>
      <div>* Indicates a Required Field</div>
      <br />
      <div>
        <FieldInputList
          {...{
            schema,
            modelName,
            formStack,
            stackIndex,
            form,
            selectOptions,
            failedValidation,
            customProps,
            onKeyDown,
            onChange,
            fieldOrder
          }}
        />
      </div>
      {disableButtons && (
        <p className="conv-text-danger">
          Cannot save or cancel until all subsequent creates are resolved.
        </p>
      )}
      <div className="conv-create-btn-group">
        <button
          className="conv-btn-success"
          role="button"
          onClick={() => onSave({ modelName })}
          disabled={disableButtons}
        >
          Submit
        </button>
        <button
          className="conv-btn"
          role="button"
          onClick={() => onCancel()}
          disabled={disableButtons}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

/**
 * Overridable React Component for the Whole Create Page
 * @param schema model schema
 * @param modelName the name of the model
 * @param formStack information about calling page
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultCreate = ({
  schema,
  modelName,
  formStack,
  selectOptions,
  failedValidation,
  customProps
}) => {
  const CreateTitleOverride = schema.getCreateTitleOverride(modelName)
  const CreatePageOverride = schema.getCreatePageOverride(modelName)

  const CreateTitle = useOverride(CreateTitleOverride, DefaultCreateTitle)
  const CreatePage = useOverride(CreatePageOverride, DefaultCreatePage)

  if (skipOverride(CreateTitleOverride) && skipOverride(CreatePageOverride)) {
    return null
  }

  return (
    <div className={'conv-create conv-create-' + modelName}>
      <Breadcrumbs
        schema={schema}
        formStack={formStack}
        customProps={customProps}
      />
      <CreateTitle
        {...{
          schema,
          modelName,
          customProps
        }}
      />
      <CreatePage
        {...{
          schema,
          modelName,
          formStack,
          selectOptions,
          failedValidation,
          customProps
        }}
      />
    </div>
  )
}

/**
 * Top Level React Component for the Create Page
 * @param schema model schema
 * @param modelName the name of the model
 * @param formStack information about calling page
 * @param selectOptions options used by the select input type
 * @param failedValidation a function that determines if a field has failed validation
 * > run with `failedValidation(modelName, fieldName)`
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
const Create = ({
  schema,
  modelName,
  formStack,
  selectOptions,
  failedValidation,
  customProps
}) => {
  const CreateOverride = schema.getCreateOverride(modelName)

  const CreateComponent = useOverride(CreateOverride, DefaultCreate)

  if (R.prop('index', formStack) === -1) {
    return <Redirect to={R.propOr('/', 'originPath', formStack)} />
  }

  return (
    <CreateComponent
      {...{
        schema,
        modelName,
        formStack,
        selectOptions,
        failedValidation,
        customProps
      }}
    />
  )
}

export default Create
