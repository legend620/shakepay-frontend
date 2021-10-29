import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Container,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import moment from "moment";

import cashInImage from "../assets/icons/cashin.svg";
import cashOutImage from "../assets/icons/cashout.svg";
import exchangeImage from "../assets/icons/exchange.svg";

import { getCurrencyData } from "../service";

export default function Home() {
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const { symbol } = useParams();

  const renderIcon = (direction) => {
    let img = null;
    if (direction === "credit") {
      img = cashInImage;
    } else if (direction === "debit") {
      img = cashOutImage;
    } else {
      img = exchangeImage;
    }

    return <img src={img} alt="icon" />;
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  const handleDetailOpen = (type, amount, createdAt, direction) => {
    setDetailData({ type, amount, createdAt, direction });
    setDetailOpen(true);
  };

  useEffect(() => {
    const getData = async () => {
      const { name, balance, transactions } = await getCurrencyData(symbol);
      setName(name);
      setBalance(balance);
      setTransactions(transactions);
    };

    getData();

    return () => {
      setName(null);
      setBalance(null);
      setTransactions([]);
    };
  }, [symbol]);

  return (
    <Container maxWidth="sm">
      <Box py={3}>
        <Box display="flex" mb={2}>
          <IconButton component="a" href="/home">
            <ChevronLeftIcon />
          </IconButton>
          <Typography
            align="center"
            variant="h6"
            component="p"
            style={{ flex: 1 }}
          >
            {name}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" component="p">
            Balance
          </Typography>
          <Typography variant="h6" component="p">
            {balance && balance.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box mt={2}>
        <Typography variant="h6">Transactions</Typography>
        <List>
          {transactions.map(
            ({ type, amount, createdAt, direction, from, to }, i) => (
              <ListItem disablePadding key={i}>
                <ListItemButton
                  onClick={() =>
                    handleDetailOpen(type, amount, createdAt, direction)
                  }
                >
                  <ListItemIcon>{renderIcon(direction)}</ListItemIcon>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ width: "100%" }}
                    ml={2}
                  >
                    <Box>
                      <Typography variant="body1">{type}</Typography>
                      <Typography color="textSecondary" variant="body2">
                        {moment(createdAt).format("ll")}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        align="right"
                        variant="body1"
                        color={direction === "credit" ? "primary" : "default"}
                      >
                        {amount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Box>
      <Dialog onClose={handleDetailClose} open={detailOpen}>
        {detailData && (
          <>
            <DialogTitle>{detailData.type}</DialogTitle>
            <Divider />
            <DialogContent>
              <Box mb={1}>
                <Typography variant="body2" color="textSecondary">
                  {detailData.direction === "credit" ? "From" : "To"}
                </Typography>
                <Typography variant="body1">{detailData.type}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="textSecondary">
                  Amount
                </Typography>
                <Typography variant="body1">
                  {detailData.amount.toFixed(2)}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="textSecondary">
                  {detailData.direction === "credit" ? "Received" : "Sent"}
                </Typography>
                <Typography variant="body1">
                  {moment(detailData.createdAt).format("llll")}
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
