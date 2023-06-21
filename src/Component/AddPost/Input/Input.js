import { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './input.module.scss'
function Input({dashboardType='',children,name,placeholder,title,...props},ref) {
    const inputRef=useRef()
    useImperativeHandle(ref,()=>{
        return {
            ...ref.current,
            [inputRef.current.name]:inputRef.current
        }
    })
    return ( 
        <div className={styles.input}>
            {children}
            <label htmlFor={name}>{title}</label>
            <input name={name} id={name} placeholder={placeholder} {...props} ref={inputRef} readOnly={dashboardType==='profile'&&name==='email'||dashboardType==='profile'&&name==='mail'?true:false}/>
        </div>
     );
}

export default forwardRef(Input);