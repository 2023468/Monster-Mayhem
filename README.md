Monster Mayhem - Hex Grid Board
This project is a browser-based hex board game created as part of a student assessment. The primary goal was to develop a 10x10 grid of hexagons with core interactive features, all built using client-side HTML, CSS, and JavaScript

Features
Dynamic 10x10 Hexagon Grid: The game board is generated entirely by JavaScript, creating a 10x10 grid of perfectly interlocking hexagons.

Hover Highlighting: When the user's cursor moves over a hexagon, it is highlighted to provide clear visual feedback.

Select & Deselect: Users can click to select a single hexagon, which is highlighted with a distinct color. Clicking the same hexagon again or clicking another tile will deselect it.

Player Character & Movement (Challenge Task):

A player token is visually represented on the board.

Clicking the player token enters "move mode," highlighting all valid adjacent tiles.

Clicking a highlighted tile moves the player to that new position.

Clicking the player again or an invalid tile cancels "move mode."

How to Run
Clone the repository to your local machine.

Open the index.html file in any modern web browser.

No special setup or dependencies are required.

Development & Troubleshooting Notes
This section documents key technical challenges encountered and the solutions implemented, as required by the assessment criteria.

1. CSS Hexagon Creation
Problem: HTML and CSS do not have a native hexagon shape. Creating one required a non-trivial workaround.

Solution: A single hexagon was constructed from a rectangular div element and its two pseudo-elements (::before and ::after).

The main .hexagon class styles the rectangular center.

The ::before and ::after pseudo-elements are styled into triangles using CSS borders and positioned absolutely at the top and bottom of the main div.

This combination creates the illusion of a perfect hexagon.

2. Grid Generation and Alignment
Problem: A standard grid of div elements would result in gaps and misalignment. A honeycomb pattern requires rows to be staggered and overlap vertically.

Solution:

Staggering: During the JavaScript grid generation loop, a check is performed on the row number (row % 2 !== 0). For every odd row, a margin-left is applied to shift the entire row to the right by half a hexagon's width.

Vertical Overlap: The margin property on the .hexagon class was given a negative top/bottom value (-13.86px). This was calculated to be half the height of the triangular pseudo-elements, pulling the rows together vertically to eliminate any gaps.

3. Hexagon Neighbor Logic
Problem: The most complex challenge was correctly identifying the six neighbors of any given hexagon for the player movement feature. Due to the staggered grid, the relative coordinates of neighbors are different for hexagons in even rows versus odd rows.

Solution:

A getNeighborOffsets function was created.

Inside this function, a conditional (ternary) operator checks if the player's current row is even or odd.

Based on the result, it returns one of two predefined arrays of coordinate offsets ({r, c}). Each array correctly maps to the six neighbors for that row type.

This approach centralized the complex logic, making the showMovementPaths function clean and readable. It also prevented bugs that would have occurred from using a single, incorrect set of offsets for the whole grid.
