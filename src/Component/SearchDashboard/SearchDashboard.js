import { useEffect, useState } from 'react';
import useDebounce from '../../Hook/useDebounce';
import styles from './searchDashboard.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose, faEdit, faEye, faSpinner, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase-config';

const handleGetCategoryFromPost=async idCate=>{
    const docRef=doc(db,'category',idCate)
    let title='lala'
    await getDoc(docRef).then(res=>{
        title=res.data().title
    })
    return title
}

function SearchDashboard({searchRef,placeholder,send=()=>{},originalData=[],dashboardType}) {
    const [value,setValue]=useState('')
    const [isLoading,setIsLoading]=useState(false)
    const [close,setClose]=useState(false)
    const debounce=useDebounce(value,800)
    useEffect(()=>{
        if(!debounce){
            setIsLoading(false)
            send([...originalData])
            return
        }
        const colRef=collection(db,dashboardType==='dashboard-category'&&'category'||dashboardType==='dashboard-user'&&'users'||dashboardType==='dashboard-post'&&'posts')
        getDocs(colRef).then(async res=>{
            const data=res.docs.filter(item=>{
                if(dashboardType==='dashboard-category'){
                    return item.data().title.includes(debounce)
                }
                else if(dashboardType==='dashboard-user'){
                    return item.data().name.includes(debounce)
                }
                else if(dashboardType==='dashboard-post'){
                    return item.data().title.includes(debounce)
                }
            })
         
            const finalData=data.map(async item=>{
                if(dashboardType==='dashboard-category'){
                    const {createAt,...props}= {
                            Id:item.id,
                        ...item.data(),
                        Actions:[faEye,faEdit,faTrashAlt]
                    }
                    return {Id:props.Id,Name:props.title,Slug:props.slug,Status:props.status,Actions:props.Actions}
                }
                else if(dashboardType==='dashboard-user'){
                    const {createdAt,...props}= {
                        Id:item.id,
                        ...item.data(),
                        Actions:[faEye,faEdit,faTrashAlt]
                    }   
                    return {
                        Id:props.Id,
                            Info:{
                                avatar:props.avatar,
                                userName:props.name,
                                createAt:new Date(createdAt.seconds).toLocaleDateString()
                            },
                            Email:props.mail,
                            Status:props.status,
                            Role:props.role,
                            Actions:[faEdit,faTrashAlt]
                    }
                }
                else if(dashboardType==='dashboard-post'){
                    const {createAt,...props}= {
                        Id:item.id,
                        ...item.data(),
                        Actions:[faEye,faEdit,faTrashAlt]
                    }   
                    return {
                        Id:props.Id,
                            Post:{
                                src:props.picture,
                                title:props.title,
                                time:new Date(createAt.seconds).toLocaleDateString()
                            },
                            Category:await handleGetCategoryFromPost(item.data().categoryID),
                            Author:auth.currentUser.displayName,
                            Actions:[faEye,faEdit,faTrashAlt]
                    }
                }
              
                }  
            )
            const arr=[]
            for(let i=0;i<finalData.length;i++){
                arr.push(await finalData[i])
            }         
            send(arr)
            setIsLoading(false)
            setClose(true)
        })

    },[debounce])
    const handleChange=e=>{
        setIsLoading(true)
        setClose(false)
        setValue(e.target.value)
    }
    const handleClose=()=>{
        setValue('')
        setClose(false)
    }

    return ( 
        <div className={styles.searchCategory}>
            <input placeholder={placeholder} className={styles.input} 
                value={value}
                onChange={e=>handleChange(e)}
                ref={searchRef}
            />
            {isLoading&&<span className={styles.rotate}><FontAwesomeIcon icon={faSpinner}/></span>}
            {close&&<span onClick={handleClose}><FontAwesomeIcon icon={faClose}/></span>}
        </div>
     );
}

export default SearchDashboard;