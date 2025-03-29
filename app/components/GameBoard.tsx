import { useRef, useEffect } from "react";
import { PositionMap } from "../types";

interface GameBoardProps {
  userPosition: number;
  botPosition: number;
  ladders: PositionMap;
  snakes: PositionMap;
}

export default function GameBoard({
  userPosition,
  botPosition,
  ladders,
  snakes,
}: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  // Create the board cells with the correct numbering (100 to 1)
  const createBoardCells = () => {
    const cells = [];

    // Create 10 rows (10x10 grid)
    for (let row = 0; row < 10; row++) {
      const rowCells = [];

      // Create 10 columns per row
      for (let col = 0; col < 10; col++) {
        // Calculate the cell number based on snake and ladder board pattern
        // Even rows go right to left, odd rows go left to right
        let cellNumber: number;
        if (row % 2 === 0) {
          // Even rows (0, 2, 4, 6, 8) - right to left
          cellNumber = 100 - row * 10 - col;
        } else {
          // Odd rows (1, 3, 5, 7, 9) - left to right
          cellNumber = 100 - row * 10 - 9 + col;
        }

        // Determine if this cell has user or bot
        const hasUser = userPosition === cellNumber;
        const hasBot = botPosition === cellNumber;

        // Determine if this cell is a ladder start or snake head
        const isLadderStart = Object.keys(ladders).includes(
          cellNumber.toString()
        );
        const isSnakeHead = Object.keys(snakes).includes(cellNumber.toString());

        rowCells.push(
          <div
            key={cellNumber}
            className={`cell ${hasUser || hasBot ? "active" : ""} 
                       ${isLadderStart ? "ladderStart" : ""} 
                       ${isSnakeHead ? "snakeHead" : ""}`}
            data-number={cellNumber}>
            <span className="cellNumber">{cellNumber}</span>
            {hasUser && <div className="player user"></div>}
            {hasBot && <div className="player bot"></div>}
          </div>
        );
      }

      cells.push(
        <div key={row} className="row">
          {rowCells}
        </div>
      );
    }

    return cells;
  };

  // Draw arrows for ladders and snakes
  useEffect(() => {
    if (!boardRef.current) return;

    // Clear any existing SVG
    const existingSvg = boardRef.current.querySelector("svg");
    if (existingSvg) {
      existingSvg.remove();
    }

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";

    // Draw ladders (upward arrows)
    Object.entries(ladders).forEach(([start, end]) => {
      const startCell = boardRef.current?.querySelector(
        `[data-number="${start}"]`
      );
      const endCell = boardRef.current?.querySelector(`[data-number="${end}"]`);

      if (startCell && endCell && boardRef.current) {
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const boardRect = boardRef.current.getBoundingClientRect();

        // Calculate relative positions
        const x1 = startRect.left + startRect.width / 2 - boardRect.left;
        const y1 = startRect.top + startRect.height / 2 - boardRect.top;
        const x2 = endRect.left + endRect.width / 2 - boardRect.left;
        const y2 = endRect.top + endRect.height / 2 - boardRect.top;

        // Create arrow
        const arrow = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);

        // Arrow head coordinates
        const arrowHeadLength = 10;
        const arrowHeadAngle = Math.PI / 6; // 30 degrees

        // Draw arrow path
        const path = `
          M ${x1} ${y1}
          L ${x2} ${y2}
          M ${x2 - arrowHeadLength * Math.cos(angle - arrowHeadAngle)} ${
          y2 - arrowHeadLength * Math.sin(angle - arrowHeadAngle)
        }
          L ${x2} ${y2}
          L ${x2 - arrowHeadLength * Math.cos(angle + arrowHeadAngle)} ${
          y2 - arrowHeadLength * Math.sin(angle + arrowHeadAngle)
        }
        `;

        arrow.setAttribute("d", path);
        arrow.setAttribute("fill", "none");
        arrow.setAttribute("stroke", "#4CAF50");
        arrow.setAttribute("stroke-width", "3");
        arrow.setAttribute("marker-end", "url(#arrowhead)");

        svg.appendChild(arrow);

        // Add text showing the ladder
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", ((x1 + x2) / 2).toString());
        text.setAttribute("y", ((y1 + y2) / 2).toString());
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#4CAF50");
        text.setAttribute("font-size", "12");
        text.textContent = `${start}→${end}`;

        svg.appendChild(text);
      }
    });

    // Draw snakes (downward arrows)
    Object.entries(snakes).forEach(([start, end]) => {
      const startCell = boardRef.current?.querySelector(
        `[data-number="${start}"]`
      );
      const endCell = boardRef.current?.querySelector(`[data-number="${end}"]`);

      if (startCell && endCell && boardRef.current) {
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const boardRect = boardRef.current.getBoundingClientRect();

        // Calculate relative positions
        const x1 = startRect.left + startRect.width / 2 - boardRect.left;
        const y1 = startRect.top + startRect.height / 2 - boardRect.top;
        const x2 = endRect.left + endRect.width / 2 - boardRect.left;
        const y2 = endRect.top + endRect.height / 2 - boardRect.top;

        // Create arrow with a curvy path
        const arrow = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);

        // Arrow head coordinates
        const arrowHeadLength = 10;
        const arrowHeadAngle = Math.PI / 6; // 30 degrees

        // Draw arrow path
        const path = `
          M ${x1} ${y1}
          L ${x2} ${y2}
          M ${x2 - arrowHeadLength * Math.cos(angle - arrowHeadAngle)} ${
          y2 - arrowHeadLength * Math.sin(angle - arrowHeadAngle)
        }
          L ${x2} ${y2}
          L ${x2 - arrowHeadLength * Math.cos(angle + arrowHeadAngle)} ${
          y2 - arrowHeadLength * Math.sin(angle + arrowHeadAngle)
        }
        `;

        arrow.setAttribute("d", path);
        arrow.setAttribute("fill", "none");
        arrow.setAttribute("stroke", "#F44336");
        arrow.setAttribute("stroke-width", "3");
        arrow.setAttribute("marker-end", "url(#arrowhead)");

        svg.appendChild(arrow);

        // Add text showing the snake
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", ((x1 + x2) / 2).toString());
        text.setAttribute("y", ((y1 + y2) / 2).toString());
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#F44336");
        text.setAttribute("font-size", "12");
        text.textContent = `${start}→${end}`;

        svg.appendChild(text);
      }
    });

    // Add SVG to board
    boardRef.current.appendChild(svg);
  }, [userPosition, botPosition, ladders, snakes]);

  return (
    <div className="board" ref={boardRef}>
      {createBoardCells()}
    </div>
  );
}
