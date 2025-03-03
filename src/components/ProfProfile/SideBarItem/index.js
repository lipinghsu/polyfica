import './SideBarItem.scss';
import { Link } from 'react-router-dom';

const SidebarItem = ({icon, label, link}) => {
    return(
        <Link to={link} className="list-item-wrap">
            <div className='img-wrap'>
                <img src={icon} alt={label} />
            </div>
            <div className='text-wrap'>
                {label}
            </div>
        </Link>
    );
};


export default SidebarItem;