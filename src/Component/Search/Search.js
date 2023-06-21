import styles from './search.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClose, faSearch, faSpinner} from '@fortawesome/free-solid-svg-icons'
import Button from '../Button/Button'
import { loginContext } from '../../App'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import HeadlessTippy from '@tippyjs/react/headless'
import ItemTippy from './ItemTippy/ItemTippy'
import Title from '../Content/Title/Title'
import useDebounce from '../../Hook/useDebounce'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../Firebase/firebase-config'

function Search({placeholder,color,...props}) {
    const getFirstName=useMemo(()=>(
        (name='')=>{
            const list=name?.split(' ')
            return list[list.length-1]
    }
    ))
    const getCategory=useCallback(async (id)=>{
        const cateRef=doc(db,'category',id)
        const cate=await getDoc(cateRef)
        return cate.data().title
    },[])
    const userInfo=useContext(loginContext)
    const originRef=useRef([])

    const [value,setValue]=useState('')
    const [isLoading,setIsLoading]=useState(false)
    const [close,setClose]=useState(false)
    const [data,setData]=useState([])
    const debounce=useDebounce(value,800)
    console.log(data);
    useEffect(()=>{
        if(!debounce){
            setIsLoading(false)
            return
        }
        const colRef=collection(db,'posts')
        getDocs(colRef).then(res=>{
            const arr=res.docs.filter(item=>(
                item.data().title.includes(debounce)
            ))
            const list=[]
            arr.forEach(async item=>{
                list.push({
                    src:item.data().picture,
                    title:item.data().title,
                    slug:item.data().slug,
                    category:await getCategory(item.data().categoryID)
                })
                setData(list)
                originRef.current=list
            })
            
        })

        setClose(true)
        setIsLoading(false)
    },[debounce])
    return ( 
        <div className={styles.search}>
            <HeadlessTippy
            onClickOutside={()=>setData([])}
                interactive
                visible={!!value&&close&&data.length>0}
                render={attrs=>(
                    <div className={styles.tippy} tabIndex='-1' {...attrs}>
                        <div className={styles.h3}>
                            <Title title='List Posts' color='#3A1097' tippy/>
                        </div>
                        <div className={styles.content}>
                            {
                                data.map((item,index)=>{
                                    console.log(item)
                                    return <ItemTippy 
                                        key={index}
                                        src={item.src}
                                        title={item.title}
                                        slug={item.slug}
                                        cate={item.category}
                                    />
                            })
                            }
                            
                        </div>
                    </div>
                )}
            >
                <input placeholder={placeholder} {...props}
                    value={value}
                    onChange={e=>{
                        setValue(e.target.value)
                        setIsLoading(true)
                        setClose(false)
                    }
                    }
                    onFocus={()=>setData(originRef.current)}
                />
            </HeadlessTippy>
            {close&&<span 
                onClick={()=>{
                                setClose(false)
                                setValue('')
                            }
                        }
                    ><FontAwesomeIcon icon={faClose}/></span>}
            {isLoading&&<span className={styles.rotate}><FontAwesomeIcon icon={faSpinner}/></span>}
            <div className={styles.status}>
            {
                !userInfo?
                    <Button width="100%" height="40px" isTo="/sign-up">Sign Up</Button>
                    :
                    <p>Hi, <strong style={{color:color}}>{getFirstName(userInfo.displayName)}</strong></p>
            }
            </div>
        </div>
     );
}

export default Search;