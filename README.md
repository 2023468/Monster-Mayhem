Monster Mayhem - Hex Grid Chase Game

This project is a browser-based hex board game where the goal is to evade a chasing monster. It was built with client-side HTML, CSS, and JavaScript.

The game now includes multiple difficulty levels which control the monster's speed, making for a more challenging and replayable experience.

Gameplay

Select Difficulty: Choose "Easy," "Medium," or "Hard" to start the game.

Player Control: You are the blue token. Click your token to see available moves highlighted in green.

Movement: Click a green tile to move.

Monster AI: After you move, the purple monster will take one or more steps towards you, depending on the difficulty.

Game Over: The game ends when the monster catches you. You can then restart and choose a new difficulty.

Key Updates & Features

Difficulty Levels: The start screen now allows the player to select a difficulty.

Easy: Monster moves 1 space per turn.

Medium: Monster moves 2 spaces per turn.

Hard: Monster moves 3 spaces per turn.

Smarter Monster AI: The monster's movement logic was updated. It now takes multiple, intelligent steps in a single turn, creating a genuine threat and requiring the player to think ahead. This was implemented by looping the pathfinding logic based on the selected difficulty.

UI Overhaul: The UI flow was changed to include a start screen for difficulty selection. The main game grid is now hidden until a level is chosen.

Inside this function, a conditional (ternary) operator checks if the player's current row is even or odd.

Based on the result, it returns one of two predefined arrays of coordinate offsets ({r, c}). Each array correctly maps to the six neighbors for that row type.

This approach centralized the complex logic, making the showMovementPaths function clean and readable. It also prevented bugs that would have occurred from using a single, incorrect set of offsets for the whole grid.
