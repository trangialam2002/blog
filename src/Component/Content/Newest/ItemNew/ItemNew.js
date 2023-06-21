import { Link } from 'react-router-dom'
import styles from './itemNew.module.scss'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../Firebase/firebase-config'


function ItemNew({src,title,type,time,author,x=false,y=false,width=0,height=0,width_author=0,to='',marginTop=0,backgroundType='',widthImg=0,widthNew=0,h3='#fff',fontSize=0,line=0,demoNewest=false}) {
    const css={}
    const css_author={}
    if(y||x){
        css.width=width
        css.height=height
        css.marginTop=marginTop
    }
    if(width_author){
        css_author.width=width_author
    }
    const [info,setInfo]=useState({})
    useEffect(()=>{
        if(type&&author){
            async function handleGetData(){
                    const docRefCate=doc(db,'category',type?.trim())
                    let title='lala'
                    await getDoc(docRefCate).then(res=>{
                        title=res?.data()?.title
                    })
                    const docRefAuthor=doc(db,'users',author)
                    let name='lala'
                    await getDoc(docRefAuthor).then(res=>{
                        name=res?.data()?.name
                    })
                    setInfo({title,name})
                }
            handleGetData()
        }
    },[type,author])
    return ( 
            y&&!x?
            <div className={styles.childY} style={css}>
                {
                    to?<Link to={'/blog/'+to} style={{width:widthImg}} ><img src={src} alt="" style={demoNewest?{width:'255px',height:'170px'}:{}}/></Link>
                    :<a style={{width:widthImg}}><img src={src} alt="" style={demoNewest?{width:'255px',height:'170px'}:{}}/></a>
                }
                <p style={{backgroundColor:backgroundType}}>
                    <Link to={`/category/${info.title}`}>{info.title}</Link>
                </p>
                <h3 style={{fontSize:'17px'}}>{to?<Link to={'/blog/'+to}>{title}</Link>:<a>{title}</a>}</h3>
                <div className={styles.time_author} style={css_author}>
                    <span>{time}</span>
                    <ul>
                        <li>{info.name}</li>
                    </ul>
                </div>
            </div>
            :
            <div className={styles.childX} style={css}>
                {
                    to?<Link to={'/blog/'+to} className={styles.img} style={{width:widthImg}}><img src={src} alt="" style={demoNewest?{width:'255px',height:'170px'}:{}}/></Link>
                        :<a className={styles.img} style={{width:widthImg}}><img src={src} alt="" style={demoNewest?{width:'255px',height:'170px'}:{}}/></a>
                }
                <div className={styles.new} style={{width:widthNew}}>
                    <p style={{backgroundColor:backgroundType}}>
                        <Link to={`/category/${info.title}`}>{info.title}</Link>
                    </p>
                    <h3 style={{color:h3,fontSize:fontSize,lineHeight:line}}>{to?<Link to={'/blog/'+to}>{title}</Link>:<a>{title}</a>}</h3>
                    <div className={styles.time_author} style={css_author}>
                        <span>{time}</span>
                        <ul>
                            <li>{info.name}</li>
                        </ul>
                    </div>
                </div>
            </div>
     );
}

export default ItemNew;