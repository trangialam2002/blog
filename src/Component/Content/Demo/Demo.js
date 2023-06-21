import ItemNew from '../Newest/ItemNew/ItemNew';
import styles from './demo.module.scss'
import {listImg} from "../../../assets/images"
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
function Demo({detail,idPost,demoNewest=false}) {
    const [data,setData]=useState([])
    useEffect(()=>{
        if(detail){
            const colRef=collection(db,'posts')
            const q=query(colRef,where('categoryID','==',detail),limit(4))
            const arr=[]
            onSnapshot(q,snaps=>{
                snaps.docs.forEach(item=>{
                    if(item.id!==idPost){
                        arr.push({
                            src:item.data().picture,
                            title:item.data().title,
                            type:detail,
                            time:new Date(item.data()?.createAt?.seconds*1000).toLocaleDateString(),
                            author:item.data().authorID,
                            slug:item.data().slug
                        })
                    }
                })
                setData(arr)
            })

        }
    },[detail])
    return ( 
        <div className={styles.demo}>
            {
                data.length>0?data.map((item,index)=>(
                    <ItemNew 
                        key={index}
                        src={`/images/${item.src}`}
                        title={item.title}
                        type={item.type}
                        time={item.time}
                        author={item.author}
                        y width="24%" height="auto" width_author="75%"
                        backgroundType='#F3EDFF' widthImg='100%'
                        demoNewest={demoNewest}
                        to={item?.slug}
                    />
                )):
                <p style={{width:'100%',textAlign:'center',fontFamily: "Montserrat",fontWeight: 500,color: '#232323'}}>Không có bài viết liên quan</p>
            }
        </div>
     );
}

export default Demo;