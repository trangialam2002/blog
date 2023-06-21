import { useEffect, useState } from 'react';
import './leftBlog.css'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../../Firebase/firebase-config';
import parse from 'html-react-parser'
import { Link } from 'react-router-dom';

function LeftBlog() {
    const [data,setData]=useState([])
    useEffect(()=>{
        const colRef=collection(db,'posts')
        const q=query(colRef,limit(4))
        const arr=[]
        getDocs(q).then(res=>{
            res.docs.forEach(item=>{
                arr.push({
                    src:item.data().picture,
                    title:item.data().title,
                    type:item.data().categoryID,
                    time:new Date(item.data().createAt.seconds*1000).toLocaleDateString(),
                    author:item.data().authorID,
                    slug:item.data().slug,
                    content:item.data().content
                })
            })
            setData(arr)
        })
    },[])
    return ( 
        <div className="box_left">
            {
                data.map((item,index)=>{
                    return <div className="box" key={index}>
                        <Link to={`/blog/${item.slug}`}>
                            <img src={`/images/${item?.src}`} alt=""/>
                        </Link>
                        <div className="n1">
                        <p>{item?.title}</p>
                        <span>{`Ngày đăng: ${item?.time}`}</span>
                        <small>{`${item?.content?.slice(120,200)}...`}</small>
                        <Link to={`/blog/${item.slug}`}>Xem thêm <span className="fa fa-long-arrow-right"></span></Link>
                        </div>
                    </div>
            })
            }

        </div>
     );
}

export default LeftBlog;