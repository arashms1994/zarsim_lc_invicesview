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
import type { ICarryReceipt } from "../utils/type";

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

  const invoiceNextActions = isLoading
    ? "در حال بارگذاری..."
    : carryReceipts
    ? [
        ...new Set(
          carryReceipts
            .map((receipt) => getNextAction(receipt.Status))
            .filter((action) => action !== "-")
        ),
      ].join(" - ") || "بدون اقدام بعدی"
    : "-";

  const groupedReceipts = (carryReceipts || []).reduce((acc, receipt) => {
    if (receipt.Carry_Phase_GUID) {
      if (!acc[receipt.Carry_Phase_GUID]) {
        acc[receipt.Carry_Phase_GUID] = [];
      }
      acc[receipt.Carry_Phase_GUID].push(receipt);
    }
    return acc;
  }, {} as Record<string, ICarryReceipt[]>);

  const carryPhases = Object.entries(groupedReceipts).map(
    ([carryPhaseGUID, receipts]) => {
      const titles = receipts.map((r) => r.Title).join(" - ");
      const totalCount = receipts.reduce(
        (sum, r) => sum + Number(r.Count || 0),
        0
      );
      const totalValue = receipts.reduce(
        (sum, r) => sum + Number(r.Total || 0),
        0
      );
      const date = receipts[0].Date;
      const carryPhaseNextAction = getNextAction(receipts[0].Status);

      return {
        carryPhaseGUID,
        titles,
        totalCount,
        totalValue,
        date,
        carryPhaseNextAction,
        receipts,
      };
    }
  );

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
        </TableCell>
        {showNextActions && (
          <TableCell align="right">{invoiceNextActions}</TableCell>
        )}
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
              ) : carryPhases.length ? (
                <Table size="small" aria-label="carry-phases">
                  <TableHead>
                    <TableRow>
                      <TableCell>مرحله حمل</TableCell>
                      <TableCell>شماره فاکتورها</TableCell>
                      <TableCell align="right">تاریخ</TableCell>
                      <TableCell align="right">متراژ مجموع</TableCell>
                      <TableCell align="right">جمع کل</TableCell>
                      <TableCell align="right">اقدام بعدی</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carryPhases.map((phase) => (
                      <TableRow key={phase.carryPhaseGUID}>
                        <TableCell component="th" scope="row">
                          {phase.carryPhaseGUID}
                        </TableCell>
                        <TableCell>{phase.titles}</TableCell>
                        <TableCell align="right">{phase.date ?? "-"}</TableCell>
                        <TableCell align="right">
                          {formatNumberWithComma(phase.totalCount) ?? "-"}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumberWithComma(phase.totalValue) ?? "-"}
                        </TableCell>
                        <TableCell align="right">
                          {phase.carryPhaseNextAction}
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
