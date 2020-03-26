export interface Options {
  showHeader: boolean;
  rowsPerPage: number,
  fontSize: string
}

export const defaults: Options = {
  showHeader: true,
  rowsPerPage: 100,
  fontSize: '16px'
};
