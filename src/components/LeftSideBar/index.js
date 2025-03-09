import React, { useEffect, useState } from 'react';
import homeIcon from '../../assets/bs-icon.png';
import SidebarItem from '../SideBarItem';
import './LeftSideBar.scss'

const LeftSideBar = () => {
   
    return (
        <div className="sidebar-left">
            <SidebarItem icon={homeIcon} label={"Home"} link="/"/>
            {/* <SidebarItem icon={homeIcon} label={"Filters"} /> */}
            {/* <SidebarItem icon={homeIcon} label={"Sort By"} /> */}
        </div>
    );
};

export default LeftSideBar;