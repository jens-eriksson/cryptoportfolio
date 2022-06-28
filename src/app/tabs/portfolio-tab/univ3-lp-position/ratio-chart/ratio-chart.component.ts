import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratio-chart',
  templateUrl: './ratio-chart.component.html',
  styleUrls: ['./ratio-chart.component.scss'],
})
export class RatioChartComponent implements OnInit {
  @Input() data: any;

  constructor() {
  }

  ngOnInit() {
  }

}
