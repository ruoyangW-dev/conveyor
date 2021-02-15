# conveyor documentation

Conveyor is a collection of components used for automatic dashboard generation and viewing data with complex relationships. Conveyor was designed as a front end framework for connected Index tables, Detail pages, nested tabs for Detail pages, create stacks (forms connected by related objects which can be traversed), delete buttons, delete warning popups, inline edits, and table edits. There are extensive overrides for components at model and field levels. The framework accommodates different field types including: basic (string, int, float, textarea), relationship (many-to-one, many-to-many, one-to-many), choice type, and special (date, currency, file, ect).

# Development

To generate the /lib files run:

'npm run build'

Before npm publishing please follow instructions in '/docs/npm_publish/publish.rst'