'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "../../../../../lib/firebase"
import { getDocs, collection, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import timeConverter from '../../../../../utils/timeconverter'
import checkExpired from "../../../../../utils/checkexpired"

export default function DeleteScholarship() {

  const [scholarshipData, setScholarshipData] = useState([])

  useEffect(() => {
    const getDBData = async () => {
      const q = query(collection(db, 'scholarships'), orderBy('timeExpired'))
      const querySnapshot = await getDocs(q)
    
      let tempData = []
    
      querySnapshot.forEach( (doc) => {
        tempData.push(doc.data())
      })

      setScholarshipData(tempData)
    }

    getDBData()
  }, [])

  return(
    <div className="bg-amber-100 py-5 px-2">
      <h1 className="font-bold text-2xl text-center mb-10">Delete scholarship</h1>
      <div className="w-[97] m-auto sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2">
      {scholarshipData.length !== 0 ? 
        scholarshipData.map( (scholarshipData) => <ScholarshipDisplay scholarshipData={scholarshipData} key={scholarshipData.id} />) : 
        <div>
          <h1 className="font-bold text-lg mb-1">No scholarship data.</h1>
          <h2 className="text-sm text-gray-700">(Allow some time for data to load)</h2>
        </div>}
      </div>
    </div>
  )
}

const ScholarshipDisplay = ({scholarshipData}) => {

  const {title, description, id, createdAt, timeExpired} = scholarshipData

  const [showDelete, setShowDelete] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    await deleteDoc(doc(db, 'scholarships', id))
    alert('scholarship deleted')
    router.back()
  }

  const changeDelete = () => {
    setShowDelete(true)
  }

  const createdAtDate = timeConverter(createdAt.seconds)
  const expired = checkExpired(timeExpired)
  const expiredUnix = new Date(timeExpired)
  const expiredDate = timeConverter(expiredUnix/1000)

  return(
    <div className="flex flex-col m-auto bg-white mb-10 px-8 py-6 rounded-xl box-pop">
        <h1 className="font-bold text-3xl break-words text-clip mb-8">{title}</h1>
        <h1 className="text-lg break-words mb-8">{description}</h1>
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold">
            <h1>Created on: {`${createdAtDate.month}/${createdAtDate.day}/${createdAtDate.year}`}</h1>
            {expired ?
            <h1>Expired on {`${expiredDate.month}/${expiredDate.day}/${expiredDate.year}`}</h1> :
            <h1>Active until {`${expiredDate.month}/${expiredDate.day}/${expiredDate.year}`}</h1>}
          </div>
          {!showDelete ? 
          <button onClick={changeDelete} id='confirm' className="font-bold bg-red-600 px-4 py-2 rounded-xl self-end">DELETE</button> : 
          <button onClick={handleClick} id='delete' className="font-bold bg-red-600 px-4 py-2 rounded-xl self-end">ARE YOU SURE?</button>} 
        </div>
    </div>
    )
}