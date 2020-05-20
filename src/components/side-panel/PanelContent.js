import React from 'react'

import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import StorageIcon from '@material-ui/icons/Storage';
import LayersIcon from '@material-ui/icons/Layers';
import EditLocationIcon from '@material-ui/icons/EditLocation';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: 'black',
    backgroundColor: 'lightgrey',
    fontWeight: 150,
    fontSize: theme.typography.pxToRem(12),
    '&:focus': {
      opacity: 1,
      color: 'primary',
    },
    minWidth: "auto",
    width: 100,
    minHeight: "auto",
    height: 50,
    padding: 0
  },
}))((props) => <Tab disableRipple {...props} />);

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <div position="static">
        <Tabs value={value} onChange={handleChange} indicatorColor='primary'>
          <StyledTab label={ <div><StorageIcon style={{verticalAlign: 'middle'}} />  Data</div> } />
          <StyledTab label={ <div><LayersIcon style={{verticalAlign: 'middle'}} />  Layers</div> } />
          <StyledTab label={ <div><EditLocationIcon style={{verticalAlign: 'middle'}} />  Map</div> } />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  )
  
}