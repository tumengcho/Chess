import { useEffect, useRef, useState } from "react";
import "./ChessBoard.scss";

const ChessBoard = () => {
  const [board, setBoard] = useState([
    [
      { type: "r", color: "black" },
      { type: "n", color: "black" },
      { type: "b", color: "black" },
      { type: "k", color: "black" },
      { type: "q", color: "black" },
      { type: "b", color: "black" },
      { type: "n", color: "black" },
      { type: "r", color: "black" },
    ],
    [
      { type: "p", color: "black" },
      { type: "p", color: "black" },
      { type: "p", color: "black" },
      { type: "p", color: "black" },
      { type: "p", color: "black" },
      { type: "p", color: "black" },
      { type: "p", color: "black" },
      { type: "p", color: "black" },
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      { type: "p", color: "white" },
      { type: "p", color: "white" },
      { type: "p", color: "white" },
      { type: "p", color: "white" },
      { type: "p", color: "white" },
      { type: "p", color: "white" },
      { type: "p", color: "white" },
      { type: "p", color: "white" },
    ],
    [
      { type: "r", color: "white" },
      { type: "n", color: "white" },
      { type: "b", color: "white" },
      { type: "k", color: "white" },
      { type: "q", color: "white" },
      { type: "b", color: "white" },
      { type: "n", color: "white" },
      { type: "r", color: "white" },
    ],
  ]);

  const [lastBoard, setLastBoard] = useState([]);

  let valid;

  const [playerTurn, setPlayerTurn] = useState("white");
  const [checkMate, setCheckMate] = useState("");
  const boardDisplay = [];
  const currentBoard = useRef([]);

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPieceOptions, setSelectedPieceOptions] = useState(null);
  const dangerPiece = useRef({});
  const checkMateRef = useRef("");
  const cM = useRef(false);
  const stillCm = useRef(false);

  const playerTurnRef = useRef("");

  useEffect(() => {
    const findQueenPosition = (color) => {
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        const colIndex = board[rowIndex].findIndex(
          (piece) => piece && piece.type === "q" && piece.color === color
        );
        if (colIndex !== -1) {
          return { row: rowIndex, col: colIndex };
        }
      }
      return null;
    };

    const checkMateVerifier = () => {
      if (stillCm.current === false && checkMate === "") {
        const queenPosition = findQueenPosition(playerTurn);

        currentBoard.current.forEach((row) => {
          for (const piece of row) {
            if (piece != null && piece.color != playerTurn) {
              const infPiece = {
                row: board.indexOf(row),
                col: row.indexOf(piece),
                piece: piece,
              };

              let pieceOptions = handleOptions(infPiece);
              for (const move of pieceOptions) {
                if (
                  move.col === queenPosition.col &&
                  move.row === queenPosition.row
                ) {
                  dangerPiece.current = {
                    piece: piece,
                    options: pieceOptions,
                  };
                  dangerPiece.current.options.push({
                    row: infPiece.row,
                    col: infPiece.col,
                  });
                  setCheckMate(playerTurn);
                  checkMateRef.current = playerTurn;
                  cM.current = true;
                  return;
                }
              }
            }
          }
        });
        if (cM.current) console.log("Checkmate");
      } else {
        let opp = checkMate;

        const queenPosition = findQueenPosition(opp);
        console.log("2eme");

        currentBoard.current.forEach((row) => {
          for (const piece of row) {
            if (
              piece != null &&
              piece.color != opp &&
              checkMate != playerTurn
            ) {
              const infPiece = {
                row: board.indexOf(row),
                col: row.indexOf(piece),
                piece: piece,
              };

              let pieceOptions = handleOptions(infPiece);
              for (const move of pieceOptions) {
                if (
                  move.col === queenPosition.col &&
                  move.row === queenPosition.row
                ) {
                  dangerPiece.current = {
                    piece: piece,
                    options: pieceOptions,
                  };
                  stillCm.current = true;
                  cM.current = true;
                  setCheckMate(checkMate);
                  checkMateRef.current = checkMate;
                  setBoard(lastBoard);
                  setPlayerTurn(opp);

                  break;
                } else {
                  stillCm.current = false;
                  console.log("");
                }
              }
            }
          }
        });
        if (!stillCm.current) {
          cM.current = false;
          setCheckMate("");
          checkMateRef.current = "";
        }
      }
    };

    checkMateVerifier();
    console.log("cm", cM.current, "sCm", stillCm);
    console.log(1, playerTurn, 2, checkMateRef.current);

    console.log(currentBoard.current);
  }, [currentBoard.current, stillCm.current]);

  useEffect(() => {}, [cM.current]);

  const handleOptions = (selectedPiece, save) => {
    const options = [];

    switch (selectedPiece.piece.type) {
      case "p":
        if (selectedPiece.piece.color === "black") {
          if (selectedPiece.row === 7) {
            selectedPiece.piece.type = "k";
          }

          if (selectedPiece.row + 1 < 8 && selectedPiece.col + 1 < 8) {
            if (selectedPiece.row < 3) {
              if (board[selectedPiece.row + 1][selectedPiece.col] == null) {
                options.push({
                  row: selectedPiece.row + 1,
                  col: selectedPiece.col,
                });
              } else {
                break;
              }

              if (board[selectedPiece.row + 2][selectedPiece.col] == null) {
                options.push({
                  row: selectedPiece.row + 2,
                  col: selectedPiece.col,
                });
              }
              break;
            }
            if (board[selectedPiece.row + 1][selectedPiece.col + 1] != null) {
              options.push({
                row: selectedPiece.row + 1,
                col: selectedPiece.col + 1,
              });
            }
            if (board[selectedPiece.row + 1][selectedPiece.col - 1] != null) {
              options.push({
                row: selectedPiece.row + 1,
                col: selectedPiece.col - 1,
              });
            }
            if (board[selectedPiece.row + 1][selectedPiece.col] == null) {
              options.push({
                row: selectedPiece.row + 1,
                col: selectedPiece.col,
              });
            }
          }
        } else {
          if (selectedPiece.row === 0) {
            selectedPiece.piece.type = "k";
          }
          if (selectedPiece.row - 1 > -1 && selectedPiece.col - 1 > -1) {
            if (selectedPiece.row > 5) {
              if (board[selectedPiece.row - 1][selectedPiece.col] == null) {
                options.push({
                  row: selectedPiece.row - 1,
                  col: selectedPiece.col,
                });
              } else {
                break;
              }

              if (board[selectedPiece.row - 2][selectedPiece.col] == null) {
                options.push({
                  row: selectedPiece.row - 2,
                  col: selectedPiece.col,
                });
              }
            }

            if (board[selectedPiece.row - 1][selectedPiece.col - 1] != null) {
              options.push({
                row: selectedPiece.row - 1,
                col: selectedPiece.col - 1,
              });
            }
            if (board[selectedPiece.row - 1][selectedPiece.col + 1] != null) {
              options.push({
                row: selectedPiece.row - 1,
                col: selectedPiece.col + 1,
              });
            }
            if (board[selectedPiece.row - 1][selectedPiece.col] == null) {
              options.push({
                row: selectedPiece.row - 1,
                col: selectedPiece.col,
              });
            }
          }
        }

        break;

      case "r":
        for (let i = selectedPiece.row + 1; i < 8; i++) {
          const pieceBefore = board[i][selectedPiece.col];
          if (pieceBefore !== null) {
            if (pieceBefore.color == selectedPiece.piece.color) {
              break;
            } else {
              options.push({ row: i, col: selectedPiece.col });
              break;
            }
          }
          options.push({ row: i, col: selectedPiece.col });
        }
        for (let i = selectedPiece.row - 1; i >= 0; i--) {
          const pieceBefore = board[i][selectedPiece.col];
          if (pieceBefore !== null) {
            if (pieceBefore.color == selectedPiece.piece.color) {
              break;
            } else {
              options.push({ row: i, col: selectedPiece.col });
              break;
            }
          }
          options.push({ row: i, col: selectedPiece.col });
        }

        for (let i = selectedPiece.col + 1; i < 8; i++) {
          const pieceBefore = board[selectedPiece.row][i];
          if (pieceBefore !== null) {
            if (pieceBefore.color == selectedPiece.piece.color) {
              break;
            } else {
              options.push({ row: selectedPiece.row, col: i });
              break;
            }
          }
          options.push({ row: selectedPiece.row, col: i });
        }

        for (let i = selectedPiece.col - 1; i >= 0; i--) {
          const pieceBefore = board[selectedPiece.row][i];
          if (pieceBefore !== null) {
            if (pieceBefore.color == selectedPiece.piece.color) {
              break;
            } else {
              options.push({ row: selectedPiece.row, col: i });
              break;
            }
          }
          options.push({ row: selectedPiece.row, col: i });
        }

        break;

      case "b":
        // Top-right diagonal (+row, +col)
        for (let i = 1; i < 8; i++) {
          const newRow = selectedPiece.row + i;
          const newCol = selectedPiece.col + i;

          // Check if the new position is out of bounds
          if (newRow >= 8 || newCol >= 8) break;

          const pieceBefore = board[newRow][newCol];

          // If there's a piece in the way
          if (pieceBefore !== null) {
            // If it's an opponent piece, add it to options and break
            if (pieceBefore.color !== selectedPiece.piece.color) {
              options.push({ row: newRow, col: newCol });
            }
            break; // Stop further movement in this direction
          }

          // Add empty square to options
          options.push({ row: newRow, col: newCol });
        }

        // Bottom-left diagonal (-row, -col)
        for (let i = 1; i < 8; i++) {
          const newRow = selectedPiece.row - i;
          const newCol = selectedPiece.col - i;

          // Check if the new position is out of bounds
          if (newRow < 0 || newCol < 0) break;

          const pieceBefore = board[newRow][newCol];

          // If there's a piece in the way
          if (pieceBefore !== null) {
            if (pieceBefore.color !== selectedPiece.piece.color) {
              options.push({ row: newRow, col: newCol });
            }
            break;
          }

          options.push({ row: newRow, col: newCol });
        }

        // Top-left diagonal (-row, +col)
        for (let i = 1; i < 8; i++) {
          const newRow = selectedPiece.row - i;
          const newCol = selectedPiece.col + i;

          // Check if the new position is out of bounds
          if (newRow < 0 || newCol >= 8) break;

          const pieceBefore = board[newRow][newCol];

          if (pieceBefore !== null) {
            if (pieceBefore.color !== selectedPiece.piece.color) {
              options.push({ row: newRow, col: newCol });
            }
            break;
          }

          options.push({ row: newRow, col: newCol });
        }

        // Bottom-right diagonal (+row, -col)
        for (let i = 1; i < 8; i++) {
          const newRow = selectedPiece.row + i;
          const newCol = selectedPiece.col - i;

          // Check if the new position is out of bounds
          if (newRow >= 8 || newCol < 0) break;

          const pieceBefore = board[newRow][newCol];

          if (pieceBefore !== null) {
            if (pieceBefore.color !== selectedPiece.piece.color) {
              options.push({ row: newRow, col: newCol });
            }
            break;
          }

          options.push({ row: newRow, col: newCol });
        }

        break;

      case "q":
        const queenMoves = [
          { rowDelta: -1, colDelta: 0 },
          { rowDelta: +1, colDelta: 0 },
          { rowDelta: 0, colDelta: -1 },
          { rowDelta: 0, colDelta: +1 },
          { rowDelta: -1, colDelta: -1 },
          { rowDelta: -1, colDelta: +1 },
          { rowDelta: +1, colDelta: -1 },
          { rowDelta: +1, colDelta: +1 },
        ];

        for (const move of queenMoves) {
          const newRow = selectedPiece.row + move.rowDelta;
          const newCol = selectedPiece.col + move.colDelta;

          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const pieceBefore = board[newRow][newCol];

            if (
              !pieceBefore ||
              pieceBefore.color !== selectedPiece.piece.color
            ) {
              options.push({ row: newRow, col: newCol });
            }
          }
        }

        break;

      case "n":
        if (selectedPiece.row - 2 >= 0 && selectedPiece.col - 1 >= 0) {
          const pieceBefore =
            board[selectedPiece.row - 2][selectedPiece.col - 1];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row - 2,
              col: selectedPiece.col - 1,
            });
          }
        }

        if (selectedPiece.row - 2 >= 0 && selectedPiece.col + 1 < 8) {
          const pieceBefore =
            board[selectedPiece.row - 2][selectedPiece.col + 1];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row - 2,
              col: selectedPiece.col + 1,
            });
          }
        }

        if (selectedPiece.row + 2 < 8 && selectedPiece.col - 1 >= 0) {
          const pieceBefore =
            board[selectedPiece.row + 2][selectedPiece.col - 1];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row + 2,
              col: selectedPiece.col - 1,
            });
          }
        }

        if (selectedPiece.row + 2 < 8 && selectedPiece.col + 1 < 8) {
          const pieceBefore =
            board[selectedPiece.row + 2][selectedPiece.col + 1];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row + 2,
              col: selectedPiece.col + 1,
            });
          }
        }

        if (selectedPiece.row - 1 >= 0 && selectedPiece.col - 2 >= 0) {
          const pieceBefore =
            board[selectedPiece.row - 1][selectedPiece.col - 2];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row - 1,
              col: selectedPiece.col - 2,
            });
          }
        }

        if (selectedPiece.row - 1 >= 0 && selectedPiece.col + 2 < 8) {
          const pieceBefore =
            board[selectedPiece.row - 1][selectedPiece.col + 2];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row - 1,
              col: selectedPiece.col + 2,
            });
          }
        }

        if (selectedPiece.row + 1 < 8 && selectedPiece.col - 2 >= 0) {
          const pieceBefore =
            board[selectedPiece.row + 1][selectedPiece.col - 2];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row + 1,
              col: selectedPiece.col - 2,
            });
          }
        }

        if (selectedPiece.row + 1 < 8 && selectedPiece.col + 2 < 8) {
          const pieceBefore =
            board[selectedPiece.row + 1][selectedPiece.col + 2];
          if (!pieceBefore || pieceBefore.color !== selectedPiece.piece.color) {
            options.push({
              row: selectedPiece.row + 1,
              col: selectedPiece.col + 2,
            });
          }
        }

        break;

      case "k":
        const queenDirections = [
          { rowDelta: -1, colDelta: 0 },
          { rowDelta: +1, colDelta: 0 },
          { rowDelta: 0, colDelta: -1 },
          { rowDelta: 0, colDelta: +1 },
          { rowDelta: -1, colDelta: -1 },
          { rowDelta: -1, colDelta: +1 },
          { rowDelta: +1, colDelta: -1 },
          { rowDelta: +1, colDelta: +1 },
        ];

        for (const direction of queenDirections) {
          let newRow = selectedPiece.row;
          let newCol = selectedPiece.col;

          while (true) {
            newRow += direction.rowDelta;
            newCol += direction.colDelta;

            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {
              break;
            }

            const pieceBefore = board[newRow][newCol];

            if (pieceBefore) {
              if (pieceBefore.color !== selectedPiece.piece.color) {
                options.push({ row: newRow, col: newCol });
              }
              break;
            }

            options.push({ row: newRow, col: newCol });
          }
        }

        break;

      default:
        break;
    }
    if (save) {
      setSelectedPieceOptions(options);
      return;
    } else {
      return options;
    }
  };
  const handleClick = (rowIndex, colIndex, piece) => {
    if (!selectedPiece) {
      if (board[rowIndex][colIndex]) {
        setSelectedPiece({
          row: rowIndex,
          col: colIndex,
          piece: piece,
        });
        const infPiece = {
          row: rowIndex,
          col: colIndex,
          piece: piece,
        };

        handleOptions(infPiece, true);
      }
    } else {
      handleMove(rowIndex, colIndex, selectedPiece.piece);
    }
  };

  const handleMove = (rowIndex, colIndex, piece) => {
    let authorized = false;
    let opposingColor =
      selectedPiece.piece.color === "black" ? "white" : "black";

    if (selectedPieceOptions) {
      for (const move of selectedPieceOptions) {
        if (move.row === rowIndex && move.col === colIndex) {
          authorized = true;
          break;
        }
      }
    }

    if (cM.current === false && stillCm.current === false) {
      console.log(140);

      if (
        authorized &&
        playerTurn === selectedPiece.piece.color &&
        selectedPieceOptions.length > 0
      ) {
        movePiece(selectedPiece, { row: rowIndex, col: colIndex });
        setPlayerTurn(opposingColor);
        setSelectedPiece(null);
        setSelectedPieceOptions(null);
      } else {
        setSelectedPiece(null);
        setSelectedPieceOptions(null);
      }
    } else {
      console.log(141);

      let qNotAuthorized = false;
      let defend = false;
      let eatable = false;

      for (const move of dangerPiece.current.options) {
        if (
          (colIndex === move.col && rowIndex === move.row) ||
          rowIndex === dangerPiece.current
        ) {
          qNotAuthorized = false;
          defend = true;
          break;
        }
      }

      if (selectedPiece.piece.type !== "q") {
        if (
          defend &&
          authorized &&
          dangerPiece.current.options.some(
            (option) => option.row === rowIndex && option.col === colIndex
          )
        ) {
          movePiece(selectedPiece, { row: rowIndex, col: colIndex });

          setPlayerTurn(opposingColor);

          setSelectedPiece(null);
          setSelectedPieceOptions(null);
        } else {
          setSelectedPiece(null);
          setSelectedPieceOptions(null);
        }
      } else {
        if (
          !authorized ||
          !dangerPiece.current.options.some(
            (option) => option.row === rowIndex && option.col === colIndex
          )
        ) {
          setSelectedPiece(null);
          setSelectedPieceOptions(null);
        } else {
          movePiece(selectedPiece, { row: rowIndex, col: colIndex });
          setPlayerTurn(opposingColor);

          setSelectedPiece(null);
          setSelectedPieceOptions(null);
        }
      }
    }
  };

  const movePiece = (from, to) => {
    const lastBoard = board.map((row) => [...row]);
    const newBoard = board.map((row) => [...row]);
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;
    currentBoard.current = newBoard;
    setLastBoard(board);
    setBoard(newBoard);
  };

  const Piece = (piece) => {
    if (piece.color === "black") {
      return "/img/black/" + piece.type + ".png";
    }

    return "/img/white/" + piece.type + ".png";
  };
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      const isBlack = (i + j) % 2 === 1;
      const isOption =
        selectedPieceOptions &&
        selectedPieceOptions.some(
          (option) => option.row === i && option.col === j
        );
      const isSelected =
        selectedPiece && selectedPiece.col === j && selectedPiece.row === i;
      row.push(
        <div
          className={`place ${isBlack ? "black" : "white"} ${
            isSelected ? "selected" : ""
          } ${isOption ? "option" : ""}`}
          onClick={() => handleClick(i, j, piece)}
          key={j}
        >
          {piece != null ? <img src={Piece(piece)} alt="" /> : ""}
        </div>
      );
    }

    boardDisplay.push(
      <div className="row" key={i}>
        {row}
      </div>
    );
  }
  return (
    <>
      <div className="chess-wrapper">
        <div className="info">
          <h1
            className={`player-turn ${
              playerTurn === "black" ? "player-two" : "player-one"
            }`}
          >
            {playerTurn === "black" ? "Joueur 2" : "Joueur 1"}
          </h1>
          <p
            className={`status ${
              cM.current || stillCm.current ? "danger" : "safe"
            }`}
          >
            {cM.current || stillCm.current ? "Echec" : ""}
          </p>
        </div>

        <div className={`board ${playerTurn == "black" ? "rotate-board" : ""}`}>
          {boardDisplay}
        </div>
      </div>
    </>
  );
};

export default ChessBoard;
