import React, { useEffect, Suspense, useTransition, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { checkUserSession } from './redux/User/user.actions';
import Logo from './assets/polyfica_logo.png';

// components
import AdminToolbar from './components/AdminToolbar';

// hoc
import WithAuth from './hoc/withAuth';
import WithAdminAuth from './hoc/withAdminAuth';

// layouts
import MainLayout from './layouts/MainLayout';
import HomepageLayout from './layouts/HomepageLayout';
import AccountLayout from './layouts/AccountLayout';
import CheckoutLayout from './layouts/CheckoutLayout';
import AboutLayout from './layouts/AboutLayout';

// pages
import Homepage from './pages/Homepage';
import Search from './pages/Search';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Recovery from './pages/Recovery';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Order from './pages/Order';
import ProfProfile from './components/ProfProfile';
// import Profile from './pages/Profile';
import Terms from './pages/Terms';
import About from './pages/About';

import "boxicons/css/boxicons.min.css";

import './default.scss';
import DashBoardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

import SearchResults from './components/SearchResults';

function FallbackComponent() {
  const [showImage, setShowImage] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (showImage) {
    return <img src={Logo} className='fallback centered-image resized-image' />;
  } else {
    return null; // Or you can return a loading spinner or placeholder
  }
}

const App = props => {
  const dispatch = useDispatch();

  // State to hold the selected professor from SearchResults
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  useEffect(() => {
    dispatch(
      checkUserSession()
    )
  }, [])

  return (
    <Suspense fallback={<img src={Logo} className='fallback centered-image resized-image' />}>

      <div className="App">
        <AdminToolbar></AdminToolbar>
        <Switch>
          <Route exact path="/" render={() => (
            <HomepageLayout>
              <Homepage />
            </HomepageLayout>
          )} />
          <Route path="/registration" render={() => (
            <AccountLayout>
              <Registration />
            </AccountLayout>
          )} />
          {/* <Route path="/login" render={() => currentUser ? <Redirect to="/"/> :( */}
          <Route path="/login" render={() => (
            <AccountLayout>
              <Login />
            </AccountLayout>
          )} />

          <Route path="/recovery" render={() => (
            <AccountLayout>
              <Recovery />
            </AccountLayout>
          )} />
          <Route path="/terms" render={() => (
            <MainLayout>
              <Terms />
            </MainLayout>
          )} />
          <Route path="/about" render={() => (
            <AboutLayout>
              {/* <About /> */}
            </AboutLayout>
          )} />

          {/* Route to display the professor profile */}
          <Route path="/search/professors/:profID" render={({ match }) => (
            <MainLayout>
              {/* Pass the professor's ID as a prop to the ProfProfile component */}
              <ProfProfile profID={match.params.profID} />
            </MainLayout>
          )} />

          {/* Route to display search results */}
          <Route path="/search" render={() => (
            <MainLayout>
              <SearchResults onSelectProfessor={setSelectedProfessor}/>
            </MainLayout>
          )} />

          {/* Route to display individual professor profile */}
          <Route path="/professor/:profID" render={() => (
            <MainLayout>
              <ProfProfile professor={selectedProfessor} />
            </MainLayout>
          )} />

          <Route path="/product/:productID" render={() => (
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          )} />
          <Route path="/cart" render={() => (
            <MainLayout>
              <Cart />
            </MainLayout>
          )} />

          <Route path="/payment" render={() => (
            // <WithAuth>
            <CheckoutLayout>
              <Payment />
            </CheckoutLayout>
            // </WithAuth>
          )} />


          <Route path="/dashboard" render={() => (
            // the WithAuth tag restricts access.
            <WithAuth>
              {/* <MainLayout> */}
              <DashBoardLayout>
                <Dashboard />
              </DashBoardLayout>
              {/* </MainLayout> */}
            </WithAuth>
          )} />
          <Route path="/order/:orderID" render={() => (
            <DashBoardLayout>
              <Order />
            </DashBoardLayout>
          )} />

          <Route path="/admin" render={() => (
            <WithAdminAuth>
              <MainLayout>
                <AdminLayout>
                  <Admin />
                </AdminLayout>
              </MainLayout>
            </WithAdminAuth>
          )} />

        </Switch>
      </div>
    </Suspense>
  );

};

export default App;
