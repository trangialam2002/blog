import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './updateCategory.module.scss'
import Input from '../AddPost/Input/Input';
import Radio from '../Radio/Radio';
import Button from '../Button/Button';
import Loading from '../Button/Loading/Loading';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { memo, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, query, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';
import Swal from 'sweetalert2';



function UpdateCategory() {
    const navigate=useNavigate()
    const [useSearchParam,setUseSearchParam]=useSearchParams()
    const param=useSearchParam.get('id')

    const [getDocData,setGetDocData]=useState([])
    const [isLoading,setIsLoading]=useState(false)

    const formik=useFormik({
        initialValues:{
            title:'default',
            slug:'default',
            status:'default',
        },
        validationSchema:yup.object({
            title:yup.string().required('Title empty'),
            slug:yup.string().required('Slug empty'),
        }),
        onSubmit:async values=>{
            Swal.fire({
                title: 'Xác nhận lưu thông tin?',
                text: 'Cập nhật thông tin danh mục',
                icon: 'warning',
                showCancelButton:true,
                confirmButtonColor:'#3085d6',
                cancelButtonColor:"#d33",
                confirmButtonText: 'Đồng ý!'
              }).then(async(res)=>{
                if(res.isConfirmed){
                    try {
                        setIsLoading(true)
                        const docRef=doc(db,'category',param)
                        await updateDoc(docRef,{
                                title:values.title==='default'?getDocData[0].title:values.title,
                                slug:values.slug==='default'?getDocData[0].slug:values.slug,
                                status:values.status==='default'?getDocData[0].status:values.status
                            })
                        setIsLoading(false)
                        Swal.fire('Đã xong!','Danh mục của bạn đã được cập nhật','success')
                        navigate('/dashboard-category')
                        
                    } catch (error) {
                        console.log(error)
                        setIsLoading(false)
                    }
                }
              })
        }
    })
    
    useEffect(()=>{
        const docRef=doc(db,'category',param)
        getDoc(docRef).then(res=>{
            getDocData.push({
                title:res.data().title,
                status:res.data().status,
                slug:res.data().slug
            })
            setGetDocData([...getDocData])
            
        })
    },[param])
   
    if(!param) return null
    
    return ( 
        <form className={styles.updateCategory} onSubmit={formik.handleSubmit}>
            <h3>Update category</h3>
            <p>Update your category id:{param}</p>
               
            <div className={styles.contentAdd}>
                <Input 
                    name='title'
                    placeholder='Enter your title'
                    title="Title"
                    value={formik.values.title!=='default'?formik.values.title:getDocData[0]?.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                     {formik.errors.title&&formik.touched.title&&<span>{formik.errors.title}</span>}
                </Input>
                <Input 
                    name='slug'
                    placeholder='Enter your slug'
                    title="Slug"
                    value={formik.values.slug!=='default'?formik.values.slug:getDocData[0]?.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                {formik.errors.slug&&formik.touched.slug&&<span>{formik.errors.slug}</span>}
                </Input>
            
                <Radio 
                    name='status'
                    title='Status' 
                    value1={formik.values.status!=='default'?formik.values.status:getDocData[0]?.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    format='add-post'
                />
            </div>
            <Button
                type='submit'
                width='250px' height='40px' empty={formik.values} isLoading={isLoading} isAddpost
                error={Object.values(formik.errors).length} belong='addcategory'>
                    {isLoading?<Loading/>:'Update category'}
                </Button>
        </form>
     );
}

export default memo(UpdateCategory);