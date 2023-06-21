import { useEffect, useMemo, useRef, useState } from 'react';
import Loading from '../Button/Loading/Loading';
import UploadFile from '../UploadFile/UploadFile';
import styles from './profile.module.scss'
import Button from '../Button/Button';
import Radio from '../Radio/Radio';
import Input from '../AddPost/Input/Input';
import { useFormik } from 'formik';
import * as yup from 'yup'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { auth, db } from '../../Firebase/firebase-config';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../UpdatePost/quill.css'

function DashboardProfile() {
    const style1=useMemo(()=>(
        {
            background: 'white',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            margin: '30px auto',
            border: '3px dashed #ececec',
            alignItems:'center',
            justifyContent:'center',
            position:'relative'
        }
    ))
    const style2=useMemo(()=>(
        {
            background: 'white',
            width:'70%',
            height:'100px'
        }
    ))
    const style3=useMemo(()=>(
        {
            position:'absolute',
            top:'-30px'
        }
    ))
    const style4=useMemo(()=>(
        {
            top: '42px',
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '50%'
        }
    ))
    const style5=useMemo(()=>(
        {
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'Montserrat',
            fontWeight: 600,
            width: '100%',
            textAlign: 'center',
            color: 'white',
            fontSize: '12px'
        }
    ))
    const [isLoading,setIsLoading]=useState(false)
    const [done,setDone]=useState(false)

    const navigate=useNavigate()

    const [valueQuill,setValueQuill]=useState('')

    const uploadRef=useRef()
    const textRef=useRef()
    const statusRef=useRef()
    const roleRef=useRef()

    const formik=useFormik({
        initialValues:{
            username:'',
            email:'',
            password:'',
            status:'Pending',
            role:'User',
            upload:''
        },
        validationSchema:yup.object({
            username:yup.string().required('Username empty'),
            email:yup.string().required('Email empty').email('Email sai định dạng'),
            upload:yup.string().required('Photo not select'),
            password:yup.string().required('Password empty').min(6,'Tối thiểu 6 kí tự').max(15,'Tối đa 15 kí tự'),
        }),
        onSubmit:async values=>{
            try {
                setIsLoading(true)
                const a=await createUserWithEmailAndPassword(auth,values.email,values.password)
                await updateProfile(auth.currentUser,{
                    displayName:values.username
                })
                const docRef=doc(db,'users',auth.currentUser.uid)
                const split_upload=values.upload.split('\\')
                await setDoc(docRef,{
                    avatar:split_upload.reverse()[0],
                    createdAt:serverTimestamp(),
                    mail:values.email,
                    name:values.username,
                    pass:values.password,
                    role:values.role,
                    status:values.status,
                    description:valueQuill
                })
                navigate('/dashboard-user')
                Swal.fire('Thêm tài khoản thành công','','success')
                setDone(true)
                setIsLoading(false)
            } catch (error) {
                Swal.fire('Thêm tài khoản thất bại','','error')
                setIsLoading(false)
            }
        }
    })
    console.log(formik);

    useEffect(()=>{
        textRef.current.email.value=''
        formik.values.email=''

        textRef.current.username.value=''
        formik.values.username=''

        textRef.current.password.value=''
        formik.values.password=''

        statusRef.current.Active.checked=false
        statusRef.current.Pending.checked=true
        statusRef.current.Banned.checked=false
        formik.values.status='Pending'

        roleRef.current.Admin=false
        roleRef.current.Moderator=false
        roleRef.current.User=true
        formik.values.role='User'

        uploadRef.current.setSrc()
        formik.values.upload=''
        setDone(false)
    },[done])

    return ( 
        <form className={styles.dashboardProfile} onSubmit={formik.handleSubmit}>
            <h3>Add new user to system</h3>
            <div className={styles.wrap}>
                <UploadFile 
                    style={{style1,style2,style4,style5}}
                    value={formik.values.upload}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={uploadRef}
                >
                    {formik.errors.upload&&formik.touched.upload&&<span style={style3}>{formik.errors.upload}</span>}
                </UploadFile>
                <div className={styles.contentAdd} style={{margin:0}}>
                    <Input 
                        name='username'
                        placeholder='Enter your name'
                        title="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        ref={textRef}
                    >
                         {formik.errors.username&&formik.touched.username&&<span>{formik.errors.username}</span>}
                    </Input>
                    <Input 
                        name='email'
                        placeholder='Enter your email'
                        title="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        ref={textRef}
                    >
                    {formik.errors.email&&formik.touched.email&&<span>{formik.errors.email}</span>}
                    </Input>
                    <Input 
                        name='password'
                        placeholder='Enter your password'
                        title="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        ref={textRef}
                    >
                    {formik.errors.password&&formik.touched.password&&<span>{formik.errors.password}</span>}
                    </Input>
                
                    <Radio 
                        name='status'
                        title='Status' 
                        value1={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        ref={statusRef}
                        format='profile-status'
                    />
                    
                    <Radio
                        name='role' 
                        title='Role' 
                        value1={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        ref={roleRef}
                        format='profile-role'
                    />
                    
                    <div className={styles.customQuill}>
                        <label>Content</label>
                        <ReactQuill theme="snow" value={valueQuill} onChange={setValueQuill} />
                    </div>
                    
                </div>
            </div>
            <Button
                type='submit' width='200px' height='40px' isLoading={isLoading} isAddpost
                empty={formik.values} error={Object.values(formik.errors).length} 
                belong='profile'>
                    {isLoading?<Loading/>:'Add new user'}
                </Button>
        </form>
     );
}

export default DashboardProfile;