import Tr from '../Tr/Tr';
import styles from './tableDashboard.module.scss'

function TableDashboard({currentPageRef,add,data,quantity,page,dashboardType,changePage,count,...props}) {
    return ( 
        <div className={styles.table}>
            <table>
                <thead>
                    <tr>
                        <div className={styles.cssThead}>
                            {
                              Object.values(props).map((item,index)=>(
                                <th key={index} style={item==='Status'?{width:'10%'}:{}}>{item}</th>
                              ))  
                            }
                        </div>
                    </tr>
                </thead>
                <tbody>
                    <div className={styles.cssTbody}>
                        <Tr data={data} quantity={quantity} page={page} dashboardType={dashboardType} changePage={changePage} count={count} add={add} currentPageRef={currentPageRef}/>
                    </div>
                </tbody>
            </table>
        </div>
     );
}

export default TableDashboard;