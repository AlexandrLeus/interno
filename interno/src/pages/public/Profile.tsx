import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { useThemeContext } from '../../contexts/ThemeContext';
import { useUploadAvatar } from "../../hooks/useUsers";

const UserProfile = () => {
  const [tab, setTab] = useState(0);
  const { user, updateProfile } = useAuth()
  const { mode, toggleTheme } = useThemeContext();
  const { mutate: uploadAvatar } = useUploadAvatar();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      uploadAvatar(file, {
        onSuccess: () => {
          setTimeout(() => {
          setPreviewUrl(null);
          URL.revokeObjectURL(url);
        }, 0);
        },
        onError: () => {
          setPreviewUrl(user?.avatar || null);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Box position="relative">
            <Avatar
              src={previewUrl || user?.avatar}
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
            <Typography variant="h5">{user?.username}</Typography>
            <Typography color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>


        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Profile and Security" />
          <Tab label="Preferences" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        {tab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              To change your profile settings
            </Typography>
            <Button sx={{ mt: 3 }} variant="contained" onClick={updateProfile}>
              click here
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>

            <FormControlLabel
              control={<Switch />}
              label="Email notifications"
            />

            <FormControlLabel
              control={<Switch checked={mode === 'dark'}
                onChange={toggleTheme} />}
              label="Dark mode"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;