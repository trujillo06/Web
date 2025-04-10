import * as React from "react";
import {AppBar,Box,Toolbar,IconButton,Typography,Menu,Container,Avatar,MenuItem,Tooltip,Backdrop,useMediaQuery,} from "@mui/material";
import {Logout as LogoutIcon,Person as PersonIcon,Menu as MenuIcon,Business as BusinessIcon,People as PeopleIcon,} from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import usuarioIcon from "../../assets/usuario.png";

const settings = ["Cerrar sesión"];

function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  React.useEffect(() => {
    const correo = sessionStorage.getItem("correoUsuario");
    if (correo) {
      const nombre = correo.split("@")[0];
      const capitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      setUserName(capitalizado);
    }
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  // const handleLogout = () => {
  //   setAnchorElUser(null);
  //   sessionStorage.removeItem("token");
  //   sessionStorage.removeItem("correoUsuario"); // Limpiamos también el correo
  //   navigate("/");
  // };

  const handleLogout = () => {
    setAnchorElUser(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("correoUsuario"); // Limpiamos también el correo
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(to right, #003366, #005f9e)",
        width: "100%",
        height: "100px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: "100px" }}>
          <Typography
            variant="h5"
            noWrap
            sx={{
              flexGrow: 1,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.2rem",
              lineHeight: "80px",
            }}
          >
            {location.pathname !== "/dashboard" ? (
              <Link
                to="/dashboard"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Tortilla OS
              </Link>
            ) : (
              <span style={{ userSelect: "none" }}>Tortilla OS</span>
            )}
          </Typography>

          {isMobile &&
            (location.pathname === "/sucursales" ||
              location.pathname === "/recursos-humanos") && (
              <Box
                sx={{
                  flexGrow: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Tooltip title="Menú de navegación">
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleOpenMenu}
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Tooltip>
                <Backdrop
                  sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                  open={Boolean(anchorElMenu)}
                  onClick={handleCloseMenu}
                />
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-navigation"
                  anchorEl={anchorElMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElMenu)}
                  onClose={handleCloseMenu}
                >
                  {location.pathname === "/sucursales" && (
                    <MenuItem
                      component={Link}
                      to="/recursos-humanos"
                      onClick={handleCloseMenu}
                    >
                      <PeopleIcon />
                      <Typography>Recursos Humanos</Typography>
                    </MenuItem>
                  )}
                  {location.pathname === "/recursos-humanos" && (
                    <MenuItem
                      component={Link}
                      to="/sucursales"
                      onClick={handleCloseMenu}
                    >
                      <BusinessIcon />
                      <Typography>Sucursales</Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            )}

          {!isMobile && (
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {location.pathname === "/sucursales" && (
                <Typography
                  component={Link}
                  to="/recursos-humanos"
                  sx={{
                    color:
                      location.pathname === "/recursos-humanos"
                        ? "#009DCF"
                        : "white",
                    textDecoration: "none",
                    fontSize: "1rem",
                    marginRight: "20px",
                    fontWeight:
                      location.pathname === "/recursos-humanos"
                        ? "bold"
                        : "normal",
                  }}
                >
                  Recursos Humanos
                </Typography>
              )}
              {location.pathname === "/recursos-humanos" && (
                <Typography
                  component={Link}
                  to="/sucursales"
                  sx={{
                    color:
                      location.pathname === "/sucursales" ? "#009DCF" : "white",
                    textDecoration: "none",
                    fontSize: "1rem",
                    marginRight: "20px",
                    fontWeight:
                      location.pathname === "/sucursales" ? "bold" : "normal",
                  }}
                >
                  Sucursales
                </Typography>
              )}
            </Box>
          )}

          <Box
            sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={usuarioIcon} style={{ width: 40, height: 40 }} />
              </IconButton>
            </Tooltip>
            <Backdrop
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
              open={Boolean(anchorElUser)}
              onClick={handleCloseUserMenu}
            />
            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  borderRadius: "15px",
                  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                disabled
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  marginBottom: "10px",
                }}
              >
                <PersonIcon sx={{ color: "black" }} />
                <Typography
                  sx={{ fontWeight: 600, color: "black", fontSize: "1rem" }}
                >
                  Hola, {userName}
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  borderRadius: "15px",
                  padding: "10px 25px",
                  marginBottom: "10px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  backgroundColor: "#f1f1f1",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <LogoutIcon sx={{ color: "black", fontSize: "18px" }} />
                <Typography
                  sx={{ textAlign: "center", color: "black", fontSize: "1rem" }}
                >
                  {settings[0]}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
