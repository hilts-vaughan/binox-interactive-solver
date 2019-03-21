const EMPTY_ELEMENT = '-';
const X_ELEMENT = 'X';
const O_ELEMENT = 'O';

const TRANSITION_TABLE = {
  [EMPTY_ELEMENT]: X_ELEMENT,
  [X_ELEMENT]: O_ELEMENT,
  [O_ELEMENT]: EMPTY_ELEMENT
};

// There is no depends. here, just native DOM calls since that is all that is needed
document.addEventListener('DOMContentLoaded', function(event) {
  const $sizeSettings = document.getElementById('setting-width');
  const $gameplayTable = document.getElementById('gameplay-table');
  const $solveButton = document.getElementById('solve-button');
  const $clearButton = document.getElementById('clear-button');

  const redrawBoard = (newSize, buffer = []) => {
    $gameplayTable.innerHTML = ''; // slow but simple to do

    for (var j = 0; j < newSize; j++) {
      const x = $gameplayTable.insertRow(-1);
      for (var i = 0; i < newSize; i++) {
        let currentValue = EMPTY_ELEMENT;

        if (buffer[j] && buffer[j][i]) {
          currentValue = buffer[j][i];
          currentValue = currentValue === '1' ? X_ELEMENT : O_ELEMENT;
        }

        x.insertCell(i).innerHTML = currentValue;
      }
    }
  };

  /**
   * This function will throw if it gets some kind of illegal input that cannot
   * be serailized
   */
  const getSerializedBoardForInput = () => {
    const binaryMatrix = Array.from($gameplayTable.rows).map(row => {
      return Array.from(row.cells).reduce((acc, node, currentIndex) => {
        const currentValue = node.innerHTML;
        return (acc += currentValue);
      }, '');
    });

    return binaryMatrix.join('\n');
  };

  $sizeSettings.addEventListener('change', () => {
    const newBoardSize = parseInt($sizeSettings.value, 10);

    if (newBoardSize === NaN) {
      alert('You must provide a valid board size. Change your input to something legal.');
      return;
    }

    redrawBoard(newBoardSize);
  });

  $gameplayTable.addEventListener('click', event => {
    const actualTarget = event.target;
    const destination = TRANSITION_TABLE[actualTarget.innerHTML];

    if (destination) {
      actualTarget.innerHTML = destination;
    }
  });

  $clearButton.addEventListener('click', () => {
    const newBoardSize = parseInt($sizeSettings.value, 10);
    redrawBoard(newBoardSize);
  });

  $solveButton.addEventListener('click', () => {
    try {
      // The replace is for the custom format in the binary string on the board
      const matrix = getSerializedBoardForInput()
        .replace(/X/g, '1')
        .replace(/O/g, '0')
        .replace(/-/g, 'X');

      const board = BinoxSolver.board.fromBoardBinaryString(matrix);
      const solver = new BinoxSolver.solver();
      const solvedBoard = solver.solve(board);

      // Now with the board, we can take the buffer and draw it out :O
      redrawBoard(solvedBoard.getLength(), solvedBoard.buffer);
    } catch (e) {
      alert('There was an error solving the board. Did you fill in a valid board?');
      console.error(e);
    }
  });

  // main
  redrawBoard(6);
});
