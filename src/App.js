import React, {useState, useRef, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardText,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  CardImg } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCog, faBell, faMap, faCamera, faCalendar, faExclamationTriangle, faChartPie, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

import {search, fetchDataAsync} from './appSlice';
import RenderMarker from './Marker';
import './App.css';

const data = {
  labels: [
    'Red',
    'Purple',
    'Yellow',
    'Grey',
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [11, 16, 7, 3],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(28, 0, 128, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(128, 128, 128, 0.5)',
    ]
  }]
};

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

library.add(fab, faCog, faBell, faMap, faCamera, faCalendar, faExclamationTriangle, faChartPie, faSearch, faFilter);

const App = () => {
  const cameraAssets = useSelector((state) => state.app.cameraAssets);
  const cameraSelected = useSelector((state) => state.app.cameraSelected);
  const cameraAlert = useSelector((state) => state.app.cameraAlert);
  const [center, setCenter] = useState({ lat: 13.084622, lng: 80.248357 });
  const [isOpen, setToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDataAsync());
  }, []);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const ZOOM_LEVEL = 9;
  const mapRef = useRef();

  const onToggle = () => {
    setToggle(!isOpen);
  }

  const handleSearch = event => {
    event.preventDefault();
    const searchText = event.target.value;
    dispatch(fetchDataAsync({name: searchText}));
  }

  return (
    <div className='container-fluid p0'>
      <Navbar expand="md" className="flexEnd navbarBg">
        <NavbarToggler onClick={onToggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem className="flexRow alignCenter">
              <NavLink href="/" className='mr15'>
                <FontAwesomeIcon icon="cog" color='#FFFFFF' />
              </NavLink>
              <NavLink href="/" className='mr15'>
                <FontAwesomeIcon icon="bell" color='#FFFFFF' />
              </NavLink>
              <div className='flexRow alignCenter'>
                <img className='userAvatar' src='https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q=' alt='user-profile' />
                <div className='flexColumn profileContainer'>
                  <strong>User Name</strong>
                  <p>Admin</p>
                </div>
              </div>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <div className="col-xs-12 flexRow p20 blockContainer">
        <div className='blockArea siteContainer flexRow alignCenter'>
          <FontAwesomeIcon icon="map" color='#FFFFFF' />
          <div className='flexColumn ml15 justifyCenter'>
            <strong>25</strong>
            <p>Site</p>
          </div>
        </div>
        <div className='blockArea siteContainer flexRow alignCenter'>
          <FontAwesomeIcon icon="camera" color='#FFFFFF' />
          <div className='flexColumn ml15'>
            <strong>397</strong>
            <p>Camera</p>
          </div>
        </div>
        <div className='blockArea siteContainer flexRow alignCenter'>
          <FontAwesomeIcon icon="calendar" color='#FFFFFF' />
          <div className='flexColumn ml15'>
            <strong>2623</strong>
            <p>Events</p>
          </div>
        </div>
        <div className='blockArea siteContainer flexRow alignCenter'>
          <FontAwesomeIcon icon="exclamation-triangle" color='#FF0000' />
          <div className='alertContainer flexColumn ml15'>
            <strong>2623</strong>
            <p>Events</p>
          </div>
        </div>
      </div>
      <div className="col-xs-12">
        <div className='headerContainer'>
          <div className='searchContainer'>
            <div className='inputContainer'>
              <FontAwesomeIcon icon="search" color='#000000' />
              <input type='textbox' className='noborder searchArea' placeholder='Search by Location, Camera or Department' onChange={handleSearch} />
            </div>
            <div className='filterContainer'>
              <FontAwesomeIcon icon="filter" color='#000000' />
              <span className='ml10'>Filter</span>
            </div>
          </div>
          <div className='mapContainer'>
            <MapContainer style={{ height: "100vh", width: "100%" }} center={center} zoom={ZOOM_LEVEL} ref={mapRef} scrollWheelZoom={false} preferCanvas={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {cameraAssets.map(RenderMarker)}
              <div className='cardContainer'>
                <Card style={{width: '18rem'}}>
                  <CardBody>
                    <CardTitle tag="h5">{cameraSelected?.length} Camera Selected</CardTitle>
                    {
                      cameraSelected?.length > 0 &&
                        <div className='mb15'>
                          <CardText>{cameraSelected[0]?.name}</CardText>
                          <CardImg alt={cameraSelected[0]?.name} src={cameraSelected[0]?.image} className='cardImage' top width="100%" />
                        </div>
                    }
                    <button className="flexRow btnDanger">
                      <FontAwesomeIcon icon="exclamation-triangle" color='#FFFFFF' size="lg" />
                      <h5 className='ml5'>{cameraAlert?.length} ACTIVE ALERT</h5>
                    </button>
                  </CardBody>
                </Card>
              </div>
            </MapContainer>
          </div>
        </div>
      </div>
      <div className='col-xs-12 p20'>
        <div className='row'>
          <div className='col-xs-12 col-md-7'>
            <Card
              className="my-2"
              color="secondary"
              inverse
            >
              <CardHeader className='flexRow alignCenter'>
                <FontAwesomeIcon icon="chart-pie" color='#FFFFFF' />
                <h5 className='textWhite ml10 mb0'>Alert Distribution</h5>
              </CardHeader>
              <CardBody>
                <Dropdown isOpen={dropdownOpen} toggle={toggle} className='dropdownContainer'>
                  <DropdownToggle caret className='dropdownToggleContainer'>
                    Dropdown
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Header</DropdownItem>
                    <DropdownItem>Some Action</DropdownItem>
                    <DropdownItem text>Dropdown Item Text</DropdownItem>
                    <DropdownItem disabled>Action (disabled)</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Foo Action</DropdownItem>
                    <DropdownItem>Bar Action</DropdownItem>
                    <DropdownItem>Quo Action</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <PolarArea data={data} />
              </CardBody>
            </Card>
          </div>
          <div className='col-xs-12 col-md-5'>
            <Card
                className="my-2"
                color="secondary"
                inverse
              >
                <CardHeader>
                  Header
                </CardHeader>
                <CardBody>
                  <CardTitle tag="h5">
                    Special Title Treatment
                  </CardTitle>
                  <CardText>
                    With supporting text below as a natural lead-in to additional content.
                  </CardText>
                </CardBody>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
