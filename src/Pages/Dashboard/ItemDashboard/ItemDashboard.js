import { Link, NavLink } from 'react-router-dom';
import styles from './itemDashboard.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import clsx from 'clsx';

function ItemDashboard({icon,title,to,...props}) {
    return ( 
        <NavLink to={to}  
            className={({isActive})=>(
                    clsx(styles.item,{
                       [styles.active]:isActive?true:false
                }
            )
            )}
            {...props}
        >
            <FontAwesomeIcon icon={icon}/>
            <p>{title}</p>
        </NavLink>
     );
}

export default ItemDashboard;