import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor2DDirective } from '../ng-for-2d.directive';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, NgFor2DDirective],
  templateUrl: './game.component.svg',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy {


  width = 1920;
  height = 1080;
  cellSize = this.width / 60;

  mouseDown = false;

  interval: number = 0;

  get rows() {
    return this.height / this.cellSize;
  }

  get cols() {
    return this.width / this.cellSize;
  }

  cells: boolean[][] = [];

  tick = 0;
  cooldown = 0;

  ngOnInit(): void {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.cells[y] = this.cells[y] || [];
        this.cells[y][x] = false;
      }
    }
    this.interval = setInterval(() => this.gameLoop(), 100);
  }

  mouseEnter(row: number, col: number) {
    if (this.mouseDown) {
      this.cells[row][col] = true;
      this.cooldown = 50;
    }
  }

  mouseClick(row: number, col: number) {
    this.cells[row][col] = !this.cells[row][col];
    this.cooldown = 50;
  }

  gameLoop() {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }
    if (!this.mouseDown) {
      this.tick++;
      const newCells: boolean[][] = [];
      for (let y = 0; y < this.rows; y++) {
        newCells[y] = [];
        for (let x = 0; x < this.cols; x++) {
          const neighbors = this.countNeighbors(y, x);
          if (this.cells[y][x]) {
            // Any live cell with fewer than two live neighbors dies
            // Any live cell with two or three live neighbors lives
            // Any live cell with more than three live neighbors dies
            newCells[y][x] = neighbors === 2 || neighbors === 3;
          } else {
            // Any dead cell with exactly three live neighbors becomes a live cell
            newCells[y][x] = neighbors === 3;
          }
        }
      }
      this.cells = newCells;
    }

  }

  countNeighbors(row: number, col: number) {
    let count = 0;
    for (let y = row - 1; y <= row + 1; y++) {
      for (let x = col - 1; x <= col + 1; x++) {
        if (y >= 0 && y < this.rows && x >= 0 && x < this.cols && !(y === row && x === col)) {
          count += this.cells[y][x] ? 1 : 0;
        }
      }
    }
    return count;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.interval = 0;
  }
}
