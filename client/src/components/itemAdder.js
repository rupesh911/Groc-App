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

const ItemAdder = () => {
  const classes = useStyles();
  const [input, setInput] = React.useState('')
  const [items, setItems] = React.useState([])
  const addItem = () => {
    const data = { grocceryItem: input }

    Axios.post('http://localhost:8000/groccery/add', data).then(response => {
      setInput(" ")
    })
  }
  useEffect(async () => {
    let data = await Axios.get('http://localhost:8000/groccery/getAll').then(response => {
      setItems(response.data)
    })
  }, [items])
  return (
    <div>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Add Shoping Items"
          onChange={(e) => {
            setInput(e.target.value)
          }}
          value={input}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={() => {
            addItem()
          }}
        >
          <AddIcon />
        </IconButton>
      </Paper>
      <ItemList items={items} />
    </div>
  )
}

export default ItemAdder