import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Popover,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";

const InstallPWA = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [iosInstallMessage, setIosInstallMessage] = useState(false);
  const deferredPrompt = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isInStandaloneMode = () => {
    return "standalone" in window.navigator && window.navigator.standalone;
  };

  useEffect(() => {
    if (isIos() && !isInStandaloneMode()) {
      setIosInstallMessage(true);
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt.current = e;

      if (isIos() && !isInStandaloneMode()) {
        setIosInstallMessage(true);
      } else {
        setShowDialog(true);
      }

      console.log("beforeinstallprompt event was fired.");
    });

    window.addEventListener("appinstalled", () => {
      setShowDialog(false);
      deferredPrompt.current = null;
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      setShowDialog(false);
    }
  };

  const handlePopoverClose = () => {
    setIosInstallMessage(false);
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Install PWA Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Install Vansale</DialogTitle>
        <DialogContent>
          {/* <Typography>
            Get the app on your device for easy access & a better experience!
          </Typography> */}
          <Button
            variant="contained"
            onClick={handleInstallClick}
            fullWidth
            startIcon={<DownloadIcon />}
          >
            Install
          </Button>
        </DialogContent>
      </Dialog>

      {/* iOS Installation Popover */}
      <Popover
        open={iosInstallMessage}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div style={{ padding: "1rem", backgroundColor: "#e0f7fa" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Install Frappe HR</Typography>
            <IconButton size="small" onClick={handlePopoverClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography variant="body2">
            Get the app on your iPhone for easy access & a better experience.
            <br />
            Tap{" "}
            <ShareIcon
              fontSize="small"
              style={{ verticalAlign: "middle" }}
            />{" "}
            and then "Add to Home Screen"
          </Typography>
        </div>
      </Popover>
    </div>
  );
};

export default InstallPWA;
