import { useState } from "react";
import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { CippTablePage } from "/src/components/CippComponents/CippTablePage.jsx";
import {
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm } from "react-hook-form";
import CippFormComponent from "/src/components/CippComponents/CippFormComponent";

const simpleColumns = ["Timestamp", "Tenant", "Title", "Actions"];

const apiUrl = "/api/ListAuditLogs";
const pageTitle = "Audit Logs";

const Page = () => {
  const formControl = useForm({
    defaultValues: {
      dateFilter: "relative",
      Time: 1,
      Interval: "d",
      startDate: null,
      endDate: null,
    },
  });

  const [expanded, setExpanded] = useState(false); // Accordion state
  const [relativeTime, setRelativeTime] = useState("1d"); // Relative time filter
  const [startDate, setStartDate] = useState(null); // Start date filter
  const [endDate, setEndDate] = useState(null); // End date filter

  const onSubmit = (data) => {
    // Handle filter application logic
    if (data.dateFilter === "relative") {
      setRelativeTime(`${data.Time}${data.Interval}`);
      setStartDate(null);
      setEndDate(null);
    } else if (data.dateFilter === "startEnd") {
      setRelativeTime(null);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
    }
  };

  return (
    <CippTablePage
      tableFilter={
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Search Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={formControl.handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/* Date Filter Type */}
                <Grid item xs={12}>
                  <CippFormComponent
                    type="radio"
                    row
                    name="dateFilter"
                    label="Date Filter Type"
                    options={[
                      { label: "Relative", value: "relative" },
                      { label: "Start / End", value: "startEnd" },
                    ]}
                    formControl={formControl}
                  />
                </Grid>

                {/* Relative Time Filter */}
                {formControl.watch("dateFilter") === "relative" && (
                  <>
                    <Grid item xs={6}>
                      <CippFormComponent
                        type="number"
                        name="Time"
                        label="Last"
                        formControl={formControl}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CippFormComponent
                        type="select"
                        name="Interval"
                        label="Interval"
                        options={[
                          { label: "Minutes", value: "m" },
                          { label: "Hours", value: "h" },
                          { label: "Days", value: "d" },
                        ]}
                        formControl={formControl}
                      />
                    </Grid>
                  </>
                )}

                {/* Start and End Date Filters */}
                {formControl.watch("dateFilter") === "startEnd" && (
                  <>
                    <Grid item xs={6}>
                      <CippFormComponent
                        type="datePicker"
                        name="startDate"
                        label="Start Date"
                        dateTimeType="date"
                        formControl={formControl}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CippFormComponent
                        type="datePicker"
                        name="endDate"
                        label="End Date"
                        dateTimeType="date"
                        formControl={formControl}
                      />
                    </Grid>
                  </>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Apply Filters
                  </Button>
                </Grid>
              </Grid>
            </form>
          </AccordionDetails>
        </Accordion>
      }
      title={pageTitle}
      apiUrl={apiUrl}
      apiDataKey="Results"
      simpleColumns={simpleColumns}
      queryKey={`AuditLogs-${relativeTime}-${startDate}-${endDate}`}
      apiData={{
        RelativeTime: relativeTime,
        StartDate: startDate,
        EndDate: endDate,
      }}
    />
  );
};

/* Comment to Developer:
 - The filter options are implemented within an Accordion for a collapsible UI.
 - DateFilter types are supported as 'Relative' and 'Start/End'.
 - Relative time is calculated based on Time and Interval inputs.
 - Form state is managed using react-hook-form for simplicity and reusability.
 - Filters are dynamically applied to the table query.
*/

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;