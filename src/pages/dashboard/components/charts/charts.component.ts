import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartsService } from '../../services/charts/charts.service';

/**
 * get all charts data to display on charts page from the charts service
 */
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  @ViewChild('bar', null) public barCanvas: ElementRef;
  @ViewChild('line', null) public lineCanvas: ElementRef;
  @ViewChild('pie', null) public pieCanvas: ElementRef;
  @ViewChild('doughnut', null) public doughnutCanvas: ElementRef;

  public barChart: any;
  public lineChart: any;
  public doughnutChart: any;
  public pieChart: any;

  constructor(private chartsService: ChartsService) {}

  /** get all charts data to display on charts page from the charts service */
  public ngOnInit() {
    this.barChart = this.chartsService.createBarChart(this.barCanvas.nativeElement);
    this.doughnutChart = this.chartsService.createDoughnutChart(this.doughnutCanvas.nativeElement);
    this.lineChart = this.chartsService.createLineChart(this.lineCanvas.nativeElement);
    this.pieChart = this.chartsService.createPieChart(this.pieCanvas.nativeElement);
  }
}
