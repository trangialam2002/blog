import styles from './paging.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from 'react'


function Paging({currentPageRef,add,bottom,count=0,quantity=0,changePage=()=>{},len=0}) {
    const Ncount=Math.ceil(count/quantity)
    const arr=new Array(Ncount)
    for(let i=0;i<=Ncount-1;i++){
        arr.fill(i+1,i,i+1)
    }

    const [start,setStart]=useState(0)
    const [end,setEnd]=useState(add)
    const [pageCurrent,setPageCurrent]=useState(1)

    const countRef=useRef(Ncount)

    const handleStart=()=>{
        {
            if(pageCurrent===1) return
            if(pageCurrent>start+1){
                setPageCurrent(pageCurrent-1)
            }else{
                setStart(start-add)
                setEnd(end-add)
                setPageCurrent(pageCurrent-1)
            }
            changePage(pre=>pre-quantity)
        }
    }
    const handleNext=()=>{
        {
            if(pageCurrent===Ncount) return
            if(pageCurrent<end) setPageCurrent(pageCurrent+1)
            else{
                setStart(start+add)
                setEnd(end+add)
                setPageCurrent(pageCurrent+1)
            }
            changePage(pre=>pre+quantity)
        }
    }
    useEffect(()=>{
        if(count>countRef.current)
            countRef.current=count
    },[count])

    useEffect(()=>{
        console.log('pageCurrent',pageCurrent);
            console.log('Ncount',Ncount);
            console.log('count',count);
        if(countRef.current>count&&pageCurrent>=Ncount){
            
            setPageCurrent(Ncount)
        }
    },[len])

    useEffect(()=>{
        currentPageRef.current.setStart=setStart
        currentPageRef.current.setEnd=setEnd
    },[])
    
    return ( 
        <div className={styles.paging} style={{bottom:bottom}}>
            {pageCurrent>1&&<span onClick={handleStart}><FontAwesomeIcon icon={faChevronLeft}/></span>}
            <ul>
                {
                    arr.slice(start,end).map((item,index)=>(
                        <li key={index} style={pageCurrent===item?{background: "#afd87a",color:'white'}:{}}
                            onClick={()=>{
                                changePage(item*quantity)
                                setPageCurrent(item)
                            }}
                        >{item}</li>
                    ))
                }
            </ul>
            {pageCurrent<Ncount&&<span onClick={handleNext}><FontAwesomeIcon icon={faChevronRight}/></span>}
        </div>
     );
}

export default Paging;