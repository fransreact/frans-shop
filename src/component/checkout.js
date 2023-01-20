import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar, 
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../utils/functions";
import axios from "axios";
import { headersAxios } from "../utils/headersAxios";

const settings = ['profile', 'logout'];
const navItems = ['products', 'transactions'];

export default function CheckoutComponent() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user"))
  const [qtyCart, setQtyCart] = useState(0);
  const [payCart, setPayCart] = useState(0);
  const checkout = JSON.parse(localStorage.getItem("cart"));

  const getQtyCart = () => {
    if (checkout !== null) {
      setQtyCart(checkout.reduce((a, v) =>  a = a + v.qty , 0 ))
      setPayCart(checkout.reduce((a, v) =>  a = a + v.price * v.qty , 0 ))
    }    
  }

  useEffect(() => {
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

  const prosesCheckout = async (e) => {
    e.preventDefault();
    try {
      const url_api = "http://localhost:3000/transactions/checkout/"
      const response = await axios.post(url_api, {"user_id": user.id, "cart": checkout}, { headers: headersAxios })     

      if (response) {
        console.log("berhasil update")
        localStorage.removeItem("cart");
        navigate("/home")
      } else {
        console.log("gagal update")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    color: theme.palette.text.secondary,
  }));

  const Item2 = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }));
  
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
        <Box component="form" method="post" onSubmit={prosesCheckout} noValidate sx={{ flexGrow: 1, mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Item>
                <List sx={{ width: '100%', bgcolor: 'background.paper', p:0 }}>          
                  {checkout && checkout.map((chk) => (
                  <ListItem alignItems="flex-start" style={{ borderBottom: "1px solid #ddd" }}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={chk.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="h5"
                            color="text.primary"
                          >
                            {chk.name}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline', mr:"5px" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {currencyFormat(chk.price)}
                          </Typography>
                          ({chk.qty})
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  ))}
                </List>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item2>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="h6"
                  color="text.primary"
                  fontWeight="bold"
                >
                  Checkout 
                </Typography>
                <Divider sx={{ mt: 2 }} />
                <List sx={{ width: '100%', bgcolor: 'background.paper', p:0 }}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="h6"
                            color="text.primary"
                          >
                            Total Qty: {qtyCart}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="h6"
                            color="text.primary"
                          >
                            Total Pay: {currencyFormat(payCart)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider />
                </List>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Pay
                </Button>
              </Item2>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}