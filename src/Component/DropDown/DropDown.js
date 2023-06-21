import styles from './dropDown.module.scss'
import { forwardRef, useEffect, useRef, useState } from 'react';


function DropDown({children,data,label,name,...props},ref) {
    const [hide,setHide]=useState(false)
    useEffect(()=>{
        return ()=>{
            setHide(true)
        }
    },[props.value])
    return ( 
        <div className={styles.dropdown}>
            {children}
            <label htmlFor={name}>{label}</label>
            <select name={name} id={name}  {...props} >
                {!hide&&<option value=''>Select an option</option>}
                {data.map((item,index)=>(
                    <option key={index} value={item.categoryId}>{item.title}</option>
                ))}
                
            </select>
        </div>
     );
}

export default forwardRef(DropDown);