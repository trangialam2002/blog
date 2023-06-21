import clsx from "clsx";
import styles from './signIn.module.scss'
import {useFormik} from 'formik'
import * as yup from 'yup'
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase-config";
import { useEffect, useState } from "react";
import Label from "../../Component/Label/Label";
import Button from "../../Component/Button/Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye,faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import Loading from "../../Component/Button/Loading/Loading";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useContext } from "react";
import { loginContext } from "../../App";
import Swal from "sweetalert2";

function SignIn() {
    const [type,setType]=useState('password')
    const [isLoading,setIsLoading]=useState(false)
    const navigate=useNavigate()

    const getContext=useContext(loginContext)
    useEffect(()=>{
        if(getContext.displayName){
            navigate("/")
        }
    },[getContext])

    const handleSetShowPass=()=>{
        setType('textbox')
    }
    const handleSetHidePass=()=>{
        setType('password')
    }

    const formik=useFormik({
        initialValues:{
            fullname:'default value',
            email:'',
            password:''
        },
        validationSchema:yup.object({
            email:yup.string().email('Sai định dạng email').required('Bạn chưa nhập email'),
            password:yup.string().required('Bạn chưa nhập mật khẩu').max(15,'Mật khẩu tối đa 15 kí tự').min(6,'Mật khẩu tối thiểu 6 kí tự')
        }),
        onSubmit:async values=>{
                try {
                    setIsLoading(true)
                    await signInWithEmailAndPassword(auth,values.email,values.password)
                    
                    Swal.fire('Đăng nhập thành công','','success')
                    navigate('/')
                    
                } catch (error) {
                    console.log('lỗi:',error);
                    alert('Sai tài khoản email hoặc mật khẩu')
                    setIsLoading(false)
                }
                
        }
    })
    return ( 
        <div className={clsx(styles.login)}>
            <div className={clsx(styles.logo)}>
                <img src="/logoMonkey.png" alt="monkey-logo"/>
                <h3>Monkey Blogging</h3>
            </div>
            <form className={clsx(styles.form)} onSubmit={formik.handleSubmit}>
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
                <p style={{marginTop:"10px"}}>Bạn chưa có tài khoản?<Link to="/sign-up" 
                style={{color:"#2EBAC1",fontWeight:"bold"}}>Đăng ký</Link></p>
                <Button empty={formik.values} isLoading={isLoading} error={Object.keys(formik.errors).length}
                    width="200px" height='50px' type="submit" belong='signin/up'>
                    {isLoading?<Loading/>:"Sign In"}
                </Button>
            </form>

        </div>
     );
}

export default SignIn;