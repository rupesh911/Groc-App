import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import Axios from 'axios'
import ItemList from "./itemList";
import React, { useEffect } from 'react'
import { createStyles, makeStyles, Paper, IconButton,  InputBase,} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    searchBox: {
      top: "1rem",
      marginRight: "1em",
    },
    listRoot: {
      width: "100%",
      maxWidth: 450,
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      overflow: "auto",
      maxHeight: 300,
      marginTop:'0.3em'
    },
    root: {
      
      padding: "2px 4px",
      display: "flex",
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    listSection: {
    },
    ul: {
      height:'1em',
      color:'black',
      padding: 0,
    },
  })
);

const ItemAdder = ({ onShowCheckout }) => {
  const classes = useStyles();
  const [input, setInput] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [items, setItems] = React.useState([])
  const fetchItems = async () => {
    await Axios.get(`${process.env.REACT_APP_SERVER_URL}/groccery/getAll`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
    }).then((response) => {
      setItems(response.data)
    })
  }

  const addItem = () => {
    const priceValue = parseFloat(price)
    if (!input.trim() || !price || priceValue <= 0) {
      alert('Please enter an item name and a price greater than 0.');
      return;
    }
    const data = { grocceryItem: input, price: priceValue }
    Axios.post(`${process.env.REACT_APP_SERVER_URL}/groccery/add`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
    }).then(() => {
      setInput("")
      setPrice("")
      fetchItems()
    })
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Add grocery item (vegetables, fruits, dairy, snacks...)"
          onChange={(e) => {
            setInput(e.target.value)
          }}
          value={input}
        />
        <InputBase
          className={classes.input}
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || parseFloat(val) >= 0) {
              setPrice(val);
            } else {
              setPrice("0");
            }
          }}
          value={price}
          style={{ maxWidth: 90, marginLeft: 8 }}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={(e) => {
            e.preventDefault();
            addItem()
          }}
        >
          <AddIcon />
        </IconButton>
      </Paper>
      <ItemList items={items} refreshItems={fetchItems} onShowCheckout={onShowCheckout} />
    </div>
  )
}

export default ItemAdder