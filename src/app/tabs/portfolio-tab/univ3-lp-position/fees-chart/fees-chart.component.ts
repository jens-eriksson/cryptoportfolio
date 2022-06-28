import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fees-chart',
  templateUrl: './fees-chart.component.html',
  styleUrls: ['./fees-chart.component.scss'],
})
export class FeesChartComponent implements OnInit {
  @Input() data: any;

  constructor() {
  }

  ngOnInit() {
  }

}
