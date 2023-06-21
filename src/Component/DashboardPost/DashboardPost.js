import SearchDashboard from '../SearchDashboard/SearchDashboard';
import TableDashboard from '../TableDashboard/TableDashboard';
import styles from './dashboardPost.module.scss'
import {faEye,faEdit,faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import {listImg} from '../../assets/images'
import Paging from '../Paging/Paging';
import Type from './Type/Type';
import { auth, db } from '../../Firebase/firebase-config';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';

export const setDataPostContext=createContext()

function DashboardPost() {
    const handleGetCategoryFromPost=useMemo(()=>(
        async idCate=>{
            const docRef=doc(db,'category',idCate)
            let title='lala'
            await getDoc(docRef).then(res=>{
                title=res.data().title
            })
            return title
        }
    ))
    const handleGetUserFromPost=useMemo(()=>(
        async idUser=>{
            const docRef=doc(db,'users',idUser)
            let name='lala'
            await getDoc(docRef).then(res=>{
                name=res?.data()?.name
            })
            return name
        }
    ))

    const sumPost=useRef(0)
    const QUANTITY_IN_ONE_PAGE=2//áp dụng cho mỗi page có 2 bản ghi
    const add=3

    const currentPageRef=useRef({})
    const searchRef=useRef()
    const typeRef=useRef()
    const [data,setData]=useState([])
    const [page,setPage]=useState(QUANTITY_IN_ONE_PAGE)
    const originalDataRef=useRef([])


    useEffect(()=>{
        async function getCountToFirebase(){
            const colRef=collection(db,'posts')
            const data=await getDocs(colRef)
            sumPost.current=data.docs.length
        }
        getCountToFirebase()
    },[data.length,page])

    useEffect(()=>{
        if(searchRef.current.value===''&&typeRef.current.value===''){
            async function getDataToPage(){
                const colRef=collection(db,'posts')
                const q=query(colRef,orderBy('createAt'),limit(page))
                const data=await getDocs(q)
                originalDataRef.current=[]
                data.forEach(async item=>{
                    originalDataRef.current.push(
                        {
                            Id:item.id,
                            Post:{
                                src:item.data().picture,
                                title:item.data().title,
                                time:new Date(item.data().createAt.seconds).toLocaleDateString()
                            },
                            Category:await handleGetCategoryFromPost(item.data().categoryID),
                            Author:await handleGetUserFromPost(item.data().authorID),
                            Actions:[faEye,faEdit,faTrashAlt]
                        }
                    )
                    setData(originalDataRef.current)
                })  
            }
            getDataToPage()
        }
    },[page,data.length])
    

    

    return ( 
        <setDataPostContext.Provider value={setData}>
            <div className={styles.dashboardPost}>
                <h3>Manage all post</h3>
                <SearchDashboard placeholder='Search post...'
                    send={setData} originalData={originalDataRef.current} searchRef={searchRef}
                    dashboardType='dashboard-post'
                />
                <Type typeRef={typeRef}/>
                <TableDashboard data={data} Id='Id' Post='Post' Category="Category" Author='Author' Actions="Actions"
                        quantity={QUANTITY_IN_ONE_PAGE}
                        page={page}
                        dashboardType='dashboard-post'
                        changePage={setPage}
                        add={add} currentPageRef={currentPageRef}
                        count={sumPost.current}
                />
                <Paging bottom='100px'
                    count={sumPost.current} quantity={QUANTITY_IN_ONE_PAGE} changePage={setPage} len={data.length}
                    add={add}
                    currentPageRef={currentPageRef}
                />
            </div>
        </setDataPostContext.Provider>
     );
}

export default DashboardPost;