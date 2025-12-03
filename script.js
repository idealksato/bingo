class BingoGame {
    constructor() {
        this.drawnNumbers = new Set();
        this.maxNumber = 75;
        this.isAnimating = false;
        
        // DOM Elements
        this.currentNumberEl = document.getElementById('current-number');
        this.currentNumberTextEl = document.getElementById('current-number-text');
        this.boardEl = document.getElementById('board');
        this.drawBtn = document.getElementById('draw-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.init();
    }

    init() {
        this.createBoard();
        this.addEventListeners();
    }

    createBoard() {
        this.boardEl.innerHTML = '';
        // Create 75 cells, 1-75
        // We want them to be ordered by column (B=1-15, I=16-30, etc.)
        // The CSS grid-auto-flow: column handles the visual layout if we just append 1-75 in order.
        for (let i = 1; i <= this.maxNumber; i++) {
            const cell = document.createElement('div');
            cell.classList.add('number-cell');
            cell.id = `cell-${i}`;
            cell.textContent = i;
            this.boardEl.appendChild(cell);
        }
    }

    addEventListeners() {
        this.drawBtn.addEventListener('click', () => this.drawNumber());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }

    drawNumber() {
        if (this.drawnNumbers.size >= this.maxNumber) {
            alert('All numbers have been drawn!');
            return;
        }
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.drawBtn.disabled = true;

        // Simple animation effect before showing the real number
        let counter = 0;
        const shuffleInterval = setInterval(() => {
            this.currentNumberEl.textContent = Math.floor(Math.random() * 75) + 1;
            counter++;
            if (counter > 10) {
                clearInterval(shuffleInterval);
                this.finalizeDraw();
            }
        }, 50);
    }

    finalizeDraw() {
        let number;
        do {
            number = Math.floor(Math.random() * this.maxNumber) + 1;
        } while (this.drawnNumbers.has(number));

        this.drawnNumbers.add(number);
        
        // Update UI
        this.currentNumberEl.textContent = number;
        this.currentNumberEl.classList.remove('animate-pop');
        void this.currentNumberEl.offsetWidth; // Trigger reflow
        this.currentNumberEl.classList.add('animate-pop');

        this.updateBoard(number);
        this.updateStatusText(number);

        this.isAnimating = false;
        this.drawBtn.disabled = false;
    }

    updateBoard(number) {
        const cell = document.getElementById(`cell-${number}`);
        if (cell) {
            cell.classList.add('active');
        }
    }

    updateStatusText(number) {
        let letter = '';
        if (number <= 15) letter = 'B';
        else if (number <= 30) letter = 'I';
        else if (number <= 45) letter = 'N';
        else if (number <= 60) letter = 'G';
        else letter = 'O';

        this.currentNumberTextEl.textContent = `${letter} - ${number}`;
    }

    resetGame() {
        if (!confirm('Are you sure you want to reset the game?')) return;

        this.drawnNumbers.clear();
        this.currentNumberEl.textContent = '--';
        this.currentNumberTextEl.textContent = 'Ready';
        
        const activeCells = document.querySelectorAll('.number-cell.active');
        activeCells.forEach(cell => cell.classList.remove('active'));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BingoGame();
});
