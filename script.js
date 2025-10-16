document.addEventListener('DOMContentLoaded', () => {

    const gridContainer = document.getElementById('grid-container');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const restartButton = document.getElementById('restart-button');
    const difficultySelection = document.getElementById('difficulty-selection');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
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
    let monsterPosition = { row: 0, col: 0 };
    let monsterMovesPerTurn = 1; // Default to Easy
    let isMoveMode = false;
    let isGameOver = false;

    // --- HELPER FUNCTIONS ---
    const getHexagon = (row, col) => document.querySelector(`.hexagon[data-row='${row}'][data-col='${col}']`);
    
    const updatePlayerVisuals = () => {
        document.querySelector('.hexagon.player')?.classList.remove('player');
        getHexagon(playerPosition.row, playerPosition.col)?.classList.add('player');
    };

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

    // --- MONSTER AI ---
    const moveMonster = () => {
        // This function will now loop based on the difficulty setting.
        for (let i = 0; i < monsterMovesPerTurn; i++) {
            // Find the best single step from the monster's CURRENT position.
            const calculateDistance = (pos1, pos2) => Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);

            const monsterNeighbors = getNeighborOffsets(monsterPosition.row)
                .map(offset => ({ row: monsterPosition.row + offset.r, col: monsterPosition.col + offset.c }))
                .filter(pos => getHexagon(pos.row, pos.col)); 

            if (monsterNeighbors.length === 0) return;

            let bestMove = monsterNeighbors[0];
            let minDistance = calculateDistance(bestMove, playerPosition);

            for (let j = 1; j < monsterNeighbors.length; j++) {
                const distance = calculateDistance(monsterNeighbors[j], playerPosition);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestMove = monsterNeighbors[j];
                }
            }
            
            // Update the monster's position for the next step in the loop.
            monsterPosition = bestMove;
            
            // Check for game over after each individual step.
            if (checkGameOver()) return;
        }
        // Update the final visuals after all moves are calculated.
        updateMonsterVisuals();
    };
    
    // --- GAME OVER AND RESTART LOGIC ---
    const checkGameOver = () => {
        if (playerPosition.row === monsterPosition.row && playerPosition.col === monsterPosition.col) {
            isGameOver = true;
            gameOverOverlay.classList.remove('hidden');
            return true; // Return true to stop the monster's movement loop
        }
        return false;
    };
    
    const restartGame = () => {
        isGameOver = false;
        gameOverOverlay.classList.add('hidden');
        gridContainer.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
    };

    // --- EVENT HANDLING ---
    gridContainer.addEventListener('click', (event) => {
        if (isGameOver) return;

        const clickedHex = event.target.closest('.hexagon');
        if (!clickedHex) return;

        const clickedRow = parseInt(clickedHex.dataset.row);
        const clickedCol = parseInt(clickedHex.dataset.col);

        if (clickedHex.classList.contains('path')) {
            playerPosition = { row: clickedRow, col: clickedCol };
            clearPaths();
            updatePlayerVisuals();
            moveMonster(); 
        } else if (clickedRow === playerPosition.row && clickedCol === playerPosition.col) {
            isMoveMode ? clearPaths() : showMovementPaths();
        } else {
            clearPaths();
        }
    });
    
    restartButton.addEventListener('click', restartGame);
    
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            monsterMovesPerTurn = parseInt(button.dataset.difficulty);
            difficultySelection.classList.add('hidden');
            gridContainer.classList.remove('hidden');
            startGame();
        });
    });

    // --- INITIAL GAME START ---
    const startGame = () => {
        isGameOver = false;
        playerPosition = { row: 5, col: 5 };
        monsterPosition = { row: 0, col: 0 };
        clearPaths();
        updatePlayerVisuals();
        updateMonsterVisuals();
    };
});