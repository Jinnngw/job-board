import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

interface Job {
  id: number;
  title: string;
  by: string;
  time: number;
  url?: string;
}

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.scss']
})
export class JobBoardComponent implements OnInit {
  jobIds: number[] = [];  
  jobs: Job[] = [];  
  currentPage = 0;
  pageSize = 6;
  isLoading = false;

  constructor(private http: HttpClient,private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.fetchJobIds();
  }

  async fetchJobIds() {
    this.http.get<number[]>('https://hacker-news.firebaseio.com/v0/jobstories.json')
      .subscribe(ids => {
        this.jobIds = ids;
        this.loadMore();
      });
  }

  loadMore() {
    if (this.isLoading) return;
    this.isLoading = true;
  
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    
    const jobRequests = this.jobIds.slice(start, end).map(id =>
      this.http.get<Job>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    );
  
    Promise.all(jobRequests.map(req => req.toPromise()))
      .then(jobDetails => {
        this.jobs.push(...jobDetails.filter((job): job is Job => job !== null && job !== undefined)); 
        this.currentPage++;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  
  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); 
    return this.datePipe.transform(date, 'M/d/yyyy, h:mm:ss a')!;
  }
}
