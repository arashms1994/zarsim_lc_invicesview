import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getCurrentUser, useLCInvoices } from "../../api/getData";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { Link } from "react-router";
import type { ICollapsibleTableProps } from "../../utils/type";

function createData(
  Title: string,
  Customer: string,
  type_factor: string,
  majmoemetraj: string,
  total_mani: string,
  LCNumber: string,
  LCTotal: string
) {
  return {
    Title,
    Customer,
    type_factor,
    majmoemetraj,
    total_mani,
    LCNumber,
    LCTotal,
    history: [
      {
        date: "2020-01-05",
        customerId: "52456",
        amount: "520",
        total: "55585",
      },
      {
        date: "2020-01-02",
        customerId: "556699",
        amount: "854",
        total: "4554522",
      },
      {
        date: "2020-01-02",
        customerId: "54636",
        amount: "456754754",
        total: "4756767",
      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Link
            to={`https://portal.zarsim.com/SitePages/lcdocuments.aspx?Factor_ID=${encodeURIComponent(
              row.Title
            )}`}
          >
            {row.Title}
          </Link>
        </TableCell>
        <TableCell align="right">{row.Customer}</TableCell>
        <TableCell align="right">{row.type_factor}</TableCell>
        <TableCell align="right">{row.majmoemetraj}</TableCell>
        <TableCell align="right">{row.total_mani}</TableCell>
        <TableCell align="right">{row.LCTotal}</TableCell>
        <TableCell align="right">{row.LCNumber}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            sx={{ minWidth: "0" }}
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                تاریخچه حمل
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>تاریخ</TableCell>
                    <TableCell>شماره فاکتور</TableCell>
                    <TableCell align="right">متراژ</TableCell>
                    <TableCell align="right">مبلغ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">{historyRow.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const OngoingCollapsibleTable: React.FC<ICollapsibleTableProps> = ({
  searchTerm,
}) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    getCurrentUser().then(setUserName).catch(console.error);
  }, []);

  const { data: faktors, isLoading, isError } = useLCInvoices();

  const transformedRows = useMemo(() => {
    if (!faktors) return [];

    const adminUsers = ["rashaadmin", "mmoradabadi"];
    const normalizedUserName = userName.toLowerCase();

    const isAdminUser = adminUsers.some((admin) =>
      normalizedUserName.includes(admin.toLowerCase())
    );

    const filteredFaktors = faktors.filter((item) => {
      const isLCEndingValid = item.LCEnding === "0" || item.LCEnding === "";

      const isUserRelated =
        item.managertext === userName || item.FirstUser === userName;

      const matchesSearch =
        !searchTerm ||
        item.Title?.includes(searchTerm) ||
        item.Customer?.includes(searchTerm);

      const isSendFactorTrue = item.send_factor === true;

      return (
        isSendFactorTrue &&
        isLCEndingValid &&
        (isAdminUser || isUserRelated) &&
        matchesSearch
      );
    });

    return filteredFaktors.map((item) =>
      createData(
        item.Title,
        item.Customer,
        item.type_factor,
        item.majmoemetraj,
        item.total_mani,
        item.LCTotal ?? "",
        item.LCNumber ?? ""
      )
    );
  }, [faktors, userName, searchTerm]);

  if (!userName) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isLoading)
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress color="secondary" />
      </Box>
    );

  if (isError)
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        خطا در دریافت اطلاعات
      </Alert>
    );

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>شماره پیش فاکتور</TableCell>
            <TableCell align="right">نام مشتری</TableCell>
            <TableCell align="right">نوع پیش فاکتور</TableCell>
            <TableCell align="right">مجموع متراژ پیش فاکتور</TableCell>
            <TableCell align="right">کل مبلغ پیش فاکتور</TableCell>
            <TableCell align="right">شماره LC</TableCell>
            <TableCell align="right">مبلغ LC</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transformedRows.map((row) => (
            <Row key={row.LCNumber} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OngoingCollapsibleTable;
