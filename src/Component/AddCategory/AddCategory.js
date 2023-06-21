import { useRef, useState,useContext, useEffect } from 'react';
import Input from '../AddPost/Input/Input';
import Radio from '../Radio/Radio';
import styles from './addCategory.module.scss'
import {useFormik} from 'formik'
import Button from '../Button/Button';
import Loading from '../Button/Loading/Loading';
import * as yup from 'yup'
import { loginContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';

function AddCategory() {
    const user=useContext(loginContext)
    const navigate=useNavigate()
    !user.displayName&&navigate('/sign-in')

    const [isLoading,setIsLoading]=useState(false)
    const [done,setDone]=useState(false)

    const textRef=useRef({})
    const statusRef=useRef()

    const formik=useFormik({
        initialValues:{
            title:'',
            slug:'',
            status:'Pending'
        },
        validationSchema:yup.object({
            title:yup.string().required('Title empty'),
            slug:yup.string().required('Slug empty'),
        }),
        onSubmit:async values=>{
            try {
                setIsLoading(true)
                console.log(values)
                const colRef=collection(db,'category')
                await addDoc(colRef,{
                    title:values.title,
                    slug:values.slug,
                    status:values.status,
                    createAt:serverTimestamp()
                })
                alert('Thêm danh mục thành công')
                setIsLoading(false)
                setDone(true)
            } catch (error) {
                alert('Thêm danh mục thất bại')
                setIsLoading(false)           
            }
        }
    })
    useEffect(()=>{
        textRef.current.title.value=''
        formik.values.title=''

        textRef.current.slug.value=''
        formik.values.slug=''
        
        statusRef.current.Approved.checked=false
        statusRef.current.Pending.checked=true
        statusRef.current.Reject.checked=false
        formik.values.status='Pending'
        setDone(false)
    },[done])
    return ( 
        <form className={styles.addPost} onSubmit={formik.handleSubmit}>
            <h3>Add new category</h3>
               
            <div className={styles.contentAdd}>
                <Input 
                    name='title'
                    placeholder='Enter your title'
                    title="Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={textRef}
                >
                     {formik.errors.title&&formik.touched.title&&<span>{formik.errors.title}</span>}
                </Input>
                <Input 
                    name='slug'
                    placeholder='Enter your slug'
                    title="Slug"
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={textRef}
                >
                {formik.errors.slug&&formik.touched.slug&&<span>{formik.errors.slug}</span>}
                </Input>
            
                <Radio title='Status' 
                    value1={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={statusRef}
                    name='status'
                    format='add-post'
                />
            </div>
            <Button
                type='submit'
                width='250px' height='40px' empty={formik.values} isLoading={isLoading} isAddpost
                error={Object.values(formik.errors).length} belong='addcategory'>
                    {isLoading?<Loading/>:'Add new category'}
                </Button>
        </form>
     
     );
}

export default AddCategory;