import React from 'react'
import SearchEmployee from './SearchEmployee'

export default function ManageEmployee() {
  return (
    <div className='space-y-5'>
        <h2 className="ml-5 text-2xl font-semibold">Search & Manage Employees</h2>
        <SearchEmployee />
    </div>
  )
}
