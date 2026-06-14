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
        
        purchasedText:{
            textDecoration: 'line-through',
            color: '#bdbdbd',
            fontSize: '1rem',
        }
    })
);


const ItemList = (props) => {
    const handleClick = (value) => {
        const data = { id: value._id }
        Axios.post('http://localhost:9000/groccery/updatePurchaseStatus', data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
        }).then(() => {
            if (props.refreshItems) props.refreshItems()
        })
    }
    const handelDelete = (value) => {
        const data = { id: value._id }
        Axios.post('http://localhost:9000/groccery/deleteGrocceryItem', data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
        }).then(() => {
            if (props.refreshItems) props.refreshItems()
        })
    }

    const aggregateItems = (items) => {
        const grouped = {};
        items.forEach(item => {
            const key = item.grocceryItem;
            if (!grouped[key]) {
                grouped[key] = {
                    ...item,
                    quantity: 1,
                    totalPrice: item.price,
                };
            } else {
                grouped[key].quantity += 1;
                grouped[key].totalPrice += item.price;
            }
        });
        return Object.values(grouped);
    };

    const classes = useStyles();
    const aggregatedItems = aggregateItems(props.items);
    const total = aggregatedItems.reduce((sum, item) => sum + (item.totalPrice > 0 ? item.totalPrice : 0), 0);
    return (
        <>
        <List dense className={classes.root}>
            {aggregatedItems.map((value, index) => {
                const showPrice = value.totalPrice > 0;
                return (
                    <ListItem key={index} button>
                        <ListItemText
                            id={value._id}
                            primary={value.grocceryItem + (value.quantity > 1 ? ` (x${value.quantity})` : '') + (showPrice ? `  |  ₹${Number(value.totalPrice).toFixed(2)}` : '')}
                            primaryTypographyProps={{
                                className: value.isPurchased ? classes.purchasedText : '',
                                style: { fontSize: '1rem' },
                            }}
                        />
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
        {aggregatedItems.length > 0 && (
            <button 
                className="checkout-action-button"
                onClick={() => {
                    if (props.onShowCheckout) props.onShowCheckout();
                }}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    marginTop: '1rem',
                    background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 6px 18px rgba(255, 87, 34, 0.25)'
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 24px rgba(255, 87, 34, 0.35)';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 18px rgba(255, 87, 34, 0.25)';
                }}
            >
                🛒 Proceed to Checkout
            </button>
        )}
        </>
    )
}

export default ItemList;