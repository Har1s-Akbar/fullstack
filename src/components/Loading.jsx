import React, { useEffect } from 'react'
import { Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, getDoc, getDocs, query, where, doc, runTransaction } from 'firebase/firestore/lite'
import { db } from '../auth/firebaseConfig'
import { v4 } from 'uuid'

function Loading() {
    const {id} = useParams()
    const navigate = useNavigate()
    const checkUser = async() => {
        const checkRef = doc(db, 'usersProfile', id)
            try{
                const newLogCount = await runTransaction(db, async(trans)=>{
                    const reqDoc = await trans.get(checkRef)
                    if(!reqDoc.exists()){
                        const unq = v4()
                        navigate(`/userform/${unq}/${id}`)
                    }else{
                        const newLog =reqDoc.data().login + 1;
                    }
                })
            }catch{

            }
        }
        useEffect(()=> checkUser,[])
  return (
    <section className='min-h-screen bg-main'>
        <div className='flex items-center justify-center'>
            <Spin size='large' className='w-full mt-72'/>
        </div>
    </section>
  )
}

export default Loading