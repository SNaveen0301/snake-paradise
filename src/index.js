import "./styles.css";
import _ from "lodash";
import $ from "jquery";

const width = 16;
const height = 16;
class Snake {
  body = [
    [8, 8],
    [8, 9],
    [8, 10],
    [8, 11],
    [8, 12],
    [8, 13],
    [8, 14]
  ];
  previousHeading = "N";
  currentHeading = "N";
  movementMapper = {
    N: (x, y) => [x, --y],
    S: (x, y) => [x, ++y],
    E: (x, y) => [++x, y],
    W: (x, y) => [--x, y]
  };
  isAlive = true;
  canMove = true;

  move = () => {
    const [x, y] = _.first(this.body);
    const newCell = this.movementMapper[this.currentHeading](x, y);
    this.isAlive =
      newCell[0] >= 0 &&
      newCell[1] >= 0 &&
      _.isEmpty(
        _.filter(
          _.take(this.body, _.size(this.body) - 1),
          (cell) => cell[0] === newCell[0] && cell[1] === newCell[1]
        )
      );
    if (!this.isAlive) return;
    this.body = [newCell, ..._.take(this.body, _.size(this.body) - 1)];
  };

  setTurn = (heading) => {
    if (!this.isAlive || !this.canMove) return;
    this.canMove = false;
    this.currentHeading = heading;
  };
}

const snake = new Snake();
$(document).focus();
$(document).keyup((e) => {
  const directions = { 37: "W", 38: "N", 39: "E", 40: "S" };
  const opposites = { N: "S", S: "N", E: "W", W: "E" };

  snake.setTurn(
    _.keys(directions).includes(String(e.which)) &
      (opposites[snake.currentHeading] !== directions[e.which])
      ? directions[e.which]
      : snake.currentHeading
  );
});
const renderGrid = () => {
  $("#grid").empty();
  for (let y = 0; y < height; y++) {
    $("#grid").append(`<div class='row' id='row-${y}'/>`);
    for (let x = 0; x < width; x++) {
      const [bX, bY] = snake.body[0];
      const isSnakeHead = x === bX && y === bY;
      const isSnakeBody =
        _.filter(_.tail(snake.body), (p) => p[0] === x && p[1] === y).length >
        0;
      const classes = `${isSnakeHead ? "snake-head" : null} ${
        isSnakeBody ? "snake-body" : null
      }`;
      const isGrid = !isSnakeHead && !isSnakeBody;
      $(`#row-${y}`).append(
        `<div class='cell ${classes} ${
          !snake.isAlive && isGrid ? "dead" : ""
        }'/>`
      );
    }
  }
  $(document).focus();
};

$(document).ready(() => {
  renderGrid();
  setInterval(() => {
    snake.move();
    renderGrid();
    snake.canMove = true;
  }, _.max([1000 - _.size(snake.body) * 100, 350]));
});
