import React from 'react'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import Input, { relationshipLabelFactory } from './Input'
import { Breadcrumbs } from './Breadcrumbs'
import { isAutoFocusInput } from '../input/index'
import { skipOverride, useOverride } from '../Utils'

const getFieldErrorCreate = ({
  formStack,
  stackIndex,
  fieldName
}: {
  formStack: any
  stackIndex: any
  fieldName: string
}) => R.path(['stack', stackIndex, 'errors', fieldName], formStack)

export const makeCreateLabel = ({
  schema,
  modelName,
  fieldName,
  customProps
}: {
  schema: any
  modelName: string
  fieldName: string
  customProps: any
}) => {
  const type = R.prop('type', schema.getField(modelName, fieldName))
  if (R.type(type) !== 'Object') {
    return null
  }
  const actions = schema.getActions(modelName)
  const onStackCreate = R.path(['create', 'onStackCreate'], actions) as any
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

const getDisabledValue = ({
  schema,
  modelName,
  fieldName,
  form
}: {
  schema: any
  modelName: string
  fieldName: string
  form: any
}) => {
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
export const DefaultCreateTitle = ({
  schema,
  modelName,
  customProps
}: {
  schema: any
  modelName: string
  customProps: any
}) => {
  return <h1>Create {schema.getModelLabel({ modelName, customProps })}</h1>
}

const FieldInputList = ({
  schema,
  modelName,
  formStack,
  stackIndex,
  form,
  selectOptions,
  customProps,
  onKeyDown,
  onChange,
  fieldOrder
}: {
  schema: any
  modelName: string
  formStack: any
  stackIndex: any
  form: any
  selectOptions: any
  customProps: any
  onKeyDown: any
  onChange: any
  fieldOrder: any
}) => {
  let autoFocusAdded = false

  return fieldOrder.map((fieldName: string) => {
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
 * @param formStack information about calling page and also information about errors
 * @param selectOptions options used by the select input type
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
type DefaultCreateProps = {
  schema: any
  modelName: string
  formStack: any
  selectOptions: any
  customProps: any
}
export const DefaultCreatePage = ({
  schema,
  modelName,
  formStack,
  selectOptions,
  customProps
}: DefaultCreateProps) => {
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
  const onCancel = R.path(['create', 'onCancel'], actions) as any
  const onSave = R.path(['create', 'onSave'], actions) as any
  const disableButtons = stackIndex !== stack.length - 1

  const onKeyDown = (evt: any) => {
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
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
export const DefaultCreate = ({
  schema,
  modelName,
  formStack,
  selectOptions,
  customProps
}: DefaultCreateProps) => {
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
 * @param customProps user defined props and customization
 * @return Rendered React Component
 */
const Create = ({
  schema,
  modelName,
  formStack,
  selectOptions,
  customProps
}: DefaultCreateProps) => {
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
        customProps
      }}
    />
  )
}

export default Create
