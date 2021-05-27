.. _customization/customizing_fields:

**************************
Customizing Field Inputs
**************************

You can easily override an entire component for a specific field. For example:

 .. code-block:: javascript

    // use custom components instead of the 'input', 'cell' and 'detail' defaults
    const popularityInput = () => <div>Custom Input</div>
    const popularityCell = () => <div>Custom Cell</div>
    const popularityDetail = () => <div style={{ display: 'inline-block' }}>Custom Detail</div>

    schema = { <modelName>: { fields: { <fieldName>: {
        components: {
            input: popularityInput,
            cell: popularityCell,
            detailValue: popularityDetail
        }
    }}}}


InputCore & FlexibleInput
---------------------------

Sometimes, you just want to change the input slightly and avoid rewriting the boilerplate. Do this by importing "InputCore" or "FlexibleInput". "InputCore" is the default component conveyor uses for editing. And "FlexibleInput" is the component wrapped by "InputCore", which had a bit more customization and flexibility.

InputCore
---------------------------

You can use InputCore to render a field conditionally or alter props:

 .. code-block:: javascript

    import { InputCore } from '@autoinvent/conveyor'

    // in the schema, when you override an input:
    schema = { <modelName>: { fields: { <fieldName>: {
        components: {
            input: foo
        }
    }}}}

    // return the default input component, or alter the 'props'
    const foo = (...props) => {
        // render a component conditionally
        if (someSpecialCondition) return null
        // render the default
        return <InputCore {...{...props}} />
    }

Disable a field in the create page. (By default, conveyor does this when creating a child object from a parent, disabling the parent field but still showing what the parent is.)

 .. code-block:: javascript

    import { InputCore, DisabledInput } from '@autoinvent/conveyor'

    // alter the field to be disabled
    const FooInput = ({ schema, modelName, fieldName, formStack, value ...props }) => {
      if (someCondition) {
        // 'label' is the text above the field on the create page
        const label = schema.getFieldLabel({
          modelName,
          fieldName,
          node: R.path(['originNode'], formStack),
          customProps
        })

        return <DisabledInput {...{ value, label }} />
      }
      // return default if not disabled
      return (
        <InputCore {...{
          schema,
          modelName,
          fieldName,
          formStack,
          value,
          ...props
        }} />
      )
    }


FlexibleInput
--------------

If your field is not a 'regular' field (ie, not associated with a model
in the schema, is related to a custom/special feature) then you may wish
to use 'FlexibleInput'



inputTypes
------------

'inputTypes' is a dictionary you can import from conveyor containing strings of all the possible field types used by conveyor.


Custom String Type
--------------------

If you want to create a custom string type:

 .. code-block:: javascript

    import { FlexibleInput, getOnChange } from '@autoinvent/conveyor'
    import { inputTypes } from '@autoinvent/conveyor-schema'

    return (
      <FlexibleInput {...{
        id: `input-${fieldName}`,
        // override className, if desired
        className='form-control border-secondary'
        type: inputTypes.STRING_TYPE,
        // wrap 'onChange' in conveyor's `getOnChange`, where 'onChange' is an action
        onChange: getOnChange({ inputType: inputTypes.STRING_TYPE, onChange, fieldName }),
        // override & add custom props to the input component
        customInput={{
          placeholder: 'Click here...',
        }}
      }} />
    )


Custom Date Type
---------------------

If your date component has a custom format, add it to the 'customInput' prop

 .. code-block:: javascript

    // see react-datepicker for more customizations
    customInput={{
        dateFormat: 'yyyy/MM/dd' // by default year-month-date format is used
    }}


Custom File Type
--------------------

If you want to create a custom file type, adding new file extensions:

 .. code-block:: javascript

    import { FlexibleInput, getOnChange } from '@autoinvent/conveyor'
    import { inputTypes } from '@autoinvent/conveyor-schema'

    return (
      <FlexibleInput {...{
        id: `input-${fieldName}`,
        type: inputTypes.FILE_TYPE,
        // wrap 'onChange' in conveyor's `getOnChange`, where 'onChange' is the schema action
        onChange: getOnChange({ inputType: inputTypes.FILE_TYPE, onChange, fieldName }),
        // override & add custom props to the input component
        customInput: { accept: '.csv, .txt' }
      }} />
    )


Custom Radio Type
------------------

Radio types aren't in conveyor (yet). But they exist as a FlexibleInput option. Here's how you can make a custom one:

 .. code-block:: javascript

    const options = [
       {label: 'This is Foo', value: 'foo'},
       {label: 'This is Bar', value: 'bar'}
    ]
    return (
       <FlexibleInput
           type={inputTypes.RADIO_TYPE}
           options={options}
           value={'bar'}
           onChange={onChange}
           id={id}
       />
    )


Default Props for FlexibleInput
--------------------------------

Copy this boilerplate and pass it to conveyor's "FlexibleInput"

 .. code-block:: javascript

    import { getOnChange } from '@autoinvent/conveyor'

    // recreate onKeyDown
    const onKeyDown = evt => {
      if (evt.key === 'Enter') {
        return onSave({ modelName }) // actions => create => onSave
      }
    }
    // get inputType from the schema
    const inputType = schema.getType(modelName, fieldName)
    // wrap onChange in 'getOnChange'
    const defaultHandleOnChange = getOnChange({ inputType, onChange, fieldName })
    // get label string
    const fieldLabel = schema.getFieldLabel({ modelName, fieldName, customProps })
    // default props for FlexibleInput
    const defaultProps = {
      id: `input-${modelName}-${fieldName}`,
      type: inputType,
      onChange: defaultHandleOnChange,
      labelStr: inline ? null : fieldLabel,
      value,
      error,
      required: R.prop('required', schema.getField(modelName, fieldName)),
      customInput,
      autoFocus, // default: true for first string-like element on page
      onKeyDown
    }

**Props required for FlexibleInput**

*options*

List. Used for relationships, enums (choices), radio type, creatable string select field; Required for "Radio", "Select" & other type which have multiple options listed, in any form. For "Select", if options is left undefined, the parameter "noOptionsMessage" dictates the drop down message to be given to the user instead of the options. Options must be an array of "label"/"value" pairs: [{label: "Hello", value: "hello"}, {label: "World", value: "world"}]

*onMenuOpen*

Action. Updates `selectOptions` prop to have data in the relationship dropdown when field is edited. is called when user clicks on select field and the dropdown opens; Required for "Select" component to demonstrate behavior necessary when drop down menu is opened. See documentation of React Select for more information.

*onChange*

function; must use getOnChange({}) as boilerplate to wrap the appropriate action in the schema's actions. This 'onChange' action can be found in the schema: for example, the Create page uses 'onInputChange' as its onChange. The detail page may use the 'onEditInputChange' action.

*id*

string; must be unique string id

*type*

string; see conveyor's `inputTypes` for full list; see `FlexibleInput Types` below for more info


**Props NOT required for FlexibleInput**

*value*

String, object, or boolean value to display within input. Not required for empty field, you can leave it blank. FlexibleInput already takes care of default values appropriate to each input type (empty string, false, ect) if field is emtpy.

*labelStr*

string to add to label above input, if desired; not available for 'boolean' type

*inline*

boolean; Only used for 'radio' and 'boolean' type to signify 'inline' input capability (Default: false)

*className*

string; Default varies with field type ("form-control" for majority of input components).

*isClearable*

boolean; Signifies that "Select" and "Date" type input components can be cleared of data. Default: true. See documentation of React Select for more information.

*isMulti*

Signifies that multiple options can be chosen for a "Select" type component. Default: false. See documentation of React Select for more information.

*noOptionsMessage*

"Select" component drop down message displayed if no options available. Default: {() => 'No Options'}. See documentation of React Select for more information.

*error*

List of error messages to be displayed. If provided, component class contains the string 'is-invalid' and message is displayed in red. For the following types: "File", "TextArea", "Int", "Password", "String", "Boolean", "Checkbox", "Select", "Date", "Radio".

*required*

boolean; appends  '*' to the end of a label to indicate that the field is required. Not available for "Boolean" type

*customInput*

Overrides any props passed into the component, or those set by default in this library. For example, to override default settings for a "Date" component structure the data like so: {placeholderText:'Click here', fixedHeight:false}

*customError* & *customLabel*

see "CustomError & CustomLabel" section below

*autoFocus*

boolean; true if should autoFocus on field when loads; refers to specific string-like fields that have autofocus ability; autoFocus is true for: string, text, email, url, phone, password, int, currency. All other types should NOT have autoFocus; it intereferes w/ normal functionality

CustomError & CustomLabel
----------------------------

Add custom error and label components to FlexibleInput:

 .. code-block:: javascript

    const CustomError = ({error, id}) =>
        <div style={{'fontSize': '80%', 'color': '#dc3545'}}>
            {`${ makeThisListAString(error) } foo`}
        </div>

    // customize label component, rather than just string, 'labelStr'
    const CustomLabel = ({labelStr, required}) =>
        <label htmlFor={id}>
            {`Custom ${labelStr} ${required ? ' **' : ''}`}
        </label>

    return (
        <FlexibleInput
            type={inputTypes.STRING_TYPE}
            value={'Foo'}
            onChange={myOnChangeFunc}
            id={id}
            labelStr={'My Label'}
            error={['my error', 'my other error']}
            customError={CustomError}
            customLabel={CustomLabel}
        />
    )


FlexibleInput Types
---------------------

If you're customizing FlexibleInput, be aware that schema data types get changed (from their schema-designated type) when using FlexibleInput:


FLOAT_TYPE => INT_TYPE

 .. code-block:: javascript

    // Float field
    return (
        <FlexibleInput
          {...{
            ...defaultProps,
            type: inputTypes.INT_TYPE, // use INT instead of FLOAT when using FlexibleInput
            customInput: { step: 'any' }
          }}
        />
    )


ENUM_TYPE => SELECT_TYPE

 .. code-block:: javascript

    // enum field
    return (
        <FlexibleInput
          {...{
            ...defaultProps,
            type: inputTypes.SELECT_TYPE, // use SELECT instead of ENUM when using FlexibleInput
            options: enumChoiceOrder.map(choice => ({ // reformat options
              label: enumChoices[choice],
              value: choice
            })),
            customInput: { step: 'any' }
          }}
        />
    )

Single & Multi Rel => SELECT_TYPE

 .. code-block:: javascript

      return (
        <FlexibleInput
          {...{
            ...defaultProps,
            type: inputTypes.SELECT_TYPE, // USE SELECT instead of REL when using FlexibleInput
            // isMulti differentiates between single & multi rel
            isMulti: (
              inputType === inputTypes.ONE_TO_MANY_TYPE ||
              inputType === inputTypes.MANY_TO_MANY_TYPE
            ),
            onMenuOpen: evt => onMenuOpen({ modelName, fieldName }),
            options: R.path([modelName, fieldName], selectOptions)
          }}
        />
      )

CREATABLE_STRING_SELECT_TYPE => needs custom 'onMenuOpen'

 .. code-block:: javascript

    // creatable string type
    return (
        <FlexibleInput
          {...{
            ...defaultProps,
            // uses custom 'onMenuOpen'
            onMenuOpen: () => onCreatableMenuOpen({ modelName, fieldName }),
            options: R.path([modelName, fieldName], selectOptions)
          }}
        />
    )


getOnChange()
-------------

Upon submitting a file object, a helper function converts to fileReader object type & returns data array. The onSubmit helper function (which runs before every field submit) looks like this:

 .. code-block:: javascript

    // default function that runs before each field submit
    export const getOnChange = ({ inputType, onChange, fieldName }) => {

      // by default, all fields return, in their payload, the fieldName & value
      const defaultHandleOnChange = val => onChange({
        fieldName,
        value: val
      })
      // for all regular inputs
      if (inputType !== inputTypes.FILE_TYPE) {
        return defaultHandleOnChange
      }

      // field types get converted to fileReader type
      return (evt => {
        const fileReader = new FileReader()

        const onloadend = () => {
          // handle result of read
          if (!fileReader.error) {
            const content = fileReader.result
            // since cannot save ArrayBuffer to store, convert value
            const converted = arrayBufferToStoreValue(content)
            defaultHandleOnChange(converted)
          }
        }

        if (evt.target.files.length > 0) {
          // initiate read
          fileReader.onloadend = onloadend
          fileReader.readAsArrayBuffer(evt.target.files[0])
        }
      })
    }


