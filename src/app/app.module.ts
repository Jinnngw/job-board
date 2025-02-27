import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { DatePipe } from '@angular/common'; 


@NgModule({
  declarations: [AppComponent, JobBoardComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
