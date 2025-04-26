import { FC } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filterable?: boolean;
  downloadable?: boolean;
  sortable?: boolean;
  serialNo?: boolean;
  pagination?: {
    rowsPerPage: number;
  };
}

declare const DynamicTable: FC<DynamicTableProps<any>>;

export default DynamicTable;
