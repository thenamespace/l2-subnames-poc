import { PropsWithChildren } from "react";
import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'

export const ThorinDesign = ({children}: PropsWithChildren) => {
    return (
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          {children}
        </ThemeProvider>
      )
}