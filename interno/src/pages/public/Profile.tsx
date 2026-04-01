import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useAuth } from "../../auth/useAuth";

const UserProfile = () => {
  const [tab, setTab] = useState(0);
  const {user} = useAuth()
  const [profile, setUser] = useState({
    name: user?.username,
    email: user?.email,
  });

  const [avatar, setAvatar] = useState<string | null>(null);

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);

    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Box position="relative">
            <Avatar
              src={avatar || ""}
              sx={{ width: 80, height: 80 }}
            />
            <Button
              variant="contained"
              component="label"
              size="small"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                fontSize: 10,
                minWidth: "unset",
                px: 1,
              }}
            >
              Upload
              <input
                type="file"
                hidden
                onChange={handleAvatarUpload}
              />
            </Button>
          </Box>

          <Box>
            <Typography variant="h5">{profile.name}</Typography>
            <Typography color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
        </Box>


        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Preferences" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        {tab === 0 && (
          <Box>
            <Grid container spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  label="Name"
                  value={profile.name}
                  onChange={(e) =>
                    setUser({ ...profile, name: e.target.value })
                  }
                />
              </Grid>

              <Grid>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  onChange={(e) =>
                    setUser({ ...profile, email: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Button sx={{ mt: 3 }} variant="contained">
              Save Changes
            </Button>
          </Box>
        )}

    
        {tab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Current Password"
              value={password.oldPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  oldPassword: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="New Password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPassword: e.target.value,
                })
              }
            />

            <Button variant="contained" sx={{ mt: 2 }}>
              Update Password
            </Button>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6">
              Two-Factor Authentication
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  
                />
              }
              label="Enable 2FA"
            />
          </Box>
        )}

 
        {tab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications"
            />

            <FormControlLabel
              control={<Switch />}
              label="Dark mode"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;