interface Props {
    columns: Array<{ key: string, label: string }>,
    sortColumn: string | null,
    sortOrder: 'asc' | 'desc',
    setSortColumn: React.Dispatch<React.SetStateAction<string | null>>,
    setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
}

const Sort = ({ columns, sortColumn, sortOrder, setSortColumn, setSortOrder }: Props) => {
    return (
        <div>
            <label>
                <select
                    name="sort"
                    value={sortColumn ? sortColumn : ""}
                    id="sort"
                    onChange={(e) => setSortColumn(e.target.value)}>
                    <option disabled value="" selected>Sort By</option>
                    {columns.map((column) => (
                        <option key={column.key} value={column.key}>
                            {column.label}
                        </option>
                    ))}
                </select>

                <select
                    name="sortOrder"
                    value={sortOrder}
                    id="sortOrder"
                    onChange={(e) => { setSortOrder(e.target.value as 'asc' | 'desc') }}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </label>

            <button
                id="sort-reset"
                onClick={() => {
                    setSortColumn("");
                    setSortOrder('asc')
                }}>
                Reset
            </button>
        </div>
    )
}

export default Sort