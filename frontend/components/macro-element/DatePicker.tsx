'use client';

import React from 'react';
import { fr } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocalizationProvider,
  DatePicker as MUIDatePicker,
} from '@mui/x-date-pickers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField } from '@mui/material';

const darkTheme = createTheme({
    shape: {
        borderRadius: 10, // Arrondi des coins
    },
    palette: {
        text: {
        primary: '#ffffff', // Blanc
        secondary: '#cbd5e1', // Slate-300
        },
        action: {
        active: '#ffffff', // Couleur des icônes
        },
        background: {
        paper: '#334155', // Slate-700
        },
    },
    components: {
        MuiOutlinedInput: {
        styleOverrides: {
            root: {
            backgroundColor: '#334155', // Slate-700
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#94a3b8', // Slate-400 au survol
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6', // Blue-500 au focus
                borderWidth: 2,
            },
            },
            input: {
            color: '#ffffff', // Texte blanc
            padding: '8.5px 14px',
            },
        },
        },
        MuiInputLabel: {
        styleOverrides: {
            root: {
            color: '#cbd5e1', // Slate-300
            '&.Mui-focused': {
                color: '#3b82f6', // Blue-500
            },
            },
        },
        },
        MuiSvgIcon: {
        styleOverrides: {
            root: {
            color: '#cbd5e1', // Slate-300
            },
        },
        },
    },
    });

    interface DatePickerProps {
        date: Date;
        onChange: (d: Date | null) => void;
        futureDisabled?: boolean;
        disablePast?: boolean;
    }

    export const DatePicker = ({ date, onChange, futureDisabled, disablePast }: DatePickerProps) => {
    return (
        <ThemeProvider theme={darkTheme}>
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={fr}
        >
            <MUIDatePicker
            value={date}
            onChange={onChange}
            format="dd/MM/yyyy"
            enableAccessibleFieldDOMStructure={false}
            disableFuture={futureDisabled}
            disablePast={disablePast}
            slots={{
                textField: (params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    sx={{ 
                    width: '170px',
                    '& .MuiInputBase-input': {
                        color: '#ffffff', // Texte blanc
                    },
                    }}
                />
                ),
            }}
            slotProps={{
                textField: {
                InputLabelProps: {
                    shrink: true,
                },
                },
                openPickerButton: {
                sx: {
                    color: '#cbd5e1', // Slate-300
                    '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                },
                },
                popper: {
                sx: {
                    '& .MuiPaper-root': {
                    backgroundColor: '#334155', // Slate-700
                    color: '#ffffff', // Texte blanc
                    '& .MuiPickersDay-root': {
                        color: '#ffffff', // Texte blanc
                        '&.Mui-selected': {
                        backgroundColor: '#3b82f6', // Blue-500
                        color: '#ffffff',
                        },
                        '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                    },
                    '& .MuiPickersCalendarHeader-label': {
                        color: '#ffffff', // Texte blanc
                    },
                    '& .MuiIconButton-root': {
                        color: '#cbd5e1', // Slate-300
                    },
                    },
                },
                },
            }}
            />
        </LocalizationProvider>
        </ThemeProvider>
    );
};