import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import TableDashboard from '../TableDashboard/TableDashboard';
import styles from './dashboardUser.module.scss'
import { createContext, useEffect, useRef, useState } from 'react';
import { collection, getDocs, limit, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';
import Paging from '../Paging/Paging';
import SearchDashboard from '../SearchDashboard/SearchDashboard';

export const setDataUserContext=createContext()

function DashboardUser() {

    const sumUser=useRef(0)
    const QUANTITY_IN_ONE_PAGE=2
    const add=3

    const currentPageRef=useRef({})
    const searchRef=useRef()
    
    const [data,setData]=useState([])
    const [page,setPage]=useState(QUANTITY_IN_ONE_PAGE)
    const originalDataRef=useRef([])

    useEffect(()=>{
        async function getCountToFirebase(){
            const colRef=collection(db,'users')
            const data=await getDocs(colRef)
            sumUser.current=data.docs.length
        }
        getCountToFirebase()
    },[data.length,page])
    
useEffect(()=>{
        if(searchRef.current.value===''){
            async function getDataToPage(){
                const colRef=collection(db,'users')
                const q=query(colRef,limit(page))
                const data=await getDocs(q)
                originalDataRef.current=[]
                data.forEach(item=>{
                    originalDataRef.current.push(
                        {
                            Id:item.id,
                            Info:{
                                avatar:item.data().avatar,
                                userName:item.data().name,
                                createAt:new Date(item.data().createdAt.seconds).toLocaleDateString()
                            },
                            Email:item.data().mail,
                            Status:item.data().status,
                            Role:item.data().role,
                            Actions:[faEdit,faTrashAlt]
                        }
                    )
                })
                setData(originalDataRef.current)
            }
            getDataToPage()
        }
    },[page,data.length])
    
    return ( 
        <setDataUserContext.Provider value={setData}>
            <div className={styles.dashboardUser}>
                <h3>Manage your users</h3>
                <SearchDashboard placeholder='Search user...' send={setData} originalData={originalDataRef.current} searchRef={searchRef}
                dashboardType='dashboard-user'
                />

                <TableDashboard 
                    Id='Id' Name='Info' email='Email' status='Status' role='Role' Actions="Actions" 
                    data={data} 
                    quantity={QUANTITY_IN_ONE_PAGE}
                    page={page}
                    dashboardType='dashboard-user'
                    changePage={setPage}
                    add={add} currentPageRef={currentPageRef}
                    count={sumUser.current}
                    />
                <Paging bottom='100px' count={sumUser.current} quantity={QUANTITY_IN_ONE_PAGE} changePage={setPage} len={data.length}
                add={add}
                currentPageRef={currentPageRef}
                />
            </div>
        </setDataUserContext.Provider>
     );
}

export default DashboardUser;