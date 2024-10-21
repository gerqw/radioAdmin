import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import SideMenu from "../components/SideMenu";
import AppTheme from "/shared-theme/AppTheme";
import { Box } from "@mui/material";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../theme/customizations";
import CollapsibleTable from "../components/CollapsibleTable";
const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Search(props) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <CollapsibleTable />
      </Box>
    </AppTheme>
  );
}
