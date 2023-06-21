import { memo } from 'react'
import styles from './button.module.scss'
import clsx from 'clsx'
import { Link } from 'react-router-dom'


function Button({children,type='text',width,height,empty={},isLoading=false,error=0,isTo='',isBanner=false,marginLeft='5px',isAddpost='',belong='',...props}) {
    const style={}  
    let Comp="button"

    if(width){
        style.width=width
    }
    if(height){
        style.height=height
    }
    if(isLoading
        ||(belong==='signin/up' && !(empty.fullname&&empty.email&&empty.password)&&!isTo)
        ||(belong==='signin/up'&&(empty.fullname&&empty.email&&empty.password)&&error>0&&!isTo)
        ||(belong==='addpost'&&!(empty.slug&&empty.status&&empty.title&&empty.upload)&&!isTo)
        ||(belong==='addpost'&&(empty.slug&&empty.status&&empty.title&&empty.upload)&&error>0&&!isTo)
        ||(belong==='addcategory'&&!(empty.slug&&empty.status&&empty.title)&&!isTo)
        ||(belong==='addcategory'&&(empty.slug&&empty.status&&empty.title)&&error>0&&!isTo)
        ||(belong==='profile'&&!(empty.username&&empty.status&&empty.email&&empty.password&&empty.role&&empty.upload)&&!isTo)
        ||(belong==='profile'&&(empty.username&&empty.status&&empty.email&&empty.password&&empty.role&&empty.upload)&&error>0&&!isTo)

        )
    {
        props.disabled=true
        style.background="linear-gradient(107.61deg, #00a7b482 15.59%, #00a7b482 87.25%)"
        style.pointerEvents='none'
        style.color="#ececec"
    }
    if(isTo){
        style.margin=`0 0 0 ${marginLeft}`
        style.fontSize="15px"
        Comp=Link
    }
    if(isBanner){
        style.background="#ffffff"
        style.color="#23BB86"
    }
    if(isAddpost){
        style.marginTop='50px'
        style.marginBottom='30px'
    }

    return ( 
        <Comp to={isTo} type={type} {...props} className={clsx(styles.button)} style={style} 
        >{children}</Comp>
     );
}

export default memo(Button);