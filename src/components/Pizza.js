import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


//komponentti
//material ui
const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
 

const Pizza = ({ pizza }) => {
    return(
        <TableRow>
        <CustomTableCell component="th" scope="row">
          {pizza.content}
        </CustomTableCell>
        </TableRow>
    )
}

export default Pizza