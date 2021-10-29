import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";

import { getAssets } from "../service";

import cadImage from "../assets/icons/currency_cad.svg";
import btcImage from "../assets/icons/currency_btc.svg";
import ethImage from "../assets/icons/currency_eth.svg";
import logoImage from "../assets/icons/logo.svg";

export default function Home() {
  const [assets, setAssets] = useState([]);
  const [totalBalance, setTotalBalance] = useState(null);
  const icons = {
    CAD: cadImage,
    BTC: btcImage,
    ETH: ethImage,
  };

  useEffect(() => {
    const getData = async () => {
      const assets = await getAssets();
      setAssets(assets);

      let totalBalance = 0;
      assets.map(({ rate, balance }) => (totalBalance += rate * balance));
      setTotalBalance(totalBalance);
    };

    getData();

    return () => setAssets([]);
  }, []);

  return (
    <Container maxWidth="sm">
      <Box py={3} display="flex" flexDirection="column" alignItems="center">
        <Box mb={2}>
          <Avatar alt="logo" src={logoImage} />
        </Box>
        <Typography align="center" variant="h4" style={{ display: "flex" }}>
          <Typography component="span" variant="h6">
            $
          </Typography>
          &nbsp;
          {totalBalance && totalBalance.toFixed(2)}
        </Typography>
      </Box>
      <Divider />
      <List>
        {assets.map(({ symbol, name, balance, rate }, i) => (
          <ListItem disablePadding key={i}>
            <ListItemButton component="a" href={`/wallet/${symbol}`}>
              <ListItemIcon>
                <img src={icons[symbol]} alt={`${symbol}_icon`} />
              </ListItemIcon>
              <Box
                display="flex"
                justifyContent="space-between"
                style={{ width: "100%" }}
                ml={2}
              >
                <Box>
                  <Typography variant="body1">{name}</Typography>
                  {symbol !== "CAD" && (
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >{`$${rate}`}</Typography>
                  )}
                </Box>
                <Box>
                  <Typography align="right" variant="body1">
                    {balance.toFixed(2)}
                  </Typography>
                  {symbol !== "CAD" && (
                    <Typography
                      color="textSecondary"
                      align="right"
                      variant="body2"
                    >
                      {`$${(rate * balance).toFixed(2)}`}
                    </Typography>
                  )}
                </Box>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
