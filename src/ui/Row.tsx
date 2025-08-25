import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCarryReceipts } from "../api/getData";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router";
import { BASE_URL } from "../api/base";
import { formatNumberWithComma } from "../utils/formatNumberWithComma";
import { getNextAction } from "../utils/getNextAction";
import type { createData } from "../utils/createData";

export function Row(props: {
  row: ReturnType<typeof createData>;
  factorNumber: string;
  showNextActions?: boolean;
}) {
  const { row, factorNumber, showNextActions = false } = props;
  const [open, setOpen] = useState(false);

  const {
    data: carryReceipts,
    isLoading,
    isError,
  } = useCarryReceipts(factorNumber);

  // جمع‌آوری اقدامات بعدی
  const nextActions = isLoading
    ? "در حال بارگذاری..."
    : carryReceipts
    ? carryReceipts
        .map((receipt) => getNextAction(receipt.Status))
        .filter((action) => action !== "-")
        .join(", ")
    : "-";

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
            to={`${BASE_URL}/SitePages/lcdocuments.aspx?Factor_ID=${encodeURIComponent(
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
        <TableCell align="right">{row.LCNumber}</TableCell>
        <TableCell align="right">
          {formatNumberWithComma(row.LCTotal)}
        </TableCell>{" "}
        {showNextActions && <TableCell align="right">{nextActions}</TableCell>}
      </TableRow>

      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={showNextActions ? 9 : 8}
        >
          <Collapse
            sx={{ minWidth: "0px" }}
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                تاریخچه مراحل حمل
              </Typography>

              {isLoading ? (
                <CircularProgress size={24} />
              ) : isError ? (
                <Typography color="error">خطا در دریافت مراحل حمل</Typography>
              ) : carryReceipts?.length ? (
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>تاریخ</TableCell>
                      <TableCell>مرحله</TableCell>
                      <TableCell align="right">تعداد</TableCell>
                      <TableCell align="right">جمع کل</TableCell>
                      <TableCell align="right">اقدام بعدی</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carryReceipts.map((receipt) => (
                      <TableRow key={receipt.Title}>
                        <TableCell component="th" scope="row">
                          {receipt.Date ?? "-"}
                        </TableCell>
                        <TableCell>{receipt.Title ?? "-"}</TableCell>
                        <TableCell align="right">
                          {receipt.Count ?? "-"}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumberWithComma(receipt.Total) ?? "-"}
                        </TableCell>
                        <TableCell align="right">
                          {getNextAction(receipt.Status) ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography color="text.secondary">
                  مرحله‌ای برای این فاکتور ثبت نشده است.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
