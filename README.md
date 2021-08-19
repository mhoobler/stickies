# Stickies

Just a little personal project to replace the xcfe4-notes-plugin, while also learning more about IndexedDB and PWAs.

## How to use

This is a PWA that works entirely on your browser and doesn't connect to any sort of database or backend.
[Use Progressive Web App](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop)

1. Click the colorbar at the top left to select a color
2. Drag the colorbar to create a new note
3. Drag the empty space above the text to move the notes (Clicking & Dragging this area will save the position)
4. Move the note over the trash can icon to delete the note
5. Drag the bottom right corner of a note to resize

There's also 3 buttons in the top-center that reposition the stickies BUT those positions do not save unless you do step 3.

## How to run locally

1. Just clone and run `yarn dev` to create a local development environment.
2. Run `build-test` to create a local production build.
3. Run `build` to actually create a production build.

- The only difference between `build` and `build-test` is parcel's `--public-url` flag. But that is needed in order to get this app to run on GHP.
