import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCar from './componets/AddCar';
import EditCar from './componets/EditCar';
import Snackbar from '@material-ui/core/Snackbar';

function App() {

  const[cars, setCars] = useState([]);
  const[open, setOpen] = useState(false);

  const openSnackBar = () => {
    setOpen(true);
  }
  const closeSnackbar = () => {
    setOpen(false);
  }

  useEffect(() => {
    fetchCars();
  }, []) 

  const deleteCar = (url) => {
    if (window.confirm('Are you sure?')){
    fetch(url, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        openSnackBar();
        fetchCars();
      }
      else {
        alert('Something went wrong!');
      }
    })
    .catch(err => console.error(err))
    }
  }

  const editCar = (url, updateCar) => {
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(updateCar),
      headers: { 'Content-type' : 'application/json' }
    })
    .then(response => {
      if(response.ok)
        fetchCars();
      else
        alert('Something went wrong')
    })
    .catch(err => console.error(err))
  }

  const fetchCars = () => {
    fetch('http://carrestapi.herokuapp.com/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
  }

  const addCar = (newCar) => {
    fetch('http://carrestapi.herokuapp.com/cars', {
      method: 'POST',
      body: JSON.stringify(newCar), 
      headers: { 'Content-type' : 'application/json' }
    })
    .then(response => {
      if(response.ok)
        fetchCars();
      else
        alert('Something went wrong');
    })
    .catch(err => console.error(err))
  }

  const columns = [
    { field: 'brand', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    { field: 'color', sortable: true, filter: true },
    { field: 'fuel', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => 
        <EditCar link={params.value} car={params.data} editCar={editCar}/>
    },
    { 
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => 
        <IconButton color="secondary" onClick={() => deleteCar(params.value)}>
          <DeleteIcon/>
        </IconButton>
    }
  ]
 
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6">
               CarShop
            </Typography>  
        </Toolbar>
      </AppBar>
      <AddCar addCar={addCar}/>
       <div className="ag-theme-material" style={{ height: 600, width: '95%', margin: 'auto' }}>
           <AgGridReact
              rowData={cars}
              columnDefs={columns}
              pagination={true}
              paginationPageSize={8}
              suppressCellSelection={true}
           />
        </div>
        <Snackbar 
          open={open}
          message="Car deleted"
          autoHideDuration={3000}
          onClose={closeSnackbar}
        />
    </div>
  );
}

export default App;
