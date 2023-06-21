import DropDown from '../DropDown/DropDown';
import Radio from '../Radio/Radio';
import Toggle from '../Toggle/Toggle';
import UploadFile from '../UploadFile/UploadFile';
import Input from './Input/Input';
import styles from './addPost.module.scss'
import {useFormik} from 'formik'
import * as yup from 'yup'
import Button from '../../Component/Button/Button'
import { loginContext } from '../../App';

import { db,auth } from '../../Firebase/firebase-config';
import { useEffect, useRef, useState,useContext } from 'react';
import {addDoc, collection, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import Loading from '../Button/Loading/Loading';

function AddPost() {
    const categoryList=[]
    const [dataCategory,setDataCategory]=useState([])
   
    const [isLoading,setIsLoading]=useState(false)
   const [done,setDone]=useState(false)
    
    const user=useContext(loginContext)
    
    const textRef=useRef()
    const toggleParentRef=useRef()
    const statusRef=useRef()
    const uploadRef=useRef()
    const categoryRef=useRef()

    console.log('cate',dataCategory);

    const formik=useFormik({
        initialValues:{
            title:'',
            slug:'',
            toggle:false,
            status:'Pending',
            upload:'',
            category:''
        },
        validationSchema:yup.object({
            title:yup.string().required('Title empty'),
            slug:yup.string().required('Slug empty'),
            upload:yup.string().required('Photo not select'),
            category:yup.string().required('Category not select'),
        }),
        onSubmit:async values=>{
            try {
                const split_upload=values.upload.split('\\')
                setIsLoading(true)
                const colRef=collection(db,'posts')
                await addDoc(colRef,{
                authorID:user.uid,
                categoryID:values.category,
                hot:values.toggle,
                picture:split_upload.reverse()[0],
                slug:values.slug,
                status:values.status,
                title:values.title,
                createAt:serverTimestamp()
            })
            alert('Thêm bài viết thành công')
            setIsLoading(false)
            setDone(true)
            } catch (error) {
                alert("Thêm bài viết không thành công")
                setIsLoading(false)
            }    
        }
    })
    console.log('formik',formik);

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
    
    useEffect(()=>{
        textRef.current.title.value=''
        formik.values.title=''

        textRef.current.slug.value=''
        formik.values.slug=''

        console.log('toggle',toggleParentRef.current);
        toggleParentRef.current.toggle.checked=false
        toggleParentRef.current.setToggle(false)
        formik.values.toggle=false

        statusRef.current.Approved.checked=false
        statusRef.current.Pending.checked=true
        statusRef.current.Reject.checked=false
        formik.values.status='Pending'


        uploadRef.current.setSrc('')
        formik.values.upload=''
        setDone(false)
    },[done])

    return ( 
        <form className={styles.addPost} onSubmit={formik.handleSubmit}>
            <h3>Add new post</h3>
               
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
                <Input 
                    name='author'
                    title="Author"
                    value={user.displayName}
                />
            
                <Radio
                    name='status' 
                    title='Status' 
                    value1={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={statusRef}
                    format='add-post'
                />
                <DropDown label='Category' name='category'
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data={dataCategory}
                    ref={categoryRef}
                >
                {formik.errors.category&&formik.touched.category&&<span>{formik.errors.category}</span>}
                </DropDown>
                <Toggle 
                    value={formik.values.toggle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={toggleParentRef}
                />
                <UploadFile 
                    value={formik.values.upload}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    ref={uploadRef}
                >
                {formik.errors.upload&&formik.touched.upload&&<span>{formik.errors.upload}</span>}
                </UploadFile>
                
            </div>
            <Button
                type='submit'
                width='200px' height='40px' empty={formik.values} isLoading={isLoading} isAddpost
                error={Object.values(formik.errors).length} belong='addpost'>
                    {isLoading?<Loading/>:'Add new post'}
                </Button>
        </form>
     );
}

export default AddPost;