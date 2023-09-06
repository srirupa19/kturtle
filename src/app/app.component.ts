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

  editorConfig = {
    toolbar: [],
    lineNumbers: true, // Enable line numbers
  };

  constructor(public turtleService: TurtleService) {}
  ngOnInit(): void {
    this.turtleService.initializeTurtle();
  }

  async executeCommand(): Promise<void> {
    // this.turtleService.executeCommand(this.commandInput);
    // this.commandInput = '';

    try {
      // Attempt to execute the command
      await this.turtleService.executeCommand(this.commandInput);

      // If successful, set executionResult to a success message
      this.executionResult = 'Code executed without any errors.';
    } catch (error) {
      // If there's an error, set executionResult to the error message
      // this.executionResult = error.message;
      this.executionResult = String(error);
    }
  }

  clearTextArea(): void {
    this.turtleService.resetTurtlePosition();
    this.commandInput = ''; // Clear the text area
    this.executionResult = '';
  }

  
}
