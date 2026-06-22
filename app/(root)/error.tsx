"use client"

import React, { useEffect } from 'react'

const Error = ({error, reset}: {
    error: Error & {digest?: string},
    reset: () => void
}) => {
  useEffect(() => {
    console.error(error)
  },[error])

  return (
    <div>
        <h2>An error occurred</h2>
        <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

export default Error