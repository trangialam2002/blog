import { memo, useEffect, useRef, useState } from 'react';
import Title from '../Title/Title';
import ItemFeature from './ItemFeature/ItemFeature';
import styles from './feature.module.scss'
import { listImg } from '../../../assets/images';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import { date } from 'yup';

function Feature({...props}) {
    let start=0
    let end=0
    const [featureData,setFeatureData]=useState([])
    const [authorData,setAuthorData]=useState([])
    const [listAuthorName,setListAuthorName]=useState([])
    
    const featureRef=useRef()
    const featureItemRef=useRef()
    const handleDragStart=e=>{
        start=e.screenX
    }
    const handleDragEnd=e=>{
        end=e.screenX
        if(end>start){
            featureRef.current.scrollLeft-=(end-start)
        }else{
            featureRef.current.scrollLeft+=(start-end)
        }
    }
    useEffect(()=>{
        if(featureData.length>0){
            let status=false
            const id=setInterval(()=>{
                if(parseInt(featureRef.current.scrollLeft)===0){
                    status=false
                }
                if(parseInt(featureRef.current.clientWidth)+Math.ceil(featureRef.current.scrollLeft)===featureRef.current.scrollWidth){
                    status=true
                }
                if(status){
                    featureRef.current.scrollLeft-=(featureItemRef.current.offsetWidth+10)
                }
                if(!status){
                    featureRef.current.scrollLeft+=(featureItemRef.current.offsetWidth+10)
                }
            },2000)
            return ()=>{
                console.log('un-mount');
                clearInterval(id)
            }
        }
    },[])

    useEffect(()=>{
            const colRef=collection(db,'posts')
            const q=query(colRef,where('status','==','Approved'),where('hot','==',true))
            onSnapshot(q,snap=>{
                const arr=new Array(snap.docs.length)
                snap.docs.forEach((item,index)=>{
                    arr.fill(item.data(),index,index+1)
                })
                setFeatureData(arr)
            })
    },[])

    useEffect(()=>{
       if(featureData.length>0){
            featureData.forEach(item=>{
                const idCate=item.categoryID
                const colCate=doc(db,'category',idCate)
                onSnapshot(colCate,snap=>{
                    setAuthorData(prev=>[...prev,snap.data().title])
                })
                const idAuthor=item.authorID
                const colAuthor=doc(db,'users',idAuthor)
                onSnapshot(colAuthor,snap=>{
                    setListAuthorName(prev=>[...prev,snap.data().name])
                })
            })
       }    
    },[featureData])

    const formatDate=(time)=>{
        const time1=new Date(time*1000)
        const outputTime=new Date(time1).toLocaleDateString('vi')
        return outputTime
    }    

    return ( 
        <div className={styles.feature}>
            <Title title="Feature" color='#3A1097'/>
            <div className={styles.slickFeature} draggable='true'
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                ref={featureRef}
            >
            {
                featureData.map((item,index)=>(
                    <ItemFeature
                    key={index}
                    ref={featureItemRef}
                    src={`images/${item.picture}`}
                    type={authorData.length===featureData.length?authorData[index].length>10?authorData[index].slice(0,10)+'...':authorData[index]:''}
                    fullType={authorData.length===featureData.length?authorData[index]:''}
                    time={formatDate(item.createAt.seconds)}
                    author={listAuthorName.length===featureData.length?listAuthorName[index].split(' ').slice(1,3).join('-'):''}
                    fullAuthor={listAuthorName.length===featureData.length?listAuthorName[index]:''}
                    title={item.title}
                    to={item.slug}
                />
                ))
            }
            </div>
        </div>
     );
}

export default memo(Feature);