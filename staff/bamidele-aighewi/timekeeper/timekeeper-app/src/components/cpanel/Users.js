import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import ActionButtons from './ActionButtons'
import { useHistory } from "react-router-dom"
import { retrieveUsers } from "../../logic";
import { userProperties } from "../../utils";


const useStyles = makeStyles({
    table: {
        // minWidth: 650,
    },
})

export default function ({ handleSnackbar }) {
    const classes = useStyles()
    let history = useHistory()
    const [users, setUsers] = useState([])

    const handleRetrieveUsers = async () => {
        try {
            const _users = await retrieveUsers()
            console.log(_users)
            setUsers(_users)
        } catch ({ message }) {
            handleSnackbar(message, 'error')
        }
    }

    useEffect(() => {
        handleRetrieveUsers()
    }, [])

    return (
        <TableContainer component={Paper}>
            <Table size="small" className={classes.table} aria-label="user's table">
                <TableHead>
                    <TableRow>
                        <TableCell>{"Name"}</TableCell>
                        <TableCell>{"Surname"}</TableCell>
                        <TableCell>{"E-mail"}</TableCell>
                        <TableCell>{"Role"}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user, index) => {
                        const { id, name, surname, email, role } = user

                        return <TableRow key={index}>
                            <TableCell component="th" scope="row">{name}</TableCell>
                            <TableCell>{surname}</TableCell>
                            <TableCell>{email}</TableCell>
                            <TableCell>{userProperties.roles.names[role - 1]}</TableCell>
                            <TableCell>
                                <ActionButtons
                                    index={index}
                                    resource={user}
                                    handleDelete={false}
                                    handleEdit={() => { history.push(`/cpanel/user/${id}`) }}
                                />
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
