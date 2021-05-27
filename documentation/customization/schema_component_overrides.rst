.. _customization/schema_component_overrides:

****************************
Schema Component Overrides
****************************

You can override entire components in the index, detail, and create page:

For example:

 .. code-block:: javascript

    import { DefaultDetail } from 'conveyor'

    // the default 'detail' from conveyor
    const detail = ({ node, ...props }) => {
        // conditionally render a detail component
        if (something) {
           // mess around with props
           node = { blah: 'blah...', ...node }
           // return default component
           return <DefaultDetail {...{ node, props }}/>
        }
        return null
    }

    // list of override components in the schema:
    schema = {
      fields : {
         <fieldName>: { // field overrides
              components: {
                cell: cell,
                detail: detail,
                detailLabel: detailLabel,
                detailValue: detailValue,
                input: input,
                labelInfo: labelInfo
              }
         }
      }
      components: { // model overrides
         detail: detail,
         detailPage: detailPage,
         detailTitle: detailTitle,
         index: index,
         indexPage: indexPage,
         indexTitle: indexTitle,
         create: create,
         createPage: createPage,
         createTitle: createTitle,
      }
    }

Model Overrides
------------------

Model overrides and their matching default components.

 .. code-block:: javascript

    import { DefaultDetail } from 'conveyor'

    // get default components for (model) overrides

    const detail = DefaultDetail
    const detailPage = RecursiveTab || DetailFields  // use 'RecursiveTab' if tabs exist in schema
    const detailTitle = DefaultDetailPageTitle

    const index = DefaultIndex
    const indexPage = Table  // also for tables on detail page
    const indexTitle = DefaultIndexTitle

    const create = DefaultCreate
    const createPage = DefaultCreatePage
    const createTitle = DefaultCreateTitle

    // note: for 'detailPage' use this in your custom function check to see if 'RecursiveTab' or 'DetailFields' should be used:
    const detailPage = tabs && tabs.length > 0 ? RecursiveTab : DetailFields

The 'detail' component overrides the entire detail component (title and content).

The 'detailLabel' component overrides ONLY the title and its buttons ("Create"/"Delete", ect).

The 'detailValue' component overrides ONLY the content'.


Field Overrides
------------------

 .. code-block:: javascript

    import { Field } from 'conveyor'

    const cell = Field
    const detail = DefaultDetailAttribute || DefaultDetailTable // use 'DefaultDetailTable' if field is 'OneToMany' or 'ManyToMany' (table)
    const detailLabel = DefaultDetailLabel || DefaultDetailO2MTableTitle || DefaultDetailM2MFieldLabel || DefaultDetailM2MTableTitle // see distinctions below
    const detailValue = Field || Table  // use 'Table' if field is 'OneToMany' or 'ManyToMany' (table)
    const input = InputCore
    const labelInfo = no default

    // for 'cell' component, if the fieldName === 'tableLinkField' (schema-designated field which is the object's 'title' field, usually 'name'), and you want to mimic conveyor behavior, return this instead of 'Field':

    const displayString = schema.getDisplayValue({
      modelName,
      node,
      customProps
    })
    return <DetailLink {...{ modelName, id: node.id }}>{displayString}</DetailLink>

    // for 'detailLabel', here are the distinctions:

    // DefaultDetailLabel => for "description list" (non-table) field title
    // DefaultDetailO2MTableTitle => for OneToMany table title
    // DefaultDetailM2MFieldLabel => for ManyToMany table title (being edited)
    // DefaultDetailM2MTableTitle => for ManyToMany table title



**Uses of each override**

cell => table column (how the field is shown in 'detail'/'index' tables)

detail => ENTIRE detail attribute (label + value) for table or non-table field on the detail page

detailLabel => label for detail attribute

detailValue => value for detail attribute

input => edit/create component override (index table, detail table, detail attribute, create input)

labelInfo => Automatically adds popover to the field label. You provide the
text necessary, and conveyor takes care of the popover. For example:


 .. code-block:: javascript

    const labelInfo = () => <div>example text</div>



**Table Component Props**

When you override 'detailLabel' and 'indexPage' you will get some different props coming into your override functions:

*For the Index page*

fromIndex => true


*For the Detail table*

parentId => id of parent (what Detail page the table is on)

parentModelName => modelName of parent

parentFieldName => fieldName (what the 'table' is to the parent object)

node => the 'parentNode', usually containing data from detail page that the current table is contained in

collapse => boolean; is table collapsed? (return null instead of a table if this is true)


