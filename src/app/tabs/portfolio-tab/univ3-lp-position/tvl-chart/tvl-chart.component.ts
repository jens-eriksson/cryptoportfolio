import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tvl-chart',
  templateUrl: './tvl-chart.component.html',
  styleUrls: ['./tvl-chart.component.scss'],
})
export class TvlChartComponent implements OnInit {
  @Input() data: any;

  constructor() {
  }

  ngOnInit() {
  }

}
