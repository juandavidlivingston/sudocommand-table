// Libraries
import React, { Component } from 'react';

// Types
import { PanelProps } from '@grafana/data';
import { Options } from './types';
import _ from 'lodash';

interface Props extends PanelProps<Options> {}

const marginBottom = 30;

export class TablePanel extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { data, height, width, options } = this.props;

    if (data.series.length < 1) {
      return <div>No Table Data...</div>;
    }

    console.log({ data, height, width, options });
    const series = data.series
      .map(item => {
        return {
          name: item.name,
          value: Math.max(...item.fields[0].values.toArray()),
        };
      })
      .sort((a, b) => {
        if (a.value < b.value) {
          return 1;
        }
        if (a.value > b.value) {
          return -1;
        }
        return 0;
      })
      .map((item, index, arr) => {
        const percentage = item.value * (1 / arr[0].value) * 100;
        return { ...item, percentage: percentage.toFixed(2) };
      });

    return (
      <div className="table-panel-container">
        <div className="table-panel-header-bg"></div>
        <div className="table-panel-scroll" style={{ maxHeight: height, width }}>
          <table className="table-panel-table" style={{ marginBottom }}>
            <thead>
              <tr>
                <th>
                  <div className="table-panel-table-header-inner pointer">Name</div>
                </th>
                <th>
                  <div className="table-panel-table-header-inner pointer">Value</div>
                </th>
                <th>
                  <div className="table-panel-table-header-inner pointer">Percentage</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {series.map(item => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                    <td>{item.percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
