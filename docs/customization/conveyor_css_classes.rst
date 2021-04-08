.. _customization/conveyor_css_classes.rst

******************************
CSS Classes Added to Conveyor
******************************

*Modal and ImageLinkModal*
Have user generated className that can be passed:

<Modal className=’my-class’>
<ImageLinkModal className=’my-class’>

Modals also come with default class of ‘conv-modal’
ImageLinkModal			‘conv-image-modal’ ‘conv-image-modal-loading’ or ‘conv-image-modal-loaded’( depending on the load status.)

*DeleteDetail and RemoveDetail*
DeleteDetail RemoveDetail 		‘conv-delete-modal’ ‘conv-delete-modal-table’  ‘conv-delete-modal-table-{modelName}’ (where modelName refers to the model displayed by the table, not the class to be deleted.)

*Breadcrumbs
‘conv-breadcrumbs’

*Create*
DefaultCreate				‘conv-create’ ‘conv-create-{modelName}’
CreatePage				‘conv-create-page’ ‘conv-create-page-{modelName}’

*Input*
InputCore				‘conv-input’ ‘conv-input-model-{modelName}’
DisabledInput				‘conv-disabled-input’

*InputComponents*
displaying at the FormGroup level
CustomErrorComponent    ''
(any input type)			‘conv-input-component’
InputDate				‘ conv-input-type-date’
InputDateTime			‘ conv-input-type-datetime’
InputString				‘ conv-input-type-string’
InputPassword			‘ conv-input-type-password’
InputInt				‘ conv-input-type-int’
InputCurrency 			‘ conv-input-type-currency’
InputTextArea				‘ conv-input-type-textarea’
InputRadio				‘ conv-input-type-radio’
InputFile				‘ conv-input-type-file’
InputSwitch				‘ conv-input-type-switch’
InputCheckbox			‘ conv-input-type-checkbox’
InputSelect				‘ conv-input-type-select’
InputCreatableStringSelect		‘ conv-input-type-creatable-string-select’

*Filter*
FilterComp				‘conv-filter-comp’ ‘conv-filter-comp-{modelName}’
formatFilter				‘conv-format-filter’
FilterModal				‘conv-filter-modal’ ‘conv-filter-modal-{modelName}
FilterModalButton			‘conv-filter-modal-button’ ‘conv-filter-modal-button-{modelName}’
ActiveFilters				‘conv-active-filters’ ‘conv-active-filters-{modelName}’

*Header/Footer*
'conv-formatted-th'

*Alerts*
Alerts					‘conv-alerts’

*CreateButton*
CreateButton				‘conv-create-button’

*Popover*
Popover and PopoverContent have passable className args.
Popover				‘conv-popover’
PopoverContent			‘conv-popover-content’

*Detail*
Wrapper				‘conv-detail-wrapper’ ‘conv-detail-wrapper-{modelName}’
(when page is still loading)		‘conv-detail-wrapper-loading’
DefaultDetailPageTitle		‘conv-default-detail-page-title’ ‘conv-default-detail-page-title-{modelName}’
DefaultDetailTable			‘conv-detail-table’ ‘conv-detail-table-{modelName}’
DefaultDetailAttribute(s Container)	‘conv-detail-attributes’ ‘conv-detail-attributes-{modelName}’ (as close as formatting let it be)

*Edit*
FileDelete				‘conv-delete-file-modal’ ‘conv-file-delete’
EditButton				‘conv-edit-button’
EditSaveButton			‘conv-edit-save-button’
EditCancelButton			‘conv-edit-cancel-button’

*Index*
DefaultIndex				‘conv-index’ ‘conv-index-{modelName
DefaultIndexTitle			‘conv-default-index-title’ ‘conv-default-index-title-{modelName}’

*Pagination*
Pagination				‘conv-pagination’
GotoTooltip				‘conv-goto-tooltip’

*PrintButton*
PrintButton				‘conv-print-button’

*Search*
Search					‘conv-search’ ‘conv-search-dropdown’ (for dropdown) 'conv-dropdown-item' 'conv-search-dropdown-model-label'
Highlight               'conv-highlight'


*Tabs*
TabFields				‘conv-tab-fields’
RecursiveTab				‘conv-recursive-tab’

*Tooltip*
RelTooltipContent			‘conv-rel-tooltip-content’
RelTooltip				‘conv-rel-tooltip’

*TreeTable*
ToggleContainer			‘conv-toggle-container-tooltip’(for the tooltip) ‘conv-toggle-container-component’ (for tooltip contents)
renderRow               'conv-tree-table-header' 'conv-tree-table-header-label'
