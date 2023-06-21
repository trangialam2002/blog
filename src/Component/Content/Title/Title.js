import styles from './title.module.scss'
function Title({title,color='#3A1097',tippy=false}) {
    return ( 
        <h3 className={styles.title} style={!tippy?{color:color}:{color:color,marginTop:'15px',marginBottom:'10px',marginLeft:'10px',fontSize:'18px',position:'absolute'}}>{title}</h3>
     );
}

export default Title;
