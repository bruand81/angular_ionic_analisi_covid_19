import * as d3 from 'd3';

export class ChartData {
    title: string;
    data: any[];
    chartLines: {
        field: string;
        title: string;
    }[];
    colorScheme: readonly string[];
}
