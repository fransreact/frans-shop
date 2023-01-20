import {
  AppBar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { headersAxios } from "../../utils/headersAxios";

const settings = ['profile', 'logout'];
const navItems = ['products', 'transactions'];
  
export default function HomeComponent() {
  const navigate = useNavigate();
  const [dataProducts, setDataProducts] = useState([])
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user"))
  const [qtyCart, setQtyCart] = useState(0);

  const getQtyCart = () => {
    let cartSess = JSON.parse(localStorage.getItem("cart"))
    if (cartSess !== null) {
      setQtyCart(cartSess.reduce((a, v) =>  a = a + v.qty , 0 ))
    }
  }

  useEffect(() => {
    getDataProduct()
    getQtyCart()
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
  
  const gotoDetail = (id) => {
    navigate("/product/" + id);
  };

  const getDataProduct = async() => {
    const url_api = "http://localhost:3000"
    const response = await axios.get(url_api + "/products", { headers: headersAxios })
    if (response) {
      setDataProducts(response.data)
    }
  }
  
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
        <Grid container spacing={2}>
          {dataProducts.map((data, i) => (
            <Grid key={i} item xs={3}>
              <Card>
                <CardHeader title={data.name} />
                <CardMedia
                  component="img"
                  height="200"
                  image={data.image}
                  alt={data.name}
                />
                <CardContent>
                  <Typography variant="subtitle2">{data.name}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => gotoDetail(data.id)}
                  >
                    Detail
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}