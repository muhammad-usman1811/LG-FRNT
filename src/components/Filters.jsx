import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import ThermostatAutoIcon from "@mui/icons-material/ThermostatAuto";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import { Stack } from "@mui/system";

const Filters = ({
  temperature,
  answerLength,
  temperatureChange,
  answerLengthChange,
  onTemperatureChange,
  onAnswerLengthChange,
}) => {
  const temperatureValues = [
    {
      value: 0,
      label: "Precise",
    },
    {
      value: 50,
      label: "Balanced",
    },
    {
      value: 100,
      label: "Imaginative",
    },
  ];

  const answerLengthValues = [
    {
      value: 0,
      label: "Low",
    },
    {
      value: 50,
      label: "Medium",
    },
    {
      value: 100,
      label: "High",
    },
  ];

  function valuetext(value) {
    return `${value}`;
  }
  return (
    <Stack
      sx={{ display: "flex", flexDirection: "column", padding: 2, rowGap: 4 }}
    >
      <Box display="flex" justifyContent="space-around">
        <Box display="flex">
          <ThermostatAutoIcon />
          <Typography>Temperature</Typography>
        </Box>
        <Box display="flex" sx={{ width: 300 }}>
          <Slider
            sx={{ color: "003D78" }}
            aria-label="Precision marks"
            defaultValue={0}
            value={temperature}
            onChange={(event, newValue) => {
              temperatureChange(newValue);
              onTemperatureChange(newValue);
            }}
            getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay="auto"
            marks={temperatureValues}
            valueLabelFormat={(value) => {
              switch (value) {
                case 0:
                  return "Precise";
                case 50:
                  return "Balanced";
                case 100:
                  return "Imaginative";
                default:
                  return "";
              }
            }}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-around">
        <Box display="flex">
          <LineWeightIcon />
          <Typography>Answer Length</Typography>
        </Box>
        <Box display="flex" sx={{ width: 300 }}>
          <Slider
            sx={{ color: "003D78" }}
            aria-label="Answer length"
            defaultValue={100}
            value={answerLength}
            onChange={(event, newValue) => {
              answerLengthChange(newValue);
              onAnswerLengthChange(newValue);
            }}
            getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay="auto"
            marks={answerLengthValues}
            valueLabelFormat={(value) => {
              switch (value) {
                case 0:
                  return "Low";
                case 50:
                  return "Medium";
                case 100:
                  return "High";
                default:
                  return "";
              }
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default Filters;
