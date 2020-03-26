// Libraries
import React, { useState, useEffect } from 'react';

// Types
import { PanelProps } from '@grafana/data';
import { Options } from './types';
import _ from 'lodash';
import { round } from 'mathjs';

interface Props extends PanelProps<Options> { }

const marginBottom = 30;

export const TablePanel = ({ data, height, width, options }: Props) => {
  const [series, setSeries] = useState([]);
  const [seriesProcessed, setSeriesProcessed] = useState([]);
  const [sorted, setSorted] = useState({ field: '', order: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([1]);

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
    seriesSlice();
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

  const seriesSlice = () => {
    if (currentPage > 0) {
      const indexStart = (currentPage - 1) * options.rowsPerPage;
      const indexEnd = (currentPage - 1) * options.rowsPerPage + options.rowsPerPage;
      setSeriesProcessed(series.slice(indexStart, indexEnd));
    }
  }

  useEffect(() => {
    const dataProcessed: any = applyFieldOverrides();
    const totalPages = Math.trunc(dataProcessed.length / options.rowsPerPage);
    const pages: any[] = [];

    for (let i = 0; i <= totalPages; i++) {
      pages.push(i + 1);
    }

    console.log(dataProcessed);
    setSeries(dataProcessed);
    setPages(pages);
    setCurrentPage(1);
  }, [data, options]);

  useEffect(() => {
    seriesSlice();
  }, [currentPage])

  if (series.length < 1) {
    return <div>No Table Data...</div>;
  }

  return (
    <div className="panel-height-helper" style={{ display: 'grid', gridTemplateRows: '1fr auto' }}>
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
              {seriesProcessed.map((item: any) => {
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
      {
        pages.length > 1 &&
        <div className="table-panel-footer">
          <ul>
            {pages.map(item => {
              return (
                <li>
                  <a
                    className={item === currentPage ? 'table-panel-page-link pointer active' : 'table-panel-page-link pointer'}
                    onClick={() => setCurrentPage(item)}
                  >{item}</a>
                </li>
              )
            })}
          </ul>
        </div>
      }
    </div >
  );
};
