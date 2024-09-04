import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './components/LeftSideBar';

const  App =() =>{
  return (
    <div className=''>
      <div className='max-w-screen-lg mx-auto flex gap-6'>
<div className='w-2/5 bg-slate-200 h-screen p-6'>
<h1 className='text-xl font-semibold '>All Users </h1>
<LeftSideBar></LeftSideBar>
</div>
<div className='w-3/5 bg-slate-200 h-screen p-6'>
<Outlet></Outlet>
</div>
      </div>
    </div>
  )
}

export default App;
