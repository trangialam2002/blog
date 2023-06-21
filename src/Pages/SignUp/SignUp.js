import styles from './signUp.module.scss'
import clsx from 'clsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye,faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import Label from '../../Component/Label/Label';
import Button from '../../Component/Button/Button';
import Loading from '../../Component/Button/Loading/Loading';
import * as yup from 'yup'
import {useFormik} from 'formik'
import {auth, db} from '../../Firebase/firebase-config'
import {Link, useNavigate} from 'react-router-dom'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

function SignUp() {
    const [type,setType]=useState('password')
    const [isLoading,setIsLoading]=useState(false)

    const handleSetShowPass=()=>{
        setType('textbox')
    }
    const handleSetHidePass=()=>{
        setType('password')
    }
    const navigate=useNavigate()
    
    const formik=useFormik({
        initialValues:{
            fullname:'',
            email:'',
            password:''
        },
        validationSchema:yup.object({
            fullname:yup.string().required('Bạn chưa nhập họ tên'),
            email:yup.string().email('Sai định dạng email').required('Bạn chưa nhập email'),
            password:yup.string().required('Bạn chưa nhập mật khẩu').max(15,'Mật khẩu tối đa 15 kí tự').min(6,'Mật khẩu tối thiểu 6 kí tự')
        }),
        onSubmit:async values=>{
            try {
                console.log(values)
                setIsLoading(true)
                await createUserWithEmailAndPassword(auth,values.email,values.password)
                await updateProfile(auth.currentUser,{
                        displayName:values.fullname
                    })
                setIsLoading(false)
                alert('Tạo tài khoản thành công')
                navigate('/sign-in')
                //set dữ liệu vào collection
                const colRef=doc(db,'users',auth.currentUser.uid)
                await setDoc(colRef,{
                    name:values.fullname,
                    mail:values.email,
                    pass:values.password,
                    createdAt:serverTimestamp(),
                    avatar:'avatar.jpg',
                    status:'Active',
                    role:'User'
                })
                console.log('thêm vào collection thành công');
            } catch (error) {
                console.log('lỗi:',error);
                alert('Tài khoản email đã tồn tại')
                setIsLoading(false)
            }

        }
    })
    console.log(formik)

    
    return ( 
        <div className={clsx(styles.register)}>
            <div className={clsx(styles.logo)}>
                <img src="/logoMonkey.png" alt="monkey-logo"/>
                <h3>Monkey Blogging</h3>
            </div>
            <form className={clsx(styles.form)} onSubmit={formik.handleSubmit}>
                <Label title="Fullname" id="fullname" name="fullname" 
                    placeholder="Please enter your fullname" type='textbox'
                        onChange={formik.handleChange}
                        value={formik.values.fullname}
                        onBlur={formik.handleBlur}
                    />
                {formik.errors.fullname&&formik.touched.fullname&&<p>{formik.errors.fullname}</p>}
                <Label title="Email address" id="email" name="email" 
                    placeholder="Please enter your email address" type='email'
                    onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                    />
                     {formik.errors.email&&formik.touched.email&&<p>{formik.errors.email}</p>}
                <label htmlFor='password'>Password</label>
                <div className={clsx(styles.pass)}>
                    <input placeholder='Please enter your password' type={type}
                        id='password' name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        />
                    {
                        type==="password"
                        ?
                        <span onClick={handleSetShowPass}><FontAwesomeIcon icon={faEyeSlash}/></span>
                        :
                        <span onClick={handleSetHidePass}><FontAwesomeIcon icon={faEye}/></span>
                    }
                </div>
                {formik.errors.password&&formik.touched.password&&<p>{formik.errors.password}</p>}
                <p style={{marginTop:"10px"}}>Bạn đã có tài khoản?<Link to="/sign-in" 
                style={{color:"#2EBAC1",fontWeight:"bold"}}>Đăng nhập ngay</Link></p>
                <Button empty={formik.values} isLoading={isLoading} error={Object.keys(formik.errors).length}
                    width="200px" height='50px' type="submit" belong='signin/up'>
                    {isLoading&&formik.values.fullname&&formik.values.email&&formik.values.password
                        ?<Loading/>:"Sign Up"}
                </Button>
            </form>

        </div>
     );
}

export default SignUp;