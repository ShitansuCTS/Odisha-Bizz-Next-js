'use client'

import AllListingWithFilter from "../admin/AllListingWithFilter";
import LogoutButton from "../logout/LogoutButton";
import { Button } from "../ui/button";

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <LogoutButton />
            <AllListingWithFilter />
        </div>
    );
}

export default Dashboard