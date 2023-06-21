import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './radio.module.scss'

function Radio({name,format,value1,title,...props},ref) {
    const ref1=useRef({})
    const ref2=useRef({})
    const ref3=useRef({})
    useImperativeHandle(ref,()=>{
        return {
            [ref1.current.value]:ref1.current,
            [ref2.current.value]:ref2.current,
            [ref3.current.value]:ref3.current,
        }
    })
   
    return ( 
        <div className={styles.radio}>
            <label>{title}</label>
            <div className={styles.option}>
                <input type='radio' value={format==='add-post'&&'Approved'||format==='profile-status'&&'Active'||format==='profile-role'&&'Admin'} name={name} id={`${name}1`} {...props}
                    checked={value1==='Approved'||value1==='Active'||value1==='Admin'?true:false}
                    ref={ref1}
                />
                <label htmlFor={`${name}1`}>
                    {format==='add-post'&&'Approved'||format==='profile-status'&&'Active'||format==='profile-role'&&'Admin'}
                </label>

                <input type='radio' value={format==='add-post'&&'Pending'||format==='profile-status'&&'Pending'||format==='profile-role'&&'Moderator'} name={name} id={`${name}2`} {...props} 
                    checked={['Pending','Moderator'].includes(value1)?true:false}
                    ref={ref2}
                />
                <label htmlFor={`${name}2`}>
                    {format==='add-post'&&'Pending'||format==='profile-status'&&'Pending'||format==='profile-role'&&'Moderator'}
                </label>

                <input type='radio' value={format==='add-post'&&'Reject'||format==='profile-status'&&'Banned'||format==='profile-role'&&'User'} name={name} id={`${name}3`} {...props}
                    checked={['Reject','Banned','User'].includes(value1)?true:false}
                    ref={ref3}
                />
                <label htmlFor={`${name}3`}>
                    {format==='add-post'&&'Reject'||format==='profile-status'&&'Banned'||format==='profile-role'&&'User'}
                </label>
            </div>
        </div>
     );
}

export default memo(forwardRef(Radio));