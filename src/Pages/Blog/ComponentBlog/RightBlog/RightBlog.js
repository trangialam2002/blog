import { useEffect, useState } from 'react'
import './rightBlog.css'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../../../../Firebase/firebase-config'
import { Link } from 'react-router-dom'
function RightBlog() {
    const [data,setData]=useState([])
    useEffect(()=>{
        const colRef=collection(db,'posts')
        const q=query(colRef,orderBy('createAt'),limit(4))
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
        <div className="box_right">
            <h3>DANH MỤC BLOG</h3>

            <div className="khoi1">
            <h4>BÀI VIẾT MỚI NHẤT</h4>
            {
                data.map((item,index)=>(
                    <div className="layout" key={index}>
                        <Link to={`/blog/${item?.slug}`}>
                            <img src={`/images/${item?.src}`} alt=""/>
                        </Link>
                        <div className="noidung1">
                            <p>{item.title.length>30?item?.title?.slice(0,30)+'...':item?.title}</p>
                            <span><span className="fa fa-clock-o"></span>{`${item?.time}`}</span>
                        </div>
                    </div>
                ))
            }
            </div>
		</div>
     );
}

export default RightBlog;