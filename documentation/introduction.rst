.. _introduction:

*********************
Conveyor Introduction
*********************

**Important!** See the autoinvent-example project and setup docs for steps on setting up conveyor, its necessary schema, and its related repositories.

Conveyor is a collection of components used for automatic dashboard generation and viewing data with complex relationships. Conveyor was designed as a front end framework for connected Index tables, Detail pages, nested tabs for Detail pages, create stacks (forms connected by related objects which can be traversed), delete buttons, delete warning popups, inline edits, and table edits. There are extensive overrides for components at model and field levels. The framework accommodates different field types including: basic (string, int, float, textarea), relationship (many-to-one, many-to-many, one-to-many), choice type, and special (date, currency, file, ect).

============
Limitations
============

Although many field properties have overrides, conveyor pages have a set geometry and layout.
However, individual components (such as create/delete/edit buttons, modals, headers, tables, ect) can be imported from Conveyor and used in any desired configuration/ override, ect.

Conveyor takes care of setting up the links between objects so the application can be easily traversed. All links are generated with respect to the root url, '/'. For example, a detail page, '/Book/1', cannot be prefixed by anything (cannot be: 'somepath/Book/1'). Conveyor generates links based on modelName and id props:

 .. code-block:: javascript

      <Link
        to={`/${modelName}/${id}`}
        className='btn btn-sm btn-outline-primary'
      >View</Link>



Conveyor was designed for a single react-router. (Meaning the Create/Index/Detail components should not be duplicated and used with multiple react-router links)
This is because the format of data required for conveyor can only handle state changes for one instance of a Create/Index/Detail page at a time.
There's a conflict if 2 instances of a single page are accessed concurrently.
