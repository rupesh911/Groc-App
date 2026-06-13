import Axios from 'axios'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';


import React from 'react'
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: "100%",
            maxWidth: 450,
            backgroundColor:"white",
            
            position: "relative",
            overflow: "auto",
            maxHeight: 300,
            marginTop: '0.1em'
        },
        
        listSection: {
        },
        
        text:{
            textDecoration: 'line-through'
        }
    })
);


const ItemList = (props) => {
    const handleClick = (value) => {
        const data = { id: value._id }
        Axios.post('http://localhost:9000/groccery/updatePurchaseStatus', data).then(() => {
            if (props.refreshItems) props.refreshItems()
        })
    }
    const handelDelete = (value) => {
        const data = { id: value._id }
        Axios.post('http://localhost:9000/groccery/deleteGrocceryItem', data).then(() => {
            if (props.refreshItems) props.refreshItems()
        })
    }
    const classes = useStyles();
    const total = props.items.reduce((sum, item) => sum + (item.price > 0 ? item.price : 0), 0);
    return (
        <>
        <List dense className={classes.root}>
            {props.items.map((value) => {
                const showPrice = value.price > 0;
                return (
                    <ListItem key={value._id} button>
                        <ListItemText id={value._id}  primary={value.grocceryItem + (showPrice ? `  |  ₹${Number(value.price).toFixed(2)}` : '')} className={value.isPurchased ?classes.text: '' } />
                        <ListItemSecondaryAction>
                            <Button onClick={() => {
                                handleClick(value )
                            }}>{value.isPurchased ? 'Purchased': 'To Purchase'}
                            </Button>
                            <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{handelDelete(value)}}>
                                <Delete />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
        <div style={{textAlign: 'right', fontWeight: 600, margin: '0.7em 0 0.2em 0', fontSize: '1.1em', color: '#232526'}}>Total: ₹{total.toFixed(2)}</div>
        </>
    )
}

export default ItemList;