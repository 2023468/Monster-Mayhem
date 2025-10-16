document.addEventListener('DOMContentLoaded', () => {

    const gridContainer = document.getElementById('grid-container');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const restartButton = document.getElementById('restart-button');
    const gridSize = 10;

    // --- GRID GENERATION ---
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const hexagon = document.createElement('div');
            hexagon.classList.add('hexagon');
            hexagon.dataset.row = row;
            hexagon.dataset.col = col;
            if (row % 2 !== 0) {
                hexagon.style.marginLeft = '46px';
            }
            gridContainer.appendChild(hexagon);
        }
    }

    // --- GAME STATE AND LOGIC ---
    let playerPosition = { row: 5, col: 5 };
    let monsterPosition = { row: 0, col: 0 }; // Monster starts at the top-left
    let isMoveMode = false;
    let isGameOver = false;

    // --- HELPER FUNCTIONS ---
    const getHexagon = (row, col) => document.querySelector(`.hexagon[data-row='${row}'][data-col='${col}']`);
    
    const updatePlayerVisuals = () => {
        document.querySelector('.hexagon.player')?.classList.remove('player');
        getHexagon(playerPosition.row, playerPosition.col)?.classList.add('player');
    };

    //  Function to update the monster's visuals
    const updateMonsterVisuals = () => {
        document.querySelector('.hexagon.monster')?.classList.remove('monster');
        getHexagon(monsterPosition.row, monsterPosition.col)?.classList.add('monster');
    };

    const clearPaths = () => {
        document.querySelectorAll('.hexagon.path').forEach(hex => hex.classList.remove('path'));
        isMoveMode = false;
    };
    
    const getNeighborOffsets = (row) => (row % 2 === 0)
        ? [ {r:0,c:-1}, {r:0,c:1}, {r:-1,c:0}, {r:-1,c:1}, {r:1,c:0}, {r:1,c:1} ]
        : [ {r:0,c:-1}, {r:0,c:1}, {r:-1,c:-1}, {r:-1,c:0}, {r:1,c:-1}, {r:1,c:0} ];

    const showMovementPaths = () => {
        const { row, col } = playerPosition;
        isMoveMode = true;
        getNeighborOffsets(row).forEach(offset => {
            const neighborHex = getHexagon(row + offset.r, col + offset.c);
            if (neighborHex) neighborHex.classList.add('path');
        });
    };

    // ---  MONSTER AI ---
    const moveMonster = () => {
        // A simple way to calculate distance on our grid.
        const calculateDistance = (pos1, pos2) => {
            const dr = Math.abs(pos1.row - pos2.row);
            const dc = Math.abs(pos1.col - pos2.col);
            return dr + dc; // Manhattan distance - a good enough heuristic.
        };

        const monsterNeighbors = getNeighborOffsets(monsterPosition.row)
            .map(offset => ({ row: monsterPosition.row + offset.r, col: monsterPosition.col + offset.c }))
            .filter(pos => getHexagon(pos.row, pos.col)); // Only include valid neighbors on the grid

        if (monsterNeighbors.length === 0) return;

        // Find the neighbor that is closest to the player
        let bestMove = monsterNeighbors[0];
        let minDistance = calculateDistance(bestMove, playerPosition);

        for (let i = 1; i < monsterNeighbors.length; i++) {
            const distance = calculateDistance(monsterNeighbors[i], playerPosition);
            if (distance < minDistance) {
                minDistance = distance;
                bestMove = monsterNeighbors[i];
            }
        }
        
        // Update the monster's position to the best move found
        monsterPosition = bestMove;
        updateMonsterVisuals();
        checkGameOver();
    };
    
    // ---  GAME OVER LOGIC ---
    const checkGameOver = () => {
        if (playerPosition.row === monsterPosition.row && playerPosition.col === monsterPosition.col) {
            isGameOver = true;
            gameOverOverlay.classList.remove('hidden');
        }
    };
    
    const restartGame = () => {
        isGameOver = false;
        playerPosition = { row: 5, col: 5 };
        monsterPosition = { row: 0, col: 0 };
        gameOverOverlay.classList.add('hidden');
        startGame();
    };

    // --- EVENT HANDLING ---
    gridContainer.addEventListener('click', (event) => {
        if (isGameOver) return; // Stop all game logic if the game is over

        const clickedHex = event.target.closest('.hexagon');
        if (!clickedHex) return;

        const clickedRow = parseInt(clickedHex.dataset.row);
        const clickedCol = parseInt(clickedHex.dataset.col);

        if (clickedHex.classList.contains('path')) {
            playerPosition = { row: clickedRow, col: clickedCol };
            clearPaths();
            updatePlayerVisuals();
            // The monster moves right after the player moves.
            moveMonster(); 
        } else if (clickedRow === playerPosition.row && clickedCol === playerPosition.col) {
            isMoveMode ? clearPaths() : showMovementPaths();
        } else {
            clearPaths();
        }
    });
    
    restartButton.addEventListener('click', restartGame);

    // --- INITIAL GAME START ---
    const startGame = () => {
        clearPaths();
        updatePlayerVisuals();
        updateMonsterVisuals();
    };
    
    startGame();
});