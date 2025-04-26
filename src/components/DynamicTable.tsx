import React, { useEffect, useMemo, useState } from 'react'
import './DynamicTable.css'
import Pagination from './Pagination';
import Sort from './Sort';

//props
interface Props {
    columns: Array<{ key: string, label: string }>,
    data: Record<string, any>[],
    filterable?: boolean,
    downloadable?: boolean,
    sortable?: boolean,
    serialNo?: boolean,
    pagination?: {
        rowsPerPage: number,
    }
}

//component
const DynamicTable = ({ columns, data, serialNo, filterable, downloadable, sortable, pagination }: Props) => {

    // filter
    const [filter, setFilter] = useState<string>('');
    const filteredData = useMemo(() => {
        if (!filterable) return data; // no filtering
        if (!filter) return data; // no filter
        if (!data.length) return []; // no data 
        const filtered = data.filter((row) => {
            return columns.some((column) => {
                const cellValue = row[column.key]?.toString().toLowerCase();
                return cellValue && cellValue.includes(filter.toLowerCase());
            });
        });
        return filtered;
    }, [data, filter, columns, filterable])

    // sorting
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const sortedData = useMemo(() => {
        if (!sortable) return filteredData; // no sorting
        if (!sortColumn) return filteredData; // no sorting column
        const sorted = [...filteredData].sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredData, sortColumn, sortOrder, sortable])

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData; // no pagination
        const startIndex = (currentPage - 1) * pagination.rowsPerPage;
        const endIndex = startIndex + pagination.rowsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, pagination, currentPage])

    useEffect(() => {
        setCurrentPage(1); // reset page to 1 when filter changes
    }, [filter]);

    // download csv
    const downloadCSV = () => {
        const escapeCSV = (value: any) => {
          if (value == null) return ""; // handle null or undefined
          const str = String(value);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`; // escape double quotes
          }
          return str;
        };
      
        const header = columns.map((col) => escapeCSV(col.label)).join(",");
        const rows = filteredData.map((row) =>
          columns.map((col) => escapeCSV(row[col.key])).join(",")
        );
        const csvContent = [header, ...rows].join("\n");
      
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "table.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };      

    // check if data is empty
    if (data.length === 0) {
        return <div>No results found</div>;
    }

    //return table
    return (
        <div id='dynamic-table-container'>

            <div id='table-controls'>
                {/* download */}
                {downloadable &&
                    <button id='download' onClick={downloadCSV}>Download CSV</button>}

                {/* filter */}
                {filterable &&
                    <input
                        type='text'
                        id='filter'
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder='Search table...' />}

                {/* sorting */}
                {sortable &&
                    <Sort
                        columns={columns}
                        sortColumn={sortColumn}
                        sortOrder={sortOrder}
                        setSortColumn={setSortColumn}
                        setSortOrder={setSortOrder} />}

            </div>

            {/* pagination */}
            {pagination &&
                <Pagination
                    dataLength={filteredData.length}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pagination={pagination} />}

            {/* table */}
            <div id='table-wrapper'>
                <table>
                    {/* table head */}
                    <thead>
                        <tr>
                            {serialNo && <th>Serial No</th>}
                            {columns.map((column) => (
                                <th key={column.key}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* table body */}
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={row.id || index}>
                                {serialNo && <td>{pagination ? index + 1 + ((currentPage - 1) * pagination.rowsPerPage) : index + 1}</td>}
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {row[column.key] !== undefined ? row[column.key] : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* pagination */}
            {pagination &&
                <Pagination
                    dataLength={filteredData.length}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pagination={pagination} />}

        </div>
    )
}

export default DynamicTable;