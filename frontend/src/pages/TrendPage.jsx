import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TrendPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    keyword: '',
    sitename: '',
    competitors: [''],
  })
  const [dataTrends, setDataTrends] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // State for error message

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleCompetitorChange = (index, value) => {
    const updatedCompetitors = [...form.competitors]
    updatedCompetitors[index] = value
    setForm({ ...form, competitors: updatedCompetitors })
  }

  const addCompetitor = () => {
    if (form.competitors.length < 3) {
      setForm({ ...form, competitors: [...form.competitors, ''] })
    }
  }

  const removeCompetitor = (index) => {
    const updatedCompetitors = form.competitors.filter((_, i) => i !== index)
    setForm({ ...form, competitors: updatedCompetitors })
  }

  const closeModal = () => {
    setErrorMessage('') // Reset error message when closing modal
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setDataTrends([])
    setIsFetching(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/trends-result`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )

      const result = await response.json()

      if (result.status !== 'success') {
        throw new Error(result.message || 'An unexpected error occurred.')
      }

      setDataTrends(result.data)
    } catch (error) {
      console.error('Error during fetch operation:', error)
      setErrorMessage(error.message || 'Please try again with another URL.')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div className='container w-full mx-auto p-8 flex justify-center items-center flex-col'>
      {/* Modal for Error */}
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

      <div className='w-full flex justify-start mb-4'>
        <button
          onClick={() => navigate('/')}
          className='py-2 px-3 bg-white border border-violet-600 text-violet-600 rounded-md hover:bg-gray-200'
        >
          Back to Home
        </button>
      </div>
      <div className='flex justify-center flex-col items-center'>
        <h2 className='font-medium text-3xl'>Rank Comparator</h2>
        <p className='mt-2'>
          Query your site and competitor&apos;s to see where yours belong to.
        </p>
      </div>

      <div className='w-2/3 mt-8'>
        <form onSubmit={submitForm} className='w-full'>
          <div className='mb-4'>
            <label
              htmlFor='keyword'
              className='block text-sm font-medium text-gray-700'
            >
              Keyword
            </label>
            <input
              type='text'
              id='keyword'
              name='keyword'
              placeholder='hosting murah'
              value={form.keyword}
              onChange={handleChange}
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='sitename'
              className='block text-sm font-medium text-gray-700'
            >
              Sitename
            </label>
            <input
              type='text'
              id='sitename'
              name='sitename'
              placeholder='www.my-domain.com'
              value={form.sitename}
              onChange={handleChange}
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Competitors
            </label>
            {form.competitors.map((competitor, index) => (
              <div
                key={index}
                className={`flex ${index > 0 ? 'mt-2' : 'mt-1'}`}
              >
                <input
                  type='text'
                  placeholder='www.competitor.com'
                  value={competitor}
                  onChange={(e) =>
                    handleCompetitorChange(index, e.target.value)
                  }
                  className='block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
                <div className='flex gap-2'>
                  <button
                    type='button'
                    className='ml-2 p-2 text-red-500 hover:text-red-700 disabled:text-red-300'
                    onClick={() => removeCompetitor(index)}
                    disabled={form.competitors.length === 1}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                  <button
                    type='button'
                    className='p-2 text-blue-500 hover:text-blue-700 disabled:text-blue-300'
                    onClick={addCompetitor}
                    disabled={
                      form.competitors.length >= 3 ||
                      index !== form.competitors.length - 1
                    }
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        fillRule='evenodd'
                        d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-6'>
            <button
              type='submit'
              className='w-full py-2 px-4 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:bg-violet-300'
              disabled={
                isFetching || form.keyword === '' || form.sitename === ''
              }
            >
              {isFetching ? 'Checking...' : 'Check Rank'}
            </button>
          </div>
        </form>

        {!isFetching && dataTrends.length > 0 && (
          <div className='mt-16 overflow-hidden bg-white shadow-md rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Keyword
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Rank
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    URLs
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {dataTrends.map((item, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {item.Keyword}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{item.Rank}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <a
                        href={item.URLs}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:underline'
                      >
                        {item.URLs}
                      </a>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{item.Date}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{item.Type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendPage
