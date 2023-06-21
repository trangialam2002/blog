import SearchDashboard from '../SearchDashboard/SearchDashboard';
import TableDashboard from '../TableDashboard/TableDashboard';
import styles from './dashboardCategory.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { loginContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';
import Paging from '../Paging/Paging';

export const setFakeDataContext=createContext()

function DashboardCategory() {
   
    const sumCategory=useRef(0)
    const QUANTITY_IN_ONE_PAGE=3//1 page hiện 2 bản ghi
    const add=3

    const currentPageRef=useRef({})

    const searchRef=useRef()
    const [fakeData,setFakeData]=useState([])
    const [page,setPage]=useState(QUANTITY_IN_ONE_PAGE)
    const originalDataRef=useRef([])

    useEffect(()=>{
            async function getCountToFirebase(){
                const colRef=collection(db,'category')
                const data=await getDocs(colRef)
                sumCategory.current=data.docs.length
                console.log('sumCategory.current',sumCategory.current);
            }
            getCountToFirebase()
    },[fakeData.length,page])

    useEffect(()=>{
        if(searchRef.current.value===''){
            async function getDataToPage(){
                const colRef=collection(db,'category')
                const q=query(colRef,limit(page||1))
                const data=await getDocs(q)
                originalDataRef.current=[]
                data.forEach(item=>{
                    originalDataRef.current.push(
                        {
                            Id:item.id,
                            Name:item.data().title,
                            Slug:item.data().slug,
                            Status:item.data().status,
                            Actions:[faEye,faEdit,faTrashAlt]
                        }
                    )
                })
                setFakeData(originalDataRef.current)
            }
            getDataToPage()
        }
    },[page,fakeData.length])

    return ( 
        <setFakeDataContext.Provider value={setFakeData}>
            <div className={styles.dashboardCategory}>
                <h3>Manage your category</h3>
                <SearchDashboard placeholder='Search category...' send={setFakeData} originalData={originalDataRef.current} searchRef={searchRef}
                dashboardType='dashboard-category'
                />

                <TableDashboard data={fakeData} Id='Id' Name='Name' Slug="Slug" Status='Status' Actions="Actions" quantity={QUANTITY_IN_ONE_PAGE}
                    page={page} dashboardType='dashboard-category' changePage={setPage} count={sumCategory.current}
                    add={add} currentPageRef={currentPageRef}
                />
                <Paging bottom='100px' count={sumCategory.current} quantity={QUANTITY_IN_ONE_PAGE} changePage={setPage} 
                    len={fakeData.length}
                    add={add}
                    currentPageRef={currentPageRef}
                />
            </div>
        </setFakeDataContext.Provider>
     );
}

export default DashboardCategory;