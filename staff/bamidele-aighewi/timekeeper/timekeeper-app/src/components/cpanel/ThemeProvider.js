import React, { useMemo } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

export default function ({ children, darkThemeActive }) {
    const toggleStyles = () => {
        let modifiers = {} // set to empty to use MUI defaults

        if (darkThemeActive) {
            modifiers = {
                "primary": {
                    "main": "#fafafa",
                },
                "secondary": {
                    "light": "rgba(96, 96, 96, 0.5)",
                    "main": "#fafafa",
                    "dark": "rgba(151, 151, 151, 1)",
                    "contrastText": "#fff"
                },
            }

        }

        return modifiers
    }

    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: darkThemeActive ? 'dark' : 'light',
                    ...toggleStyles()
                },
                typography: {
                    fontFamily: [
                        '-apple-system',
                        'BlinkMacSystemFont',
                        '"Segoe UI"',
                        'Roboto',
                        '"Helvetica Neue"',
                        'Arial',
                        'sans-serif',
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"',
                    ].join(','),
                },
            }),
        [darkThemeActive],
    );

    return (
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    )
}
