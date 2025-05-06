const HomePage = () => {
  return (
    <div className='flex flex-col justify-between w-screen h-screen'>
      <div className='flex grow justify-center items-center flex-col md:p-2 p-8'>
        <h1 className='font-medium md:text-4xl text-3xl text-center'>
          Optimize Your Web Presence
        </h1>
        <div className='w-full flex justify-center gap-4 mt-8 md:flex-row flex-col'>
          {/* rank comparator */}
          <a
            href='/trends'
            className='block p-6 w-full md:w-1/3 h-80 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-pink-500 hover:to-purple-500'
          >
            <div className='flex justify-end'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-20 h-20 drop-shadow-xl'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
                />
              </svg>
            </div>
            <div className='text-2xl mt-2 font-medium'>Rank Comparator</div>
            <div className='flex justify-between items-end mt-2'>
              <p className='text-sm w-5/6'>
                Compare your Google ranking with competitors to track
                performance and uncover opportunities. <br />
                Stay ahead in search results with insightful ranking comparison
                tool.
              </p>
              <div className='w-1/6 cursor-pointer hover:transition hover:duration-1000 hover:ease-in-out md:hover:translate-x-8 hover:translate-x-6'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-8 h-8'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </a>
          {/* keyword analyzer */}
          <a
            href='/analysis'
            className='p-6 w-full md:w-1/3 h-80 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-purple-500'
          >
            <div className='flex justify-end'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-20 h-20 drop-shadow-xl'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z'
                />
              </svg>
            </div>
            <div className='text-2xl mt-2 font-medium'>Keyword Analyzer</div>
            <div className='flex justify-between items-end mt-2'>
              <p className='text-sm w-5/6'>
                Analyze keywords on any website, especially competitors to
                uncover insights and optimize your SEO strategy.
                <br />
                Stay ahead by understanding the key terms driving their traffic.
              </p>
              <div className='w-1/6 cursor-pointer hover:transition hover:duration-1000 hover:ease-in-out md:hover:translate-x-8 hover:translate-x-6'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-8 h-8'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div className='text-center'>
        @alysialfi. Made with 🐍 for PyCon 2024.
      </div>
    </div>
  )
}

export default HomePage
