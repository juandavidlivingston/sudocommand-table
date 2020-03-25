// Libraries
import React, { useState, useEffect } from 'react';

// Types
import { PanelProps } from '@grafana/data';
import { Options } from './types';
import _ from 'lodash';
import { round } from 'mathjs';

interface Props extends PanelProps<Options> {}

const marginBottom = 30;

export const TablePanel = ({ data, height, width, options }: Props) => {
  const [series, setSeries] = useState([]);
  const [sorted, setSorted] = useState({ field: '', order: '' });

  const sortedByField = (field: string) => {
    let dataProcessed: any = [];
    let order = 'desc';

    if (field !== sorted.field) {
      setSorted({ field, order: '' });
    }

    switch (sorted.order) {
      case '':
        order = 'desc';
        dataProcessed = _.sortBy(series, field).reverse();
        break;
      case 'desc':
        order = 'asc';
        dataProcessed = _.sortBy(series, field);
        break;
      case 'asc':
        order = '';
        dataProcessed = _.sortBy(series, field);
        break;

      default:
        break;
    }
    setSorted({ field, order });
    setSeries(dataProcessed);
  };

  const applyFieldOverrides = () => {
    return data.series
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
        return { name: item.name ? item.name : '', value: item.value, percentage: round(percentage, 2) };
      });
  };

  useEffect(() => {
    const dataProcessed: any = applyFieldOverrides();
    console.log(dataProcessed);
    setSeries(dataProcessed);
  }, [data, options]);

  if (series.length < 1) {
    return <div>No Table Data...</div>;
  }

  return (
    <div className="table-panel-container">
      <div className="table-panel-header-bg"></div>
      <div className="table-panel-scroll" style={{ maxHeight: height, width }}>
        <table className="table-panel-table" style={{ marginBottom }}>
          <thead>
            <tr>
              <th>
                <div className="table-panel-table-header-inner pointer" onClick={() => sortedByField('name')}>
                  Name
                  <span className="table-panel-table-header-controls" style={{ marginLeft: '10px' }}>
                    {sorted.field === 'name' && sorted.order === 'desc' && <i className="fa fa-caret-down"></i>}
                    {sorted.field === 'name' && sorted.order === 'asc' && <i className="fa fa-caret-up"></i>}
                  </span>
                </div>
              </th>
              <th>
                <div className="table-panel-table-header-inner pointer" onClick={() => sortedByField('value')}>
                  Value
                  <span className="table-panel-table-header-controls" style={{ marginLeft: '10px' }}>
                    {sorted.field === 'value' && sorted.order === 'desc' && <i className="fa fa-caret-down"></i>}
                    {sorted.field === 'value' && sorted.order === 'asc' && <i className="fa fa-caret-up"></i>}
                  </span>
                </div>
              </th>
              <th>
                <div className="table-panel-table-header-inner pointer" onClick={() => sortedByField('percentage')}>
                  Percentage
                  <span className="table-panel-table-header-controls" style={{ marginLeft: '10px' }}>
                    {sorted.field === 'percentage' && sorted.order === 'desc' && <i className="fa fa-caret-down"></i>}
                    {sorted.field === 'percentage' && sorted.order === 'asc' && <i className="fa fa-caret-up"></i>}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {series.map((item: any) => {
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
};
