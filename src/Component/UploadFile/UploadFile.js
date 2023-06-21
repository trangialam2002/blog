import styles from './upload.module.scss'
import {forwardRef, memo, useEffect, useImperativeHandle, useRef, useState} from 'react'
function UploadFile({style={},children,value,...props},ref) {
    const [src,setSrc]=useState()
    const [upload,setUpload]=useState(false)
    const updateRef=useRef()
    useImperativeHandle(ref,()=>{
        return {
            setSrc
        }
    })

    useEffect(()=>{
        console.log('fect...');
        value&&setUpload(true)
        if(value){
            var id=setTimeout(()=>{
            setSrc(updateRef.current?.files[0]?.name||value)
            setUpload(false)
        },1000)
    }
    return ()=>{
        console.log('unmount',id);
        clearTimeout(id)
    }
    },[value])
    return ( 
        <div className={styles.upload} style={style.style1}>
            {children}
            {!Object.values(style).length>0&&<label>Image</label>}
            <div className={styles.file} style={style.style2}>
                <input type='file' name='upload' {...props} ref={updateRef}/>
                <img src={src?`images/${src}`:'https://cdn-icons-png.flaticon.com/512/3176/3176167.png'} alt=''
                    style={style.style4}
                />
                <span style={style.style5}>{src?'Change photo':'Choose photo'}</span>
                <p className={upload?styles.progress:{}} ></p>
            </div>
        </div>
     );
}

export default memo(forwardRef(UploadFile));