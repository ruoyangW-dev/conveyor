.. _tutorial/tabs:

Tabs
----

Tab structure::

  tabs: [ # list of components
      {
          name: # (req) name displayed on the tab: string
          pillId: # (req) unique id of the tab, appears in URL: string
          fields: # fields displayed using default framework components: list of strings
          tabs: # recursive tabs
          component: # custom component; overrides 'fields' prop but allows 'tabs' to continue propagating: function
      },
  ]

The url structure of tabs is ``\<modelName>\<id>\<pillId>\<pillId>\...`` where each level of the nested tab adds its pill id to the url.

**Note:** if the list of tabs only has one entry, the components are displayed without the singular tab. this tactic is used if a field should be displayed above a group of tabs on a page. Otherwise, by default, fields always appear below the tab under which they are designated.
