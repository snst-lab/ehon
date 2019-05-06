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
- [x] 1. first release

>### Minor
### Version 0.x

- [x] 1. drag file to canvas to create elements & set style 
- [x] 2. drag&drop elements to move
- [x] 3. right click elements to switch editable/ noeditable 
- [x] 4. move along X,Y,Z-axis, scale, rotate, change opacity of elements with keydown& wheel
- [x] 5. add camera component
- [x] 6. registering & playing animation
- [x] 7. change image src & duration
- [x] 8. attach components as animation trigger 
- [x] 9. add text component & make component to be copyable 
- [x] 10. show layer table & select layer to be editable
- [x] 11. add audio component
- [x] 12. save story as json file
- [ ] 13. undo/redo


>### Patch
### Version 0.12.x
<details open>
<summary>1</summary>

- bugfix: Fixed a bug that animation continues after scene change<br>
- improve: Enabled to play music repeatedly
</details>
<details open>
<summary>2</summary>

- improve: Enabled to add svg image
</details>
<details open>
<summary>3</summary>

- refactor: make a part of cssText in script change place to sass
</details>

### Version 0.7.x
<details open>
<summary>1</summary>

- improve:  Set animation delay and iteration<br>
- style:  Change pallet ui<br>
- bugfix: Generate animation instance for each component
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


### Version 0.3.x
<details open>
<summary>1</summary>

- refactor:  Replace defineProperty Methods<br>
- bugfix: Fixed the problem that the previously selected element is not
deactivated
</details>
