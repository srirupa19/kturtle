import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TurtleService {
  private x: number = 250; 
  private y: number = 250;
  private direction: number = 0;
  private isPenDown: boolean = true;
  private penWidth: number = 1;
  private penColor: string = 'black';
  public animationSpeed: number = 5;
  private strokes: { 
    startX: number; 
    startY: number; 
    endX: number; 
    endY: number; 
    color: string; 
    width: number; 
    penDown: boolean;
  }[] = [];

  public isAnimationInProgress: boolean = false;
  private triangleVertices: [number, number, number, number, number, number] = [20, 0, 0, -10, 0, 10];

  constructor() {
    this.initializeTurtle();
  }

  async executeCommand(command: string): Promise<void> {

    this.initializeTurtle();
    const lines = command.split('\n');

    const canvas: HTMLCanvasElement | null = document.querySelector('#turtleCanvas');

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }


    let newX: number = this.x;
    let newY: number = this.y;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        continue;
      }

      const parts = trimmedLine.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');
      const argsWithoutSpaces = arg.replace(/\s/g, '');

      const numberOfArgs_ = argsWithoutSpaces.split(',').map(arg => arg.trim());
      const numberOfArgs = numberOfArgs_.filter(item => item !== '');

      const allowedCommands: string[] = [
        "forward",
        "backward",
        "turnleft",
        "turnright",
        "direction",
        "center",
        "go",
        "gox",
        "goy",
        "penup",
        "pendown",
        "penwidth",
        "pencolor"
      ];

      if (!allowedCommands.includes(cmd)) {
        throw new Error(`Unknown command: ${cmd}`);
      }

      const expectedArgsCount = this.getExpectedArgsCount(cmd);
      if (numberOfArgs.length !== expectedArgsCount) {
        throw new Error(`Incorrect number of arguments for '${cmd}' command. Expected ${expectedArgsCount}, got ${numberOfArgs.length}.`);
      }

      const ctx = canvas?.getContext('2d');

      switch (cmd) {
        case 'forward':
          const distance = parseInt(arg, 10);
          if (isNaN(distance)) {
            throw new Error(`Incorrect argument type for 'forward' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + distance) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          newX = this.x + distance * Math.sin(this.direction * (Math.PI / 180));
          newY = this.y - distance * Math.cos(this.direction * (Math.PI / 180));
          if (ctx) {
            await this.animateLine(ctx, this.x, this.y, newX, newY, this.penColor, this.penWidth, this.isPenDown);
          }
          this.x = newX;
          this.y = newY;
          // this.move(distance);
          break;
        case 'backward':
          const backwardDistance = parseInt(arg, 10);
          if (isNaN(backwardDistance)) {
            throw new Error(`Incorrect argument type for 'backward' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + backwardDistance) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          newX = this.x - backwardDistance * Math.sin(this.direction * (Math.PI / 180));
          newY = this.y + backwardDistance * Math.cos(this.direction * (Math.PI / 180));
          if (ctx) {
            await this.animateLine(ctx, this.x, this.y, newX, newY, this.penColor, this.penWidth, this.isPenDown);
          }
          this.x = newX;
          this.y = newY;
          // this.move(-backwardDistance);
          break;
        case 'turnleft':
          const angleLeft = parseInt(arg, 10);
          if (isNaN(angleLeft)) {
            throw new Error(`Incorrect argument type for 'turnleft' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + angleLeft) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.direction -= angleLeft;
          if (ctx) {
            this.redrawTriangle(ctx, newX, newY);
          }
          break;
        case 'turnright':
          const angleRight = parseInt(arg, 10);
          if (isNaN(angleRight)) {
            throw new Error(`Incorrect argument type for 'turnright' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + angleRight) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.direction += angleRight;
          if (ctx) {
            this.redrawTriangle(ctx, newX, newY);
          }
          break;
        case 'direction':
          const newDirection = parseInt(arg, 10);
          if (isNaN(newDirection)) {
            throw new Error(`Incorrect argument type for 'direction' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + newDirection) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.direction = newDirection;
          if (ctx) {
            this.redrawTriangle(ctx, newX, newY);
          }
          break;
        case 'center':
          if (trimmedLine !== cmd) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.goToCenter();
          if (ctx) {
            this.redrawTriangle(ctx, 250, 250);
          }
          break;
        case 'go':
          const coordinateArgs = arg.split(',').map(arg => arg.trim());
          if (coordinateArgs.length !== 2) {
            throw new Error(`Incorrect number of arguments for 'go' command: ${arg}`);
          }
          const newXcoord = parseInt(coordinateArgs[0], 10);
          const newYcoord = parseInt(coordinateArgs[1], 10);
          if (isNaN(newXcoord) || isNaN(newYcoord)) {
            throw new Error(`Incorrect argument type for 'go' command: ${arg}`);
          }
          if (cmd + ' ' + argsWithoutSpaces !== cmd + ' ' + newXcoord+ ',' + newYcoord) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          await this.goTo(newXcoord, newYcoord);
          if (ctx) {
            this.redrawTriangle(ctx, newXcoord, newYcoord);
          }
          break;
        case 'gox':
          const newXAxis = parseInt(arg, 10);
          if (isNaN(newXAxis)) {
            throw new Error(`Incorrect argument type for 'gox' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + newXAxis) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.goToX(newXAxis);
          if (ctx) {
            this.redrawTriangle(ctx, newXAxis, this.y);
          }
          break;
        case 'goy':
          const newYAxis = parseInt(arg, 10);
          if (isNaN(newYAxis)) {
            throw new Error(`Incorrect argument type for 'goy' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + newYAxis) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.goToY(newYAxis);
          if (ctx) {
            this.redrawTriangle(ctx, this.x, newYAxis);
          }
          break;
        case 'penup':
          if (trimmedLine !== cmd) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.penUp();
          break;
        case 'pendown':
          if (trimmedLine !== cmd) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.penDown();
          break;
        case 'penwidth':
          const newPenWidth = parseInt(arg, 10);
          if (isNaN(newPenWidth)) {
            throw new Error(`Incorrect argument type for 'penwidth' command: ${arg}`);
          }
          if (trimmedLine !== cmd + ' ' + newPenWidth) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.setPenWidth(newPenWidth);
          break;
        case 'pencolor':
          const colorArgs = arg.split(',').map(arg => arg.trim());
          if (colorArgs.length !== 3) {
            throw new Error(`Incorrect number of arguments for 'pencolor' command: ${arg}`);
          }
          const r = parseInt(colorArgs[0], 10);
          const g = parseInt(colorArgs[1], 10);
          const b = parseInt(colorArgs[2], 10);
          if (isNaN(r) || isNaN(g) || isNaN(b)) {
            throw new Error(`Incorrect argument type for 'pencolor' command: ${arg}`);
          }
          if (cmd + ' ' + argsWithoutSpaces !== cmd + ' ' + r + ',' + g + ',' + b) {
            throw new Error(`Unexpected text after parsing '${cmd}' command: '${trimmedLine}'`);
          }
          this.setPenColor(r, g, b);
          break;
        default:
          throw new Error(`Unknown command: ${cmd}`);
      }

    }
    
  }

  


  private drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number): void {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate((angle - 90) * (Math.PI / 180));

    ctx.beginPath();
    ctx.moveTo(this.triangleVertices[0], this.triangleVertices[1]);
    ctx.lineTo(this.triangleVertices[2], this.triangleVertices[3]);
    ctx.lineTo(this.triangleVertices[4], this.triangleVertices[5]);
    ctx.closePath();

    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
  
  private async animateLine(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
    width: number,
    penDown: boolean
  ): Promise<void> {
    this.isAnimationInProgress = true;
    const animationSpeed = this.animationSpeed;
    const duration = 1000 / animationSpeed; 
  
    return new Promise<void>((resolve) => {
      const startTime = performance.now();
      const drawFrame = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1); 
  
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
  
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
        for (let i = 0; i < this.strokes.length; i++) {
          const stroke = this.strokes[i];
          if (stroke.penDown) {
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width;
            ctx.beginPath();
            ctx.moveTo(stroke.startX, stroke.startY);
            ctx.lineTo(stroke.endX, stroke.endY);
            ctx.stroke();
          }
        }
  
        this.drawTriangle(ctx, currentX, currentY, this.direction);
  
        if (penDown) {
          this.strokes.push({ startX, startY, endX: currentX, endY: currentY, color, width, penDown });
        }
  
        if (progress < 1) {
          requestAnimationFrame(drawFrame);
        } else {
          this.isAnimationInProgress = false;
          resolve();
        }
      };
  
      requestAnimationFrame(drawFrame);
    });
  }
  
  
  private redrawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    for (const stroke of this.strokes) {
      if (stroke.penDown) {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.beginPath();
        ctx.moveTo(stroke.startX, stroke.startY);
        ctx.lineTo(stroke.endX, stroke.endY);
        ctx.stroke();
      }
    }
  
    this.drawTriangle(ctx, x, y, this.direction);
  }


  private goToCenter(): void {
    this.x = 250; 
    this.y = 250;
  }

  private async goTo(newX: number, newY: number): Promise<void> {
    return new Promise<void>((resolve) => {
        this.x = newX;
        this.y = newY;
        resolve();
    });
}
  private goToX(newX: number): void {
    this.x = newX;
  }

  private goToY(newY: number): void {
    this.y = newY;
  }

  private penUp(): void {
    this.isPenDown = false;
  }

  private penDown(): void {
    this.isPenDown = true;
  }

  private setPenWidth(width: number): void {
    this.penWidth = width;
  }

  private setPenColor(r: number, g: number, b: number): void {
    this.penColor = `rgb(${r},${g},${b})`;
  }

  resetTurtlePosition(): void {
    this.initializeTurtle();
  }

  initializeTurtle(): void {
    const canvas: HTMLCanvasElement | null = document.querySelector('#turtleCanvas');

    this.x = 250; 
    this.y = 250;
    this.direction = 0;
    this.isPenDown = true;
    this.penWidth = 1;
    this.penColor = 'black';
    this.strokes = [];
    this.triangleVertices = [20, 0, 0, -10, 0, 10];
    
  
    if (canvas) {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
  
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawTriangle(ctx, this.x, this.y, this.direction);
      }
    }

  }

  private getExpectedArgsCount(command: string): number {
    const expectedArgs: { [key: string]: number } = {
      'forward': 1,
      'backward': 1,
      'turnleft': 1,
      'turnright': 1,
      'direction': 1,
      'center': 0,
      'go': 2,
      'gox': 1,
      'goy': 1,
      'penup': 0,
      'pendown': 0,
      'penwidth': 1,
      'pencolor': 3,
    };

    return expectedArgs[command] || 0;
  }

}
