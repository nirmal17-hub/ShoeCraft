import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <>


      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6 py-16">
        <div className="w-full max-w-2xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            ShoeCraft
          </p>

          <h1 className="mt-6 text-8xl font-black tracking-tight text-gray-900 md:text-9xl">
            404
          </h1>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-black" />

          <h2 className="mt-8 text-2xl font-bold text-gray-900 md:text-3xl">
            Page Not Found
          </h2>

          <p className="mx-auto mt-4 max-w-md leading-7 text-gray-500">
            Oops! The page you're looking for doesn't exist,
            may have been moved, or the URL might be incorrect.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
  onClick={() => navigate(-1)}
  className="rounded-lg bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-700"
>
  Go Back
</button>


          </div>

        </div>
      </div>

    </>
  )
}

export default NotFound