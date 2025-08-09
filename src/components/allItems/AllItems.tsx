import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getCurrentUser, useLCInvoices } from "../../api/getData";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { ICollapsibleTableProps } from "../../utils/type";
import { createData } from "../../utils/createData";
import { Row } from "../../ui/Row";

const AllItemsCollapsibleTable: React.FC<ICollapsibleTableProps> = ({
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
      const isUserRelated =
        item.managertext === userName || item.FirstUser === userName;

      const matchesSearch =
        !searchTerm ||
        item.Title?.includes(searchTerm) ||
        item.Customer?.includes(searchTerm);

      const isSendFactorTrue = item.send_factor === true;

      return (
        isSendFactorTrue && (isAdminUser || isUserRelated) && matchesSearch
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
            <Row key={row.Title} row={row} factorNumber={row.Title} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllItemsCollapsibleTable;
