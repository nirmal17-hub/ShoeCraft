import React, { useEffect } from 'react'

function PageLoader({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 500)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <>
      <style>{`
        @keyframes shoeFloat {
          0%, 100% {
            transform: translateY(0) rotate(-10deg);
          }
          50% {
            transform: translateY(-10px) rotate(-3deg);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .shoe-animation {
          animation: shoeFloat 1s ease-in-out infinite;
        }

        .loader-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-xl">
        <div className="flex w-80 flex-col items-center rounded-3xl border border-white/70 bg-white/60 px-8 py-10 shadow-2xl">

          <svg
            className="shoe-animation h-28 w-48"
            viewBox="0 0 240 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="ShoeCraft loading"
          >
            <path
              d="M25 94 Q45 105 78 103 L177 108 Q201 109 216 98 L218 106 Q212 121 190 123 L63 122 Q36 121 24 110Z"
              fill="#222"
            />

            <path
              d="M31 88 Q43 83 58 66 L80 38 Q86 31 96 39 L121 65 Q135 78 163 82 L198 87 Q214 90 218 101 Q220 109 203 110 L58 107 Q32 106 25 99Z"
              fill="#F8F8F8"
              stroke="#222"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            <path
              d="M48 78 L69 51 L87 65 L69 89 L38 96Z"
              fill="#292929"
            />

            <path
              d="M78 39 L100 63 L113 75"
              stroke="#D97706"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <path
              d="M85 56 L111 48 M91 63 L118 56 M98 70 L125 64"
              stroke="#292929"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M47 113 L187 116"
              stroke="#D97706"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <h1 className="mt-4 text-2xl font-black tracking-[0.2em] text-gray-900">
            SHOECRAFT
          </h1>

          <p className="mt-2 text-xs tracking-[0.25em] text-gray-500">
            STEP INTO YOUR STYLE
          </p>

          <div className="loader-spin mt-7 h-8 w-8 rounded-full border-2 border-gray-300 border-t-black border-r-amber-600" />

          <p className="mt-3 text-xs font-medium tracking-widest text-gray-500">
            LOADING...
          </p>
        </div>
      </div>
    </>
  )
}

export default PageLoader