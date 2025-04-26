import axios from 'axios'
import { useState } from 'react'
import psx_companies from './psx_companies'
import './App.css'
import DynamicTable from './components/DynamicTable'

function App() {

  //states
  const [ticker, setTicker] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [mpsData, setMpsData] = useState<any>([])
  const [error, setError] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(false)

  //functions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMpsData([])

    try {
      setLoading(true)
      const response = await axios.post('https://get-mps-backend.vercel.app/get_stock_data',
        {
          ticker,
          start_date: startDate,
          end_date: endDate
        })
      setLoading(false)
      if (response.data.error) {
        setError(response.data.error)
      } else {
        setMpsData(response.data.data)
      }

    } catch (error) {
      setError("An error occurred while fetching the data. Please try again.")
    }
  }


  //return
  return (
    <div>
      <h1>Get MPS</h1>
      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setTicker(e.target.value)} value={ticker}>
          <option value="">Select a company</option>
          {psx_companies.map((company: any) => (
            <option key={company.ticker} value={company.ticker}>
              {company.name}
            </option>
          ))}
        </select>
        <br />
        <input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <br />
        <button type="submit">Get MPS</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mpsData.length > 0 && (
        <div>
          <h2>MPS Data</h2>
          <DynamicTable
            data={mpsData}
            columns={[
              { key: 'Date', label: 'Date' },
              { key: 'Close', label: 'MPS' }
            ]}
            downloadable={true}
            pagination={{rowsPerPage:30}}
          />
        </div>
      )}

    </div>
  )
}

export default App
