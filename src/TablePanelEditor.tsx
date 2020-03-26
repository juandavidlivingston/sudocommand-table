//// Libraries
import _ from 'lodash';
import React, { PureComponent, useState } from 'react';

// Types
import { PanelEditorProps } from '@grafana/data';
import { FormField } from '@grafana/ui';
import { Options } from './types';

interface Props extends PanelEditorProps<Options> { }

const PanelEditor = (props: Props) => {
  const [rowsPerPage, setRowsPerPage] = useState(props.options.rowsPerPage);
  const [fontSize, setFontSize] = useState(props.options.fontSize);


  return (
    <div>
      <div className="section gf-form-group">
        <h5 className="section-heading">Paging</h5>
        <FormField
          label="Rows per page"
          labelWidth={10}
          inputWidth={10}
          value={rowsPerPage}
          placeholder=""
          onChange={(e: any) => setRowsPerPage(e.target.value)}
          onBlur={(e: any) => props.onOptionsChange({ ...props.options, rowsPerPage: parseInt(e.target.value) })}
        />

        <FormField
          label="Font size"
          labelWidth={10}
          inputWidth={10}
          value={fontSize}
          placeholder=""
          onChange={(e: any) => setFontSize(e.target.value)}
          onBlur={(e: any) => props.onOptionsChange({ ...props.options, fontSize: e.target.value })}
        />
      </div>
    </div>
  )
}

export class TablePanelEditor extends PureComponent<Props> {
  render() {
    return <PanelEditor {...this.props} />
  }
}
