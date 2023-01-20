import {
  AppBar,
  Badge,
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from '@mui/icons-material/Menu';
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { currencyFormat } from "../../utils/functions";
import { headersAxios } from "../../utils/headersAxios";

const settings = ['profile', 'logout'];
const navItems = ['products', 'transactions'];
  
export default function DetailProductComponent() {
  const navigate = useNavigate();
  const params = useParams();
  const [qty, setQty] = useState(0);
  const [qtyCart, setQtyCart] = useState(0);
  const [dataDetail, setDataDetail] = useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user"))  
  const prd = JSON.parse(localStorage.getItem("cart"))
  const cartPrd = prd ? prd.filter((val) => val.id === parseInt(params.id)) : [];
  const getDetailProduct = async() => {
    const url_api = "http://localhost:3000"
    const response = await axios.get(url_api + "/products/" + params.id, { headers: headersAxios })
    if (response) {
      setDataDetail(response.data)
    }
  }

  const getQtyCart = () => {
    let cartSess = JSON.parse(localStorage.getItem("cart"))
    if (cartSess !== null) {
      setQtyCart(cartSess.reduce((a, v) =>  a = a + v.qty , 0 ))
    }
  }

  useEffect(() => {
    getDetailProduct();
    getQtyCart()
    if (prd) {
      setQty(cartPrd[0].qty)
    }
  }, []);

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
  
  const qtyChange = (type) => {
    let newQty = qty;
    if (type === "min") {
      newQty--;
    } else {
      newQty++;
    }

    if (newQty < 0) {
      newQty = 0;
    }

    setQty(newQty);
  };
  
  const updateCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let newDataDetail = {};
    if (!cart) {
      cart = [];
      newDataDetail = dataDetail;
    } else {
      let newCart = cart.filter((val) => val.id === dataDetail.id);
      if (newCart.length > 0) {
        newDataDetail = newCart[0];
      } else {
        newDataDetail = dataDetail;
      }
    }
    newDataDetail.qty = qty;
    let allCart = cart.filter((val) => val.id !== dataDetail.id);
    allCart.push(newDataDetail);
    localStorage.setItem("cart", JSON.stringify(allCart));
    getQtyCart()
    alert("Berhasil ditambahkan ke Cart");
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
        {dataDetail && 
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <img
              src={dataDetail.image}
              srcSet={dataDetail.image}
              alt={dataDetail.name}
              loading="lazy"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title={dataDetail.name} />
              <CardContent>
                <Typography variant="subtitle2">{dataDetail.desc}</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                  {currencyFormat(dataDetail.price)}
                </Typography>
                <Stack direction={"row"} alignItems="center" sx={{ mt: 3 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => qtyChange("min")}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Typography
                    sx={{
                      borderBottom: 1,
                      width: 50,
                      mx: 1,
                      textAlign: "center",
                      fontSize: 20,
                    }}
                    variant="subtitle2"
                  >
                    {qty}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => qtyChange("plus")}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button variant="contained" color="error" onClick={updateCart}>
                  + Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        }
      </Container>
    </React.Fragment>
  );
}