import { useNavigate, useSearchParams } from 'react-router-dom'
import { auth, db } from '../../Firebase/firebase-config'
import styles from './updatePost.module.scss'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'
import Input from '../AddPost/Input/Input'
import Radio from '../Radio/Radio'
import DropDown from '../DropDown/DropDown'
import Toggle from '../Toggle/Toggle'
import UploadFile from '../UploadFile/UploadFile'
import Button from '../Button/Button'
import Loading from '../Button/Loading/Loading'
import './quill.css'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const handleGetUserFromPost=async idUser=>{
    console.log('id',idUser)
    const docRef=doc(db,'users',idUser)
    let name='lala'
    await getDoc(docRef).then(res=>{
        name=res?.data()?.name
    })
    return name
}

function UpdatePost() {
    const [dataCategory,setDataCategory]=useState([])

    const navigate=useNavigate()
    const [useSearchParam,setUseSearchParam]=useSearchParams()
    const param=useSearchParam.get('id')

    const [getDocData,setGetDocData]=useState([])
    const [isLoading,setIsLoading]=useState(false)

    const [valueQuill,setValueQuill]=useState('')

    const formik=useFormik({
        initialValues:{
            title:'default',
            slug:'default',
            toggle:'default',
            category:'default',
            status:'default',
            upload:'default',
        },
        validationSchema:yup.object({
            title:yup.string().required('Title empty'),
            slug:yup.string().required('Slug empty'),
            upload:yup.string().required('Photo not select'),
            category:yup.string().required('Category not select')
        }),
        onSubmit:async values=>{
            Swal.fire({
                title: 'Xác nhận lưu thông tin?',
                text: 'Cập nhật thông tin bài viết',
                icon: 'warning',
                showCancelButton:true,
                confirmButtonColor:'#3085d6',
                cancelButtonColor:"#d33",
                confirmButtonText: 'Đồng ý!'
              }).then(async(res)=>{
                if(res.isConfirmed){
                    try {
                        setIsLoading(true)
                        const docRef=doc(db,'posts',param)
                        await updateDoc(docRef,{
                                title:values.title==='default'?getDocData[0].title:values.title,
                                status:values.status==='default'?getDocData[0].status:values.status,
                                slug:values.slug==='default'?getDocData[0].slug:values.slug,
                                picture:values.upload==='default'?getDocData[0].upload:values.upload.split('\\').reverse()[0],
                                hot:values.toggle==='default'?getDocData[0].toggle:values.toggle,
                                categoryID:values.category==='default'?getDocData[0].category:values.category,
                                content:valueQuill
                            })
                        setIsLoading(false)
                        Swal.fire('Đã xong!','Thông tin bài viết đã được cập nhật','success')
                        navigate('/dashboard-post')
                    } catch (error) {
                        console.log(error)
                        setIsLoading(false)
                    }
                }
              })
        }
    })
    
    useEffect(()=>{
        const docRef=doc(db,'posts',param)
        getDoc(docRef).then(async res=>{
            getDocData.push({
                title:res.data().title,
                slug:res.data().slug,
                toggle:res.data().hot,
                category:res.data().categoryID,
                status:res.data().status,
                upload:res.data().picture,
                author:await handleGetUserFromPost(res.data().authorID),
            })
            setGetDocData([...getDocData])
            setValueQuill(res.data().content)
        })
    },[param])
    
   
    const categoryList=[]
    useEffect(()=>{
        const colRef=collection(db,'category')

        async function getCategory(){
            const res=await getDocs(colRef)
            res.docs.forEach(item=>{
                categoryList.push({
                    categoryId:item.id,
                    ...item.data()
                })
            })
            setDataCategory(categoryList)
        }
        getCategory()
    },[])
    if(!param) return null


    return ( 
        <form className={styles.addPost} onSubmit={formik.handleSubmit}>
            <h3>Update post</h3>
            <p>Update your post id:{param}</p>
               
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
                <Input 
                    name='author'
                    title="Author"
                    value={getDocData[0]?.author}
                />
            
                <Radio
                    name='status' 
                    title='Status' 
                    value1={formik.values.status!=='default'?formik.values.status:getDocData[0]?.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    format='add-post'
                />
                <DropDown label='Category' name='category'
                    value={formik.values.category!=='default'?formik.values.category:getDocData[0]?.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data={dataCategory}
                >
                {formik.errors.category&&formik.touched.category&&<span>{formik.errors.category}</span>}
                </DropDown>
                <Toggle
                    value={formik.values.toggle!=='default'?formik.values.toggle:getDocData[0]?.toggle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <UploadFile 
                    value={formik.values.upload!=='default'?formik.values.upload:getDocData[0]?.upload}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                {formik.errors.upload&&formik.touched.upload&&<span>{formik.errors.upload}</span>}
                </UploadFile>
                <div className={styles.customQuill}>
                    <label>Content</label>
                    <ReactQuill theme="snow" value={valueQuill} onChange={setValueQuill} />
                </div>
                
            </div>
            <Button
                type='submit'
                width='200px' height='40px' empty={formik.values} isLoading={isLoading} isAddpost
                error={Object.values(formik.errors).length} belong='addpost'>
                    {isLoading?<Loading/>:'Update post'}
                </Button>
        </form>
     );
}

export default UpdatePost;