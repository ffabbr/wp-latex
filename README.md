# WordPress Latex in the Block Editor

A WordPress plugin that adds LaTeX support to the Block editor. When enabled on a page, KaTeX will render on the frontend. On any page or post you get the ability to enable LaTeX rendering on the frontend through the right sidebar in the post/page settings of the Block editor. All scripts, styles and fonts are stored locally in the plugin directory. 

### Known bugs

Using display math (so not inline) while in another paragraph crashes the frontend. Simply go back to the editor, and hit enter once before the opening dollar signs. A <br> is not enough here. 
