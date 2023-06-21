import { memo, useEffect, useState,useContext } from 'react';
import styles from './type.module.scss'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import { setDataPostContext } from '../DashboardPost';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const handleGetCategoryFromPost=async idCate=>{
    const docRef=doc(db,'category',idCate)
    let title='lala'
    await getDoc(docRef).then(res=>{
        title=res.data().title
    })
    return title
}
const handleGetUserFromPost=async idUser=>{
    const docRef=doc(db,'users',idUser)
    let name='lala'
    await getDoc(docRef).then(res=>{
        name=res?.data()?.name
    })
    return name
}

function Type({typeRef}) {
    const setData=useContext(setDataPostContext)
    const [fakeData,setFakeData]=useState([])
    useEffect(()=>{
        const colRef=collection(db,'category')
        const data=[]
        getDocs(colRef).then(res=>{
            res.docs.forEach(item=>{
                data.push({
                    title:item.data().title,
                    id:item.id
                })
            })
            setFakeData(data)
        })
    },[])
   

    const handleChangeType=async e=>{
        const colRef=collection(db,'posts')
        const q=query(colRef,where('categoryID','==',e.target.value.trim()))
        const res=await getDocs(q)
        const data=[]
        res.docs.forEach(async item=>{
            data.push({
                Id:item.id,
                Post:{
                    src:item.data().picture,
                    title:item.data().title,
                    time:new Date(item.data().createAt.seconds).toLocaleDateString()
                },
                Category:await handleGetCategoryFromPost(item.data().categoryID),
                Author:await handleGetUserFromPost(item.data().authorID),
                Actions:[faEye,faEdit,faTrashAlt]
            })
        })
        setTimeout(()=>{
            setData(data)
        },1000)
    }

    return (
        <select className={styles.type} onChange={handleChangeType} ref={typeRef}>
            <option value=''>Select an option</option>
            {
                fakeData.map((item,index)=>(
                    <option key={index} value={item.id}>{item.title}</option>
                ))
            }
        </select>
    )
     
}

export default memo(Type);