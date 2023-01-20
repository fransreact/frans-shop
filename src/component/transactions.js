import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { currencyFormat } from "../utils/functions";
import { headersAxios } from "../utils/headersAxios";

import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";

const settings = ['profile', 'logout'];
const navItems = ['products', 'transactions'];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { 
    field: 'Product', 
    headerName: 'Product', 
    width: 130,
    valueGetter: (params) =>
      `${params.row.Product.name || ''}`,
  },
  { field: 'qty', headerName: 'Qty', width: 130 },
  {
    field: 'price',
    headerName: 'Price',
    width: 160,
    valueGetter: (params) =>
      `${currencyFormat(params.row.price) || ''}`,
  },
  { field: 'createdAt', headerName: 'Pay Date', width: 130 },
];

export default function TransactionsComponent() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user"))
  const [qtyCart, setQtyCart] = useState(0);
  const [rowTrans, setRowTrans] = useState([]);

  const getQtyCart = () => {
    let cartSess = JSON.parse(localStorage.getItem("cart"))
    if (cartSess !== null) {
      setQtyCart(cartSess.reduce((a, v) =>  a = a + v.qty , 0 ))
    }
  }

  const getTrans = async() => {
    const url_api = "http://localhost:3000"
    const response = await axios.get(url_api + "/transactions/", { headers: headersAxios })
    if (response) {
      setRowTrans(response.data)
    }
  }

  useEffect(() => {
    getQtyCart()
    getTrans()
  },[])

  const capitalizeFirstLowercaseRest = str => {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    );
  }; 
  
  const gotoPage = (page) => {
    if (page === 'products')
      page = 'home';
    navigate("/" + page);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button key={item} sx={{ color: '#fff' }} onClick={() => gotoPage(item)}>
                  {item}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: "10px" }}>
              <IconButton size="large" color="inherit" onClick={() => gotoPage("checkout")}>
                <Badge badgeContent={qtyCart} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <Button size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                  color="inherit"
                >
                  <AccountCircle sx={{ mr: "10px" }} />
                  {user.name}
                </Button>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => gotoPage(setting)}>
                    <Typography textAlign="center">{capitalizeFirstLowercaseRest(setting)}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rowTrans}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Container>
    </React.Fragment>
  );
}