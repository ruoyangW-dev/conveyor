import React from 'react'
import { InputCore } from '../form/Input'
import { FaFilter } from 'react-icons/fa'
import * as R from 'ramda'
import { inputTypes } from '../consts'
import FlexibleInput from '../input'
import { Modal } from '../Modal'

const getFilterableFields = ({ schema, modelName, data, customProps }) => {
  const fields = R.pathOr([], [modelName, 'fieldOrder'], schema.schemaJSON)
  const filterables = fields.filter(
    fieldName => schema.isFilterable({ modelName, fieldName, data, customProps })
  )
  return filterables
}

const FilterButtons = ({
  modelName,
  onFilterSubmit,
  clearFilters,
  addFilter
}) => (
  <div className='conv-filter-buttons'>
    <button
      className='conv-add-filter-button'
      onClick={() => addFilter({ modelName })}
    >+ Add Rule</button>
    <div>
      <div className='conv-btn-group'>
        <button
          className='conv-filter-submit-button'
          onClick={() => onFilterSubmit({ modelName })}
        >Apply</button>
        <button
          className='conv-btn-outline-danger'
          onClick={() => {
            clearFilters({ modelName })
            onFilterSubmit({ modelName })
          }}
        >Reset</button>
      </div>
    </div>
  </div>
)

const formatFilter = ({
  fieldName,
  index,
  modelName,
  schema,
  data,
  onChange,
  selectOptions,
  filterOrder,
  onFilterChange,
  onFilterSubmit,
  onFilterDropdown,
  filterInputs,
  deleteFilter,
  customProps
}) => {
  const filterInput = R.prop(fieldName, filterInputs)
  const filterables = getFilterableFields({ schema, modelName, data, customProps })
  const toOptions = fieldName => ({
    label: schema.getFieldLabel({ modelName, fieldName, data, customProps }),
    value: fieldName
  })
  const unfiltered = filterables.filter(fieldName => !filterOrder.includes(fieldName))
  const options = unfiltered.map(fieldName => toOptions(fieldName))
  const value = R.isNil(fieldName) || R.isEmpty(fieldName)
    ? { label: null, value: null }
    : toOptions(filterOrder[index])
  return (
    <li key={`${index}-${modelName}-${fieldName}-format-filter`} className='conv-format-filter'>
      <div className='conv-filter-fieldname-dropdown'>
        <div>
          <FlexibleInput {...{
            type: inputTypes.SELECT_TYPE,
            onChange: evt => onChange({
              modelName,
              fieldName: R.prop('value', evt),
              index
            }),
            value,
            options,
            id: `${index}-${modelName}-filter-dropdown`,
            isClearable: false,
            customInput: {
              noOptionsMessage: () => '(no filterable fields)',
              placeholder: 'Select field...'
            }
          }}/>
        </div>
      </div>
      <div className='conv-filter-rest'>
        <div>
          <FilterComp {...{
            fieldName,
            modelName,
            schema,
            onFilterChange: evt => onFilterChange({
              modelName,
              ...evt
            }),
            onFilterSubmit,
            onFilterDropdown,
            filterInput,
            selectOptions
          }}/>
        </div>
      </div>
      <div className='conv-filter-close'>
        <button
          onClick={() => deleteFilter({ modelName, index })}
        >X</button>
      </div>
    </li>
  )
}

const ActiveFilters = ({
  modelName,
  schema,
  data,
  addFilter,
  deleteFilter,
  onChange,
  selectOptions,
  filterOrder,
  clearFilters,
  onFilterChange,
  onFilterSubmit,
  onFilterDropdown,
  filterInputs,
  customProps
}) => (
  <div id={'active-filters-' + modelName} className={"conv-active-filters conv-active-filters-" + modelName}>
    <ul>
      {R.isEmpty(filterOrder) || R.isNil(filterOrder) ? (
        <li
          key="no-active-filters"
          className="conv-no-active-filters"
          onClick={() => addFilter({ modelName })}
        >
          Add a rule to get started...
        </li>
      ) : (
        filterOrder.map((fieldName, index) =>
          formatFilter({
            fieldName,
            index,
            modelName,
            schema,
            data,
            onChange,
            selectOptions,
            filterOrder,
            onFilterChange,
            onFilterSubmit,
            onFilterDropdown,
            filterInputs,
            deleteFilter,
            customProps
          })
        )
      )}
    </ul>
    <FilterButtons
      {...{
        modelName,
        onFilterSubmit,
        clearFilters,
        addFilter
      }}
    />
  </div>
)

export const FilterModal = ({
  schema,
  modelName,
  selectOptions,
  data,
  filterOrder,
  filterInputs,
  customProps
}) => {
  const actions = schema.getActions(modelName)
  const tableOptions = R.prop('tableOptions', actions)
  const addFilter = R.prop('addFilter', tableOptions)
  const deleteFilter = R.prop('deleteFilter', tableOptions)
  const clearFilters = R.prop('clearFilters', tableOptions)
  const changeField = R.prop('changeField', tableOptions)
  const onFilterChange = R.prop('filterChange', tableOptions)
  const onFilterSubmit = R.prop('filterSubmit', tableOptions)
  const onFilterDropdown = R.prop('filterDropdown', tableOptions)
  return (
    <Modal
      id={'filter-' + modelName}
      title={'Filters - ' + modelName}
      className={'conv-filter-modal conv-filter-modal-' + modelName}
      children={
        <ActiveFilters {...{
          modelName,
          schema,
          data,
          addFilter,
          deleteFilter,
          onChange: changeField,
          selectOptions,
          filterOrder,
          clearFilters,
          onFilterChange,
          onFilterSubmit,
          onFilterDropdown,
          filterInputs,
          customProps
        }} />
      }
    />
  )
}

export const FilterModalButton = ({ modelName, filtersAreActive }) => (
  <button
    className={'conv-filter-modal-button conv-filter-modal-button-' + modelName}
    data-toggle='modal'
    data-target={'#filter-' + modelName}
  >
    Filter
    <FaFilter
      className={`filter-icon-${filtersAreActive ? 'active' : 'inactive'} conv-filter-icon`}
      color={filtersAreActive ? 'lightgreen' : 'black'}
    />
  </button>
)

const stringOptions = [
  { label: 'Includes', value: 'INCLUDES' },
  { label: 'Equals', value: 'EQUALS' },
  { label: 'Exists', value: 'EXISTS' },
  { label: 'Does Not Exist', value: 'DOESNOTEXIST' }
]

const numberOptions = [
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: '=', value: 'eq' },
  { label: '!=', value: 'neq' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' }
]

const relOptions = [
  { label: 'Includes', value: 'INCLUDES' }
]

const enumOptions = [
  { label: 'Includes', value: 'INCLUDES' }
]

const dateOptions = [
  { label: 'Before', value: 'BEFORE' }
]

const booleanOptions = [
  { label: 'Equals', value: 'EQUALS' }
]

const FilterOptions = ({
  schema,
  modelName,
  fieldName,
  operator,
  onFilterDropdown
}) => {
  const inputType = schema.getType(modelName, fieldName)

  let options
  switch (inputType) {
    case inputTypes.INT_TYPE:
    case inputTypes.FLOAT_TYPE:
    case inputTypes.CURRENCY_TYPE:
      options = numberOptions
      break;
    case inputTypes.ENUM_TYPE:
      options = enumOptions
      break;
    case inputTypes.DATE_TYPE:
    case inputTypes.DATETIME_TYPE:
      options = dateOptions
      break;
    case inputTypes.BOOLEAN_TYPE:
      options = booleanOptions
      break;
    case inputTypes.ONE_TO_ONE_TYPE:
    case inputTypes.MANY_TO_ONE_TYPE:
    case inputTypes.ONE_TO_MANY_TYPE:
    case inputTypes.MANY_TO_MANY_TYPE:
      options = relOptions
      break;
    default:
      options = stringOptions
  }
  return (
    <React.Fragment>
      <FlexibleInput key={`FlexibleInput-${modelName}-${fieldName}`}
        type={inputTypes.SELECT_TYPE}
        onChange={val => onFilterDropdown({
          modelName,
          fieldName,
          operator: val
        })}
        value={operator}
        options={options}
        id={`${modelName}-${fieldName}-filter-radio`}
        isClearable={false}
      />
    </React.Fragment>
  )
}

// todo: finish
  // case inputTypes.DATE_TYPE:
  // case inputTypes.PHONE_TYPE:
  // case inputTypes.BOOLEAN_TYPE:


export const FilterComp = ({
  fieldName,
  modelName,
  schema,
  onFilterChange,
  onFilterSubmit,
  onFilterDropdown,
  filterInput,
  selectOptions
}) => {
  if (R.isNil(fieldName) || R.isEmpty(fieldName)) {
    return <div className='conv-filter-comp-empty'>Select a field</div>
  }
  const value = R.prop('value', filterInput)
  const operator = R.prop('operator', filterInput)
  const actions = schema.getActions(modelName)
  const onMenuOpen = R.path(['input', 'onMenuOpen'], actions)
  return (
    <div className={'conv-filter-comp conv-filter-comp-' + modelName}>
      <div className='filter-operator-dropdown'>
        <FilterOptions {...{
          schema,
          modelName,
          fieldName,
          operator,
          onFilterSubmit,
          onFilterDropdown,
        }} />
      </div>
      <div className='filter-input'>
      { R.prop('value', operator) !== 'EXISTS' && R.prop('value', operator) !== 'DOESNOTEXIST' && <InputCore {...{
          schema,
          modelName,
          fieldName,
          value,
          onChange: onFilterChange,
          inline: true,
          selectOptions,
          onMenuOpen,
          customInput: {
            placeholder: 'Enter value...',
          }
        }} /> }
      </div>
    </div>
  )
}
