import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './tr.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import "tippy.js/dist/tippy.css"
import { setFakeDataContext } from '../DashboardCategory/DashboardCategory';
import { memo, useContext, useEffect, useRef } from 'react';
import { collection, deleteDoc, doc, query } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { setDataUserContext } from '../DashboardUser/DashboardUser';
import { setDataPostContext } from '../DashboardPost/DashboardPost';

function Tr({currentPageRef,add,data,quantity,page,dashboardType,changePage,count}) {
    const data1=data.length>quantity?data.slice(page-quantity,data.length):data
    console.log('page',page);
    console.log('data1',data1);
    console.log('data',data);
    const setFakeData=useContext(setFakeDataContext)
    const setDataUser=useContext(setDataUserContext)
    const setDataPost=useContext(setDataPostContext)
    const navigate=useNavigate()

    const countRef=useRef(0)
  
    useEffect(()=>{
        if(count>countRef.current)
            countRef.current=count
    },[count])

    const handleClick=(iconItem,id)=>{
        if(iconItem===faTrashAlt){
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton:true,
                confirmButtonColor:'#3085d6',
                cancelButtonColor:"#d33",
                confirmButtonText: 'Yes, delete it!'
              }).then((res)=>{
                if(res.isConfirmed){
                    if(dashboardType==='dashboard-category'){
                        const docRef=doc(db,'category',id)
                        deleteDoc(docRef).then(()=>{
                            const filter=data1.filter(item=>(
                                item.Id!==id
                            ))
                            if(filter.length===0){
                                changePage(prev=>prev-quantity)
                                if((count-1)%(quantity*add)===0){
                                    currentPageRef.current.setStart(prev=>prev-add)
                                    currentPageRef.current.setEnd(prev=>prev-add)
                                }
                            }
                            else setFakeData(filter)
                            
                        })
                        Swal.fire('Deleted!','Your a category has been deleted','success')
                    }
                    else if(dashboardType==='dashboard-user'){
                        const docRef=doc(db,'users',id)
                        deleteDoc(docRef).then(()=>{
                            const filter=data1.filter(item=>(
                                item.Id!==id
                            ))
                            if(filter.length===0){
                                changePage(prev=>prev-quantity)
                                if((count-1)%(quantity*add)===0){
                                    currentPageRef.current.setStart(prev=>prev-add)
                                    currentPageRef.current.setEnd(prev=>prev-add)
                                }
                            }
                            else setDataUser(filter)
                        })
                        Swal.fire('Deleted!','Your a user has been deleted','success')
                    }
                    else if(dashboardType==='dashboard-post'){
                        const docRef=doc(db,'posts',id)
                        deleteDoc(docRef).then(()=>{
                            const filter=data1.filter(item=>(
                                item.Id!==id
                            ))
                            if(filter.length===0){
                                changePage(prev=>prev-quantity)
                                if((count-1)%(quantity*add)===0){
                                    currentPageRef.current.setStart(prev=>prev-add)
                                    currentPageRef.current.setEnd(prev=>prev-add)
                                }
                            }
                            else setDataPost(filter)
                        })
                        Swal.fire('Deleted!','Your a post has been deleted','success')
                    }
                }
              })
        }
        else if(iconItem===faEdit){
            navigate(`/${dashboardType==='dashboard-category'&&'dashboard-update-category'||dashboardType==='dashboard-user'&&'dashboard-update-profile'||dashboardType==='dashboard-post'&&'dashboard-update-post'}?id=${id}`)
        }
    }

    return ( 
        data1.map((item,index)=>(
            <tr key={index}>    
                {
                    Object.values(item).map((current,position)=>{
                        const customStyle={}
                        if(typeof current==='string'&&current.includes('-')){
                            customStyle.fontStyle='italic'
                            customStyle.fontWeight=400                            
                        }
                        if(typeof current==='string'&&current==='Approved'||current==='Active'){
                            customStyle.color='#53b870'
                            customStyle.backgroundColor='#d3fce0'
                            customStyle.padding='10px'
                            customStyle.borderRadius='5px'
                            customStyle.width='10%'
                            customStyle.fontSize='14px'
                        }
                        if(typeof current==='string'&&current==='Pending'){
                            customStyle.color='#ecbf41'
                            customStyle.backgroundColor='#fefbc8'
                            customStyle.padding='10px'
                            customStyle.borderRadius='5px'
                            customStyle.width='10%'
                            customStyle.fontSize='14px'
                        }
                        if(typeof current==='string'&&current==='Reject'||current==='Ban'){
                            customStyle.color='#b53a45'
                            customStyle.backgroundColor='#ffdddc'
                            customStyle.padding='10px'
                            customStyle.borderRadius='5px'
                            customStyle.width='10%'
                            customStyle.fontSize='14px'
                        }
                        if(typeof current==='string'&&current.includes('@')){
                            customStyle.fontSize='14px'
                        }
                        if(typeof current==='string'&&['User','Moderator','Admin'].includes(current)){
                            customStyle.fontSize='14px'
                        }
                        return (
                            <td key={position} style={current==='Active'||current==='Pending'||current==='Ban'?{width:'10%'}:{}}>
                                {
                                    typeof current==='object'?current.length>0?
                                    <div className={styles.action}>
                                        {
                                            current.map((iconItem,iconIndex)=>(
                                                    <Tippy 
                                                        key={iconIndex}
                                                        placement='top'   
                                                        content={iconItem===faEye&&'view'||iconItem===faEdit&&'edit'||iconItem===faTrashAlt&&'remove'} 
                                                    >
                                                        <span onClick={()=>handleClick(iconItem,item.Id)}>
                                                            <FontAwesomeIcon icon={iconItem}/>
                                                        </span>
                                                    </Tippy>

                                            ))
                                        }
                                    </div>
                                    :
                                    <div className={styles.post}>
                                        <img src={`images/${current.src||current.avatar}`} alt=''/>
                                        <div className={styles.postInfo}>
                                            <Tippy content={current.title||current.userName}>
                                                <p>{current.title?.slice(0,9)||current.userName?.slice(0,9)}...</p>
                                            </Tippy>
                                            <span>{current.time||current.createAt}</span>
                                        </div>
                                    </div>
                                    :
                                    current?.length>5
                                        ?
                                        <Tippy content={current}>
                                            <span style={customStyle}>{current.length>9?current.slice(0,9)+'...':current}</span>
                                        </Tippy>
                                        :
                                        <span style={customStyle}>{current}</span>
                                }
                            </td>
                        )
                    })
                }
            </tr>
        ))
     );
}

export default memo(Tr);