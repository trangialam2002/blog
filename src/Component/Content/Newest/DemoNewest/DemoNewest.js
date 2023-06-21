import ItemNew from '../ItemNew/ItemNew';
import styles from './demoNewest.module.scss'
import { memo} from 'react';


function DemoNewest({third,demoNewest}) {
    return ( 
        <div className={styles.demo}>
            {
                third.length>0?third.map((item,index)=>{
                    return <ItemNew 
                        key={index}
                        src={`/images/${item.src}`}
                        title={item.title}
                        type={item.type}
                        time={item.time}
                        author={item.author}
                        y width="24%" height="auto" width_author="75%"
                        backgroundType='#F3EDFF' widthImg='100%'
                        demoNewest={demoNewest}
                        to={item.slug}
                    />
            }):
                <p style={{width:'100%',textAlign:'center',fontFamily: "Montserrat",fontWeight: 500,color: '#232323'}}>Không có bài viết liên quan</p>
            }
        </div>
     );
}

export default memo(DemoNewest);