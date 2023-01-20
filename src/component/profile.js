import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar, 
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  TextField, 
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Person3Icon from '@mui/icons-material/Person3';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { headersAxios } from "../utils/headersAxios";

const theme = createTheme();

const settings = ['profile', 'logout'];
const navItems = ['products', 'transactions'];

export default function ProfileComponent() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user"))
  const [email , setEmail] = useState(user.email)
  const [fname , setName] = useState(user.name)
  const [qtyCart, setQtyCart] = useState(0);

  const getQtyCart = () => {
    let cartSess = JSON.parse(localStorage.getItem("cart"))
    if (cartSess !== null) {
      setQtyCart(cartSess.reduce((a, v) =>  a = a + v.qty , 0 ))
    }
  }

  useEffect(() => {
    getQtyCart()
  },[])

  const prosesUpdate = async (e) => {
    e.preventDefault();
    try {
      const url_api = "http://localhost:3000/users/update/" + user.id
      const response = await axios.put(url_api, {
        email: email,
        name: fname
      }, { headers: headersAxios });

      if (response) {
        user.email = email;
        user.name = fname;
        localStorage.setItem("user", JSON.stringify(user));
        console.log("berhasil update")
      } else {
        console.log("gagal update")
      }
    } catch (error) {
      console.log(error)
    }
  }

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
      <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                  sx={{
                      marginTop: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                  }}
              >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person3Icon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                      Biodata
                  </Typography>
                  <Box component="form" method="post" onSubmit={prosesUpdate} noValidate sx={{ mt: 1 }}>
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="name"
                          label="Name"
                          type="text"
                          id="name"
                          value={fname} 
                          onChange={(e) => setName(e.target.value)}
                      />
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                      />
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                      >
                          Save
                      </Button>
                  </Box>
              </Box>
          </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}