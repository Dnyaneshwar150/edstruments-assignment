import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FilterCondition } from "../../types/filters";
import { Download, FilterX } from "lucide-react";

interface TableHeadingProps {
  title?: string;
  totalRows: number;
  filters: FilterCondition[];
  onClearFilters: () => void;
  onExportCSV?: () => void;
}

export const TableHeading = ({
  title,
  totalRows,
  filters,
  onClearFilters,
  onExportCSV,
}: TableHeadingProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Box>
        {title && (
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {title}
          </Typography>
        )}

        <Typography
          variant='body2'
          sx={{ color: "text.secondary", mt: 0.25 }}
        >
          {totalRows} result{totalRows !== 1 ? "s" : ""}
          {filters.length > 0 &&
            ` · ${filters.length} filter${
              filters.length !== 1 ? "s" : ""
            } active`}
        </Typography>
      </Box>

      <Stack
        direction='row'
        spacing={1}
      >
        {filters.length > 0 && (
          <Button
            size='small'
            startIcon={<FilterX size={16} />}
            onClick={onClearFilters}
            sx={{ textTransform: "none" }}
          >
            Clear filters
          </Button>
        )}

        {onExportCSV && (
          <Tooltip title='Export to CSV'>
            <IconButton
              size='small'
              onClick={onExportCSV}
              sx={{ color: "text.secondary" }}
            >
              <Download size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};
