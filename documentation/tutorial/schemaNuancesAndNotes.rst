.. _tutorial/schemaNuancesAndNotes:

******************************
Schema Nuances and Notes
******************************

Below is a partial schema for the 'Book' model.

 .. code-block:: javascript

    const Book = {
      displayName: "BOOK", // model-level displayName
      displayField: "name",
      tableLinkField: 'name',
      fieldOrder: ['name', 'author', 'genres']
      fields: {
        author: {
          displayName: 'Author', // field-level displayName
          fieldName: 'author',
          type: {
            backref: 'books',
            target: 'Author',
            type: 'ManyToOne'
          },
        },
        genres: {
          displayName: 'Genres', // field-level displayName
          fieldName: 'genres',
          type: {
            backref: 'books',
            tableFields: ['name', 'description'], // required for 'OneToMany' fields
            target: 'Genre',
            type: 'OneToMany'
          }
        }
      },
    }


*type* (Auto-generated on the backend)

If the 'type' is a relationship, it appears as an object in the schema.

'ManyToOne' = single relationship.

'OneToMany' = table; has 'tableFields' which are columns; **you are required to set 'tableFields' in the schema**.

See `Field Types` for more info on type


*fieldOrder*

Notice the 'fieldOrder' specifies the order in which the fields generally appear. **If a field is not present in fieldOrder it will not appear on any page.**
But 'showIndex', 'showDetail', 'showCreate' determine if the fields are present on Index/Detail/Create pages specifically.
By default, the detail page will place table fields ('OneToMany') below the rest, automatically.

*tableLinkField*

This prop, usually set to the 'name' field, designates which column will have the hyperlink to the detail page on any displayed table.
If the prop is set to null, no hyperlink will appear, but instead a 'view' button at the end of the row, which will link to the detail page.
If the prop is set to a relationship field, then you also need to specify displayField().


*displayField*

For most models, this will be 'name' (or some other string field representing the object). It can even be a function that generates a custom name.

Note: If 'tableLinkField' is a relationship field and you have no other column (such as 'name') to represent the model, set displayField() to a function that returns a custom string.
This custom string will 'represent' the model in tables & select drop-downs.

If you are using conveyor's getDisplayValue() function to resolve an object's display name in a custom component, then that model should have a function under 'displayField' to resolve display name.

*hasIndex*

If false, redirects to '/' when type '/<modelName>' into url. Avoids showing index pages for models that shouldn't have index views.

*displayName vs displayField*

'displayField' refers to the field representing the instance (ie, "name").
'displayName' refers to the name of the table or field as it appears in the UI (ie, "Book", or "Author").


*required*

Adds a '*' to the displayed field name in the create form, to indicate that the field is required.