import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './updateProfile.module.scss'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../Firebase/firebase-config'
import UploadFile from '../UploadFile/UploadFile'
import Input from '../AddPost/Input/Input'
import Radio from '../Radio/Radio'
import Button from '../Button/Button'
import Loading from '../Button/Loading/Loading'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../UpdatePost/quill.css'


function UpdateProfile() {
    const style1={
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
    const style2={
        background: 'white',
        width:'70%',
        height:'100px'
    }
    const style3={
        position:'absolute',
        top:'-30px'
    }
    const style4={
        top: '42px',
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '50%'
    }
    const style5={
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

    const navigate=useNavigate()
    const [useSearchParam,setUseSearchParam]=useSearchParams()
    const param=useSearchParam.get('id')

    const [getDocData,setGetDocData]=useState([])
    const [isLoading,setIsLoading]=useState(false)

    const [valueQuill,setValueQuill]=useState('')

    const formik=useFormik({
        initialValues:{
            username:'default',
            email:'default',
            password:'default',
            upload:'default',
            status:'default',
            role:'default',
        },
        validationSchema:yup.object({
            username:yup.string().required('Title empty'),
            email:yup.string().required('Email empty'),
            password:yup.string().required('Password empty').min(6,'Tối thiểu 6 kí tự').max(15,'Tối đa 15 kí tự'),
            upload:yup.string().required('Photo not select'),
        }),
        onSubmit:async values=>{
            Swal.fire({
                title: 'Xác nhận lưu thông tin?',
                text: 'Cập nhật thông tin user',
                icon: 'warning',
                showCancelButton:true,
                confirmButtonColor:'#3085d6',
                cancelButtonColor:"#d33",
                confirmButtonText: 'Đồng ý!'
              }).then(async(res)=>{
                if(res.isConfirmed){
                    try {
                        setIsLoading(true)
                        const docRef=doc(db,'users',param)
                        await updateDoc(docRef,{
                                name:values.username==='default'?getDocData[0].username:values.username,
                                status:values.status==='default'?getDocData[0].status:values.status,
                                role:values.role==='default'?getDocData[0].role:values.role,
                                avatar:values.upload==='default'?getDocData[0].upload:values.upload.split('\\').reverse()[0],
                                pass:values.password==='default'?getDocData[0].password:values.password,
                                mail:values.email==='default'?getDocData[0].email:values.email,
                                description:valueQuill
                            })
                        setIsLoading(false)
                        Swal.fire('Đã xong!','Thông tin user đã được cập nhật','success')
                        navigate('/dashboard-user')
                    } catch (error) {
                        console.log(error)
                        setIsLoading(false)
                    }
                }
              })
        }
    })
    
    useEffect(()=>{
        const docRef=doc(db,'users',param)
        getDoc(docRef).then(res=>{
            getDocData.push({
                upload:res.data()?.avatar,
                email:res.data().mail,
                username:res.data().name,
                password:res.data().pass,
                role:res.data().role,
                status:res.data().status,
            })
            setGetDocData([...getDocData])
            setValueQuill(res.data().description)
        })
    },[param])
    
   
    if(!param) return null
    return ( 
        <form className={styles.dashboardProfile} onSubmit={formik.handleSubmit}>
            <h3>Update user</h3>
            <p>Update your user id:{param}</p>
            <div className={styles.wrap}>
                <UploadFile 
                    style={{style1,style2,style4,style5}}
                    value={formik.values.upload!=='default'?formik.values.upload:getDocData[0]?.upload}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    {formik.errors.upload&&formik.touched.upload&&<span style={style3}>{formik.errors.upload}</span>}
                </UploadFile>
                <div className={styles.contentAdd} style={{margin:0}}>
                    <Input 
                        name='username'
                        placeholder='Enter your name'
                        title="Username"
                        value={formik.values.username!=='default'?formik.values.username:getDocData[0]?.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                         {formik.errors.username&&formik.touched.username&&<span>{formik.errors.username}</span>}
                    </Input>
                    <Input 
                        name='email'
                        placeholder='Enter your email'
                        title="Email"
                        value={formik.values.email!=='default'?formik.values.email:getDocData[0]?.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        dashboardType='profile'
                    >
                    {formik.errors.email&&formik.touched.email&&<span>{formik.errors.email}</span>}
                    </Input>
                    <Input 
                        name='password'
                        placeholder='Enter your password'
                        title="Password"
                        value={formik.values.password!=='default'?formik.values.password:getDocData[0]?.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                    {formik.errors.password&&formik.touched.password&&<span>{formik.errors.password}</span>}
                    </Input>
                
                    <Radio 
                        name='status'
                        title='Status' 
                        value1={formik.values.status!=='default'?formik.values.status:getDocData[0]?.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        format='profile-status'
                    />
                    
                    <Radio
                        name='role' 
                        title='Role' 
                        value1={formik.values.role!=='default'?formik.values.role:getDocData[0]?.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                    {isLoading?<Loading/>:'Update user'}
                </Button>
        </form>
     );
}

export default UpdateProfile;