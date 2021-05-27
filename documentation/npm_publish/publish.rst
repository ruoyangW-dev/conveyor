Npm publish checklist
***********************

autoinvent-example test
-------------------------

check that the autoinvent-example project works with the new changes to conveyor:

1. delete the '/lib' folder, then run 'npm run build' to create up-to-date files in the /lib folder
2. (if you have yalc installed) run 'yalc publish' in ~/conveyor repo
3. run 'yalc add @autoinvent/conveyor' in ~/autoinvent-example repo
4. run 'yalc push' in ~/conveyor repo
(repeat step 1 and 4 every time you change the code in conveyor)
5. test that your UI works in autoinvent-example

docs/_build
------------

delete 'docs/_build' folder
run 'make html' in the 'conveyor/docs' directory
(ensure removed files do not linger in /_build folder)

lib
-----

delete 'lib' folder
run 'npm run build' in the 'conveyor' directory
(ensure removed files do not linger in /lib folder)

npm pack
---------

run 'npm pack' in 'conveyor' directory -> displays contents/files which will be published
ensure all listed files are approved for publication
delete tarball file created with 'npm pack'

checks
-------

version is incremented?
name is correct?
on latest branch?

publish
--------

'npm login' (if haven't done so already; need npm account for this)
'npm publish --access public' (since scoped package need --access tag)


tag
----

git tag v{version in package.json during publish} {commit#}
(example: git tag v0.1.0 38e743d4823r8wef...)
git push --tags
