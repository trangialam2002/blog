import styles from './filterAuthor.module.scss'
import { useParams } from 'react-router-dom';
import ItemNew from '../Content/Newest/ItemNew/ItemNew';
import Title from '../Content/Title/Title';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faAdd, faLessThan, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';

function FilterAuthor() {
    const [data,setData]=useState([])
    const [count,setCount]=useState(4)
    const author=useParams()
    useEffect(()=>{
        console.log(author.name);
        const colRef=collection(db,'users')
        const q=query(colRef,where('name','==',author.name))
        let idAuthor=0
        getDocs(q).then(snap=>{
            idAuthor=snap.docs[0].id
            const postRef=collection(db,'posts')
            const q1=query(postRef,where('authorID','==',idAuthor))
            const arr=[]
            getDocs(q1).then(res=>{
                res.docs.forEach(item=>{
                    console.log(item.data());
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
    },[author.name])
    return ( 
        <div className={styles.filter}>
            <Title title={`Tác giả ${author.name}`} color='#3A1097'/>
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

export default FilterAuthor;