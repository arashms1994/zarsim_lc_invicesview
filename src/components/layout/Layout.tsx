import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import OngoingCollapsibleTable from "../ongoing/Ongoing";
import FinishedCollapsibleTable from "../finished/Finished";
import AllItemsCollapsibleTable from "../allItems/AllItems";
import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { tabProps } from "../../utils/tabProps";
import { CustomTabPanel } from "../../ui/CustomTabPanel";

export default function Layout() {
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label="ال سی های جاری" {...tabProps(0)} />
          <Tab label="ال سی های پایان یافته" {...tabProps(1)} />
          <Tab label="همه ی ال سی ها" {...tabProps(2)} />
        </Tabs>
        <Box>
          <TextField
            id="search"
            label="جستجو"
            type="search"
            variant="outlined"
            color="secondary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Stack>

      <CustomTabPanel value={value} index={0}>
        <OngoingCollapsibleTable searchTerm={searchTerm} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <FinishedCollapsibleTable searchTerm={searchTerm} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AllItemsCollapsibleTable searchTerm={searchTerm} />
      </CustomTabPanel>
    </Box>
  );
}
