import { useParams } from 'react-router-dom';
import ItemNew from '../Content/Newest/ItemNew/ItemNew';
import Title from '../Content/Title/Title';
import styles from './filterCategory.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faAdd, faLessThan, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';

function FilterCategory() {
    const [data,setData]=useState([])
    const [count,setCount]=useState(4)
    const cate=useParams()
    useEffect(()=>{
        const colRef=collection(db,'category')
        const q=query(colRef,where('title','==',cate.name))
        let idCate=0
        getDocs(q).then(snap=>{
            idCate=snap.docs[0].id
            const postRef=collection(db,'posts')
            const q1=query(postRef,where('categoryID','==',idCate))
            const arr=[]
            getDocs(q1).then(res=>{
                res.docs.forEach(item=>{
                    arr.push({
                        src:item.data().picture,
                        title:item.data().title,
                        type:item.data().categoryID,
                        time:new Date(item.data().createAt.seconds*1000).toLocaleDateString(),
                        author:item.data().authorID,
                        slug:item.data().slug
                    })
                })
                setData(arr)
            })
        })
    },[cate.name])
    return ( 
        <div className={styles.filter}>
            <Title title={`Danh mục ${cate.name}`} color='#3A1097'/>
            <div className={styles.group}>
                {
                    data.length>0&&data.slice(0,count).map((item,index)=>(
                            <ItemNew 
                            key={index}
                            src={`/images/${item?.src}`}
                            title={item?.title}
                            type={item?.type} time={item?.time} author={item?.author}
                            y width="24%" height="auto" width_author="75%"
                            backgroundType='#F3EDFF' widthImg='100%' marginTop='50px' to={item?.slug}
                            demoNewest
                        />
                    ))
                }
            </div>
            <div className={styles.seeMore}>
                {
                    data.length>0&&count<data.length
                        ?
                        <>
                            <p onClick={()=>setCount(count+4)}>See more</p>
                            <span><FontAwesomeIcon icon={faAdd}/></span>
                        </>
                        :
                        <>
                            <p onClick={()=>setCount(count-4)}>See less</p>
                            <span><FontAwesomeIcon icon={faMinusCircle}/></span>
                        </>
                }
            </div>
        </div>
     );
}

export default FilterCategory;