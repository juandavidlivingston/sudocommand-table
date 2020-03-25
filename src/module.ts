import { PanelPlugin } from '@grafana/data';

import { Options, defaults } from './types';
import { TablePanel } from './TablePanel';
import { TablePanelEditor } from './TablePanelEditor';

export const plugin = new PanelPlugin<Options>(TablePanel).setDefaults(defaults).setEditor(TablePanelEditor);
