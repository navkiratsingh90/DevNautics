import { Outdent } from 'lucide-react'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import Navbar5 from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { handleCredentials } from '../../Features/AuthSlice'
import { getUser } from '../../services/authApis'

const Page = () => {
	const darkMode = useSelector((state) => state.Theme.darkMode)
	const dispatch = useDispatch()
  const getCurrUser = async () => {
    const res = await getUser()
    // console.log(res.data);
    dispatch(handleCredentials(res.data.user))
  }

    useEffect(() => {
      getCurrUser()
    }, [])
	return (
		<>
		<div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
     
		<Navbar5/>
			<Outlet/>
			<Footer/>
			</div>
		</>
	)
}

export default Page