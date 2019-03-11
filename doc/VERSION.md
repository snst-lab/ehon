Version
=============

>## Scheme

The versioning scheme we refer is [Semantic Versioning](https://semver.org/)

#### <PROJECTNAME\>-<MAJOR\>.<MINOR\>.<PATCH\>

| Type | Description | Commit Title | Commit Message |
|:----------:|:-------------|:-------------|:-------------|
|**Major**| Incompatible API changes | major-x.0.0 | ehon-x.0.0 released / feature: A / feature: B / improve:A / ...   |
|**Minor**| Adding functionality in a backwards-compatible | minor-x.x.0 | feature:A |
|**Patch**| Bug fixes or improving functionality. | patch-x.x.x | bugfix: A,  improve: B,  refactor: C, style: D |
<summary><div> 

#### Rules of Commit Title
- **major-x.0.0** : Major update with summarizing multiple commits
- **minor-x.x.0** : Minor update with summarizing multiple commits
- **patch-x.x.x** : Patch with summarizing multiple commits
- **feature**  : Add a new function
- **bugfix**  : Fixed a bug of functions
- **improve** : Improve performance or convenience of functions
- **refactor** : Change of source code or file name without improvement
- **style** :  Change of appearance of UI.
- **assets** :  Edit image, icon, audio or movie materials, etc.
- **doc** :  Edit documents.

<br>
<br>

> ## Roadmap & History
- **Roadmap** -  [ ] unchecked
- **History** - [x] checked

>### Major
### Version x

- [x] 0. project launch
- [ ] 1. first release

>### Minor
### Version 0.x

- [x] 1. drag file to canvas to create elements & set style 
- [x] 2. drag&drop elements to move
- [x] 3. right click elements to switch editable/ noeditable 
- [x] 4. move along X,Y,Z-axis, scale, rotate, change opacity of elements with keydown& wheel
- [x] 5. add camera component
- [x] 6. registering & playing animation
- [ ] 7. save html file as current state
- [ ] 8. show layer table & select layer to be editable ("self" is prepared alias of layer) 
- [ ] 9. right click elements to show framebase timeline (circle on bar style)
- [ ] 10. select event & target from layer table
- [ ] 11. double left click on timeline to registar state & double right click to delete
- [ ] 12. double left click on circle on timeline to change src file.
- [ ] 13. right click circle on timeline to edit new state of elements / right click again to cancel
- [ ] 14. save history of html
- [ ] 15. undo/redo



>### Patch

### Version 0.3.x
<details open>
<summary>1</summary>

- refactor:  Replace defineProperty Methods<br>
- bugfix: Fixed the problem that the previously selected element is not
deactivated
</details>

### Version 0.4.x
<details open>
<summary>1</summary>

- improve : At the time of z-axis movement, the blur also changes at the same time
- style : Change outline style of active element
</details>
<details open>
<summary>2</summary>

- bugfix : Re-define z-axis with z-index instead of transformZ to 
- bugfix : Fixed bug that outline of deactivated image did not disappear
- improve : Adopt % scale for position of image instead of px
- improve : Adjust the movement along the xy axis of the image according to the distance from the vanishing point
- refactor : Activate component with double click instead of right click
</details>
<details open>
<summary>3</summary>

- refactor : domControler.ts to be able to DOM Parsing at the time that create instance.
- improve : click canvas to activate alternatively overlapping elements.
</details>
