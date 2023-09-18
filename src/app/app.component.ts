import { Component, OnInit } from '@angular/core';
import { TurtleService } from './turtle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  commandInput: string = '';
  canvasWidth: number = 500;
  canvasHeight: number = 500;
  executionResult: string = '';
  animationSpeed: number = 2;
  title: string = 'kurtle-clone'

  editorConfig = {
    toolbar: [],
    lineNumbers: true, 
  };

  constructor(public turtleService: TurtleService) {}
  ngOnInit(): void {
    this.turtleService.initializeTurtle();
    this.animationSpeed = this.turtleService.animationSpeed;
  }

  async executeCommand(): Promise<void> {
    try {
      await this.turtleService.executeCommand(this.commandInput);
      this.executionResult = 'Code executed without any errors.';
    } catch (error) {
      this.executionResult = String(error);
    }
  }

  onSpeedChange(): void {
    this.turtleService.animationSpeed = this.animationSpeed;
  }

  clearTextArea(): void {
    this.turtleService.resetTurtlePosition();
    this.commandInput = ''; 
    this.executionResult = '';
  }

  
}
