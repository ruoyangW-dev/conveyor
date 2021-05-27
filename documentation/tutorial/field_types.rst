.. _tutorial/field_types:

**************************
Relationship Field Types
**************************

ManyToMany vs OneToMany
---------------------------

A ManyToMany table will have a 'remove' button (deletes association but not object itself). 'Editing' button over the table opens a multi-select field to remove (but not delete) relationships).

A OneToMany table will have a 'delete' button (deletes child object). 'Create' button over the table redirects to 'create stack' where new object is created, with auto-populated parent object.

A single relationship (OneToOne or ManyToOne) will be a link (not a table) on the detail page description list. Editing this field opens a single-select dropdown of other rels.


The data for rel fields (list vs object):

Note: '__typename' is necessary to include nested in the json data so that the 'delete review modal' feature can adequately construct the table.


 .. code-block:: javascript

    Book: {
        __typename: 'Book',
        author: { // ManyToOne
            __typename: 'Author',
            id: '1',
            name: 'author1'
        },
        genres: // OneToMany or ManyToMany
            [
                {
                    __typename: 'Genre',
                    id: '2',
                    name: 'genre2'
                },
                {
                    __typename: 'Genre',
                    id: '1',
                    name: 'genre1'
                }
            ]

    }

Differentiate OneToMany from ManyToMany with the schema 'type' prop:

 .. code-block:: javascript

      type: {
        ...
        target: 'Genre',
        type: 'ManyToMany'
      }




****************
Basic Field Types
****************

In the schema, field types are stated in one of two ways:

1.) as a string

 .. code-block:: javascript

    schema = { <modelName>: { fields: { <fieldName>: {
        type: 'string' // also 'int', 'boolean', 'date', 'text', 'currency'
    }}}}

2.) as an object, for a relationship fields

 .. code-block:: javascript

    schema = { <modelName>: { fields: { <fieldName>: {
        type: {
            type: "ManyToOne", // Database type of OneToOne, OneToMany, ManyToMany, or ManyToOne
            target: "Author", // modelName of the target of the relationship
            backref: "books", // name of relationship on the targets side
            tableFields: ["name"], // List of fields on the target model to display when displaying a table on the detail page
        }
    }}}}

Note: 'tableFields' isn't necessary in a 'ManyToOne' field type where a single object is displayed. But it is necessary in table fields, where the relationship points to a group of 1+ relationship objects.

3.) 'enum' field type (static list of choices for select drop down)

 .. code-block:: javascript

    schema = { <modelName>: { fields: { <fieldName>: {
      type: 'enum',
      // add all available options in a dictionary: { value: label }
      choices: {
        'green': 'Green Label',
        'blue': 'Blue Label',
      },
      // order of values
      choiceOrder: ['green', 'blue']
    }}}}

inputTypes
---------------

To get the exact string constants that conveyor uses for each field type, import the 'inputTypes' object.

 .. code-block:: javascript

    import { inputTypes } from 'conveyor'

    // get the string that represents the input type you want
    // use for override functions or schema building
    const type = inputTypes.TEXTAREA_TYPE



Field Types
----------------

*boolean*

object type: boolean

inputType.BOOLEAN_TYPE



*checkbox*

object type: boolean

inputType.CHECKBOX_TYPE



*currency*

object type: string

inputType.CURRENCY_TYPE

example: 243.24



*date*

object type: string

inputTypes.DATE_TYPE

example: '2017-07-31' // must be in 'yyyy/MM/dd' format



*email*

object type: string

inputTypes.EMAIL_TYPE



*float*

object type: number/string

inputTypes.FLOAT_TYPE



*int*

object type: number/string

inputType.INT_TYPE



*password*

object type: string

inputTypes.PASSWORD_TYPE



*phone*

object type: string

inputTypes.PHONE_TYPE



*string*

object type: string

inputTypes.STRING_TYPE



*text*

object type: string

inputTyptes.TEXTAREA_TYPE



*url*

object type: string

inputTypes.URL_TYPE



*creatable_string_select*

object type: string

inputTypes.CREATABLE_STRING_SELECT_TYPE



Object Field Types
----------------

*enum*

object type: object

example: { label: 'Red Book', 'value: 'red' }

inputTypes.ENUM_TYPE (for InputCore) or inputTypes.SELECT_TYPE (for FlexibleInput)



*ManyToOne*

object type: object

example: { label: 'book_2', value: 2 }

inputTypes.SELECT_TYPE (for FlexibleInput) or inputTypes.MANY_TO_ONE_TYPE (for InputCore)

uses 'selectOptions' prop, passed into conveyor's Create, Index, & Detail for options



*OneToMany*

object type: list of objects

example: [{ label: 'book_2', value: 2 }, ...]

inputTypes.SELECT_TYPE (for FlexibleInput) or inputTypes.ONE_TO_MANY_TYPE (for InputCore)

uses 'selectOptions' prop, passed into conveyor's Create, Index, & Detail for options



*ManyToMany*

object type: list of objects

example: [{ label: 'book_2', value: 2 }, ...]

inputTypes.SELECT_TYPE (for FlexibleInput) or inputTypes.MANY_TO_MANY_TYPE (for InputCore)

uses 'selectOptions' prop, passed into conveyor's Create, Index, & Detail for options



File Type
--------------

*file*

inputTypes.FILE_TYPE

Displays an <input type='file'> component, which accepts a default 'image/*' type. Upon submitting a file object, a helper function converts to fileReader object type & returns data array. For more info, see how to customize/manage this field in `Custom File Type`.
