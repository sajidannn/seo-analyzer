import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApexCharts from 'apexcharts'

const AnalyzerPage = () => {
  const [form, setForm] = useState({ sitename: '' })
  const [dataKeywords, setDataKeywords] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // State untuk pesan error
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setIsFetching(true)
    setDataKeywords([])

    const sitename = `https://www.${form.sitename}`

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/analysis-result`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sitename }),
        }
      )

      const result = await response.json()
      if (result.status !== 'success') {
        throw new Error(
          result.message || result.detail || 'Unexpected error occurred.'
        )
      }

      setDataKeywords(result.data)
      setIsFetching(false)
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      setErrorMessage(error.message || 'Please try another URL.')
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (dataKeywords.length > 0) {
      dataKeywords.forEach((categoryData, index) => {
        const chartSeries = categoryData.phrases.map((phraseData) => ({
          x: phraseData.phrase,
          y: phraseData.count,
        }))

        renderChart(chartSeries, `chart-${index}`)
      })
    }
  }, [dataKeywords])

  const renderChart = (chartData, elementId) => {
    const options = {
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      series: [
        {
          data: chartData,
        },
      ],
      xaxis: {
        categories: chartData.map((item) => item.x),
      },
    }

    const chart = new ApexCharts(
      document.querySelector(`#${elementId}`),
      options
    )
    chart.render()
  }

  const closeModal = () => {
    setErrorMessage('')
  }

  return (
    <div className='container w-full mx-auto p-8 flex justify-center items-center flex-col'>
      {/* Modal untuk Error */}
      {errorMessage && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-md shadow-md lg:w-1/3 m-6'>
            <h2 className='text-lg font-medium text-red-600'>Error</h2>
            <p className='mt-2 text-gray-700'>{errorMessage}</p>
            <button
              onClick={closeModal}
              className='mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none'
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className='flex justify-start items-center w-full mb-4'>
        <button
          onClick={() => navigate('/')}
          className='py-2 px-3 bg-white border border-violet-600 text-violet-600 rounded-md hover:bg-gray-200'
        >
          Back to Home
        </button>
      </div>
      <div className='flex justify-center flex-col items-center'>
        <h2 className='font-medium text-3xl'>Keyword Analyzer</h2>
        <p className='mt-2'>
          Analyze any site on the internet, and find the potentials to boost
          your SEO.
        </p>
      </div>

      <div className='w-2/3 mt-8'>
        <form onSubmit={submitForm} className='w-full'>
          <div className='mb-4'>
            <label
              htmlFor='sitename'
              className='block text-sm font-medium text-gray-700'
            >
              Sitename
            </label>
            <div className='flex'>
              <div className='w-1/6 p-2 border border-gray-300 rounded-md rounded-tr-none rounded-br-none text-sm'>
                https://www.
              </div>
              <input
                type='text'
                id='sitename'
                name='sitename'
                value={form.sitename}
                onChange={handleChange}
                placeholder='www.my-domain.com'
                className='block w-5/6 p-2 border border-gray-300 rounded-md rounded-tl-none rounded-bl-none shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
            <span className='text-xs text-gray-500'>
              *make sure it&apos;s a specific route, e.g.
              <span className='font-semibold'>my-site.com/first-blog</span>
            </span>
          </div>
          <div className='mt-6'>
            <button
              type='submit'
              disabled={isFetching || form.sitename === ''}
              className='w-full py-2 px-4 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-300 disabled:opacity-50'
            >
              {isFetching ? 'Analyzing...' : 'Analyze Keyword'}
            </button>
          </div>
        </form>

        {/* Render Ordered List */}
        {dataKeywords.length > 0 && (
          <div className='mt-16'>
            {dataKeywords.map((categoryData, index) => (
              <div key={index} className='mb-8'>
                <h3 className='font-medium text-xl mb-2'>
                  {categoryData.category}
                </h3>
                {/* <ol className='list-decimal ml-6'>
                  {categoryData.phrases.map((phraseData, idx) => (
                    <li key={idx} className='mb-1'>
                      {phraseData.phrase}{' '}
                      {categoryData.category !== 'Noun Phrase' && (
                        <span className='text-gray-500'>
                          (Count: {phraseData.count})
                        </span>
                      )}
                    </li>
                  ))}
                </ol> */}
                <div id={`chart-${index}`} className='mt-4'></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyzerPage
