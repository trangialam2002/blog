import ItemNew from '../../Component/Content/Newest/ItemNew/ItemNew';
import styles from './detail.module.scss'
import { listImg } from '../../assets/images';
import ChapterDetail from '../../Component/ChapterDetail/ChapterDetail';
import Author from '../../Component/Author/Author';
import Title from '../../Component/Content/Title/Title';
import Demo from '../../Component/Content/Demo/Demo';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';



function Detail() {
    const [content,setContent]=useState({})
    const [infoAuthor,setInfoAuthor]=useState({})
    const {detail}=useParams()
    useEffect(()=>{
        const colRef=collection(db,'posts')
        const q=query(colRef,where('slug','==',detail))
        getDocs(q).then(res=>{
            setContent({
                idPost:res.docs[0].id,
                ...res.docs[0].data()
            })
        })
    },[detail])
    useEffect(()=>{
        if(content.authorID){
            const getInfoAuthor=async()=>{
                const docRefAuthor=doc(db,'users',content.authorID)
                await getDoc(docRefAuthor).then(res=>{
                    setInfoAuthor({
                        name:res.data().name,
                        src:res.data().avatar,
                        des:res.data().description
                    })
                })
            }
            getInfoAuthor()
        }
    },[content.authorID])

    return ( 
        <div className={styles.detail}>
            <ItemNew
                src={`/images/${content.picture}`}
                title={content.title}
                type={content.categoryID}
                time={new Date(content.createAt?.seconds*1000).toLocaleDateString()}
                author={content.authorID}
                x
                width='70%'
                height='300px'
                width_author='45%'
                marginTop='110px'
                backgroundType='#F3EDFF' widthImg='55%'
                widthNew='45%' h3='#23BB86' fontSize='25px' line='40px'
            />
            <div className={styles.body}>
                <ChapterDetail 
                    text={content.content}
                    img={listImg[3]}
                    nameImg='Gastronomy atmosphere set aside. Slice butternut cooking home.'
                />
                <Author src={`/images/${infoAuthor.src}`} authorName={infoAuthor.name} 
                    desAuthor={infoAuthor.des||'chưa có mô tả'}/>
            </div>
            <div className={styles.similar}>
                <Title title='Bài viết liên quan' color='#23BB86'/>
                <Demo detail={content.categoryID} idPost={content.idPost} demoNewest/>
            </div>
        </div>
     );
}

export default Detail;