import Title from '../Title/Title';
import styles from './newest.module.scss'
import {listImg} from '../../../assets/images'
import ItemNew from './ItemNew/ItemNew';
import { useEffect, useMemo, useRef, useState } from 'react';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import DemoNewest from './DemoNewest/DemoNewest';


function Newest() {
    const [data,setData]=useState([])
    const [first,second1,second2,second3,...third]=data
    const second=[second1,second2,second3]

    useEffect(()=>{
        const colRef=collection(db,'posts')
        const q=query(colRef,where('hot','==',false),limit(8))
        onSnapshot(q,snaps=>{
            const arr=[]
            snaps.docs.forEach(async (item,index)=>{
                arr.push({
                    src:item.data().picture,
                    title:item.data().title,
                    type:item.data().categoryID,
                    time:new Date(item.data().createAt.seconds*1000).toLocaleDateString(),
                    author:item.data().authorID,
                    slug:item.data().slug
                })
                if(arr.length===snaps.docs.length){
                    setData(arr)
                }
            })

        })
    },[])
    return ( 
        <div className={styles.newest}>
            <Title title="Latest posts" color='#3A1097'/>
            {
                data.length>0&&<div className={styles.parent}>
                {
                    first&&<ItemNew 
                        src={`/images/${first?.src}`} title={first?.title}
                        type={first?.type} time={first?.time} author={first?.author} y width="48%" height="100%"
                        backgroundType='#F3EDFF' widthImg='100%' to={first?.slug}
                    />
                }
                <div className={styles.right}>
                    {
                        second3&&second.map((item,index)=>(
                            <ItemNew 
                                key={index}
                                src={`/images/${item?.src}`} title={item?.title}
                                type={item?.type} time={item?.time} author={item?.author} x width="100%" height="30%"
                                backgroundType='#ffffff' widthImg='35%' fontSize='18px' line='24px' h3='#232323'
                                widthNew='60%'
                                to={item?.slug}
                            />
                    ))
                    }
                </div>
            </div>
            }
            {
                third.length>0&&<DemoNewest
                                third={third} demoNewest
                            />
            }
        </div>
     );
}

export default Newest;