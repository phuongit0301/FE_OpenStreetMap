
import React from 'react';
import L from 'leaflet';
import { useDispatch } from 'react-redux';
import { Marker, Popup } from 'react-leaflet';

import {updateLocationAsync, fetchDataAsync} from './appSlice';

const RenderMarker = (camera, idx) => {
    const dispatch = useDispatch();
  
    let markerIcon = new L.Icon({
      iconUrl: require("assets/images/camera_black.png"),
      iconSize: [32, 32],
      iconAnchor: [17, 46], //[left/right, top/bottom]
      popupAnchor: [0, -46], //[left/right, top/bottom]
      className: 'cameraBlack',
    });
  
    if(camera.status === 1) {
      markerIcon = new L.Icon({
        iconUrl: require("assets/images/camera_red.png"),
        iconSize: [32, 32],
        iconAnchor: [17, 46], //[left/right, top/bottom]
        popupAnchor: [0, -46], //[left/right, top/bottom]
        className: 'cameraRed',
      });
    } else if(camera.status === 2) {
      markerIcon = new L.Icon({
        iconUrl: require("assets/images/camera_purple.png"),
        iconSize: [32, 32],
        iconAnchor: [17, 46], //[left/right, top/bottom]
        popupAnchor: [0, -46], //[left/right, top/bottom]
        className: 'cameraPurple',
      });
    }
  
    return (
      <Marker
        position={[camera.lat, camera.lng]}
        icon={markerIcon}
        key={idx}
        data={camera}
        eventHandlers={{
          click: (e) => {
            // if (e?.target?.options?.data?.status !== 2) {
              console.log('marker clicked', e);
              dispatch(updateLocationAsync({
                id: e?.target?.options?.data?.id,
                status: 2,
              }, () => {
                dispatch(fetchDataAsync());
              }));
            // }
          }
        }}
      >
        <Popup>
          <b>{camera?.name}</b>
          <br />
          <b>
            {camera.city}, {camera.country}
          </b>
          <p>{camera?.department}</p>
        </Popup>
      </Marker>
    );
  }

  export default RenderMarker;
  