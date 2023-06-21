import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import styles from './toggle.module.scss'
import {useImperativeHandle} from 'react'

function Toggle({...props},toggleParentRef) {
    const [toggle,setToggle]=useState(false)
    const toggleRef=useRef()
    
    useImperativeHandle(toggleParentRef,()=>{
        return {
            [toggleRef.current.name]:toggleRef.current,
            setToggle
        }
    })
    useEffect(()=>{
        setToggle(toggleRef.current.value==='false'?false:true)
    },[props.value])
    return ( 
        <div className={styles.featurepost}>
            <label>Feature Post</label>
            <input type="checkbox" name='toggle'
                {...props}
                ref={toggleRef}
            />
            <div className={!toggle?styles.parentToggle:styles.parentToggle2}>
                <span className={toggle?styles.childToggle2:styles.childToggle1}></span>
            </div>
        </div>
     );
}

export default memo(forwardRef(Toggle));