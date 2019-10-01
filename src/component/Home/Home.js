import React, { Component } from "react";
import Menu from '../Menu/Menu.js';
import {CardList} from '../CardList/CardList.js';
import './Home.css';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Container, Button, lightColors, darkColors } from 'react-floating-action-button';
import TextField from '@material-ui/core/TextField';
import { now } from "moment";
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import { DialogContent } from '@material-ui/core';

import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import { Select } from '@material-ui/core';
import swal from 'sweetalert';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            description: "",
            responsibleName: "",
            responsibleEmail: "",
            status: "",
            dueDate: now(),
            open: false,
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleChangeResponsibleName = this.handleChangeResponsibleName.bind(this);
        this.handleChangeResponsibleEmail = this.handleChangeResponsibleEmail.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleChangeDueDate = this.handleChangeDueDate.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.addingTask = this.addingTask.bind(this);
    }

    handleClickOpen(){
        this.setState({
            open: true
        });
    }

    handleClose(){
        this.setState({
            open: false
        });
    }

    handleDescriptionChange(event){
        this.setState({
            description: event.target.value
        });
    }

    handleChangeResponsibleName(event){
        this.setState({
            responsibleName: event.target.value 
        });
    };

    handleChangeResponsibleEmail(event){
        this.setState({
            responsibleEmail: event.target.value 
        });
    };
    
    handleChangeStatus(event){
        this.setState({
            status: event.target.value
        });
    };

    handleChangeDueDate(date){
        this.setState({
            dueDate: date
        });
    };

    addingTask(task){
        this.setState(prevState => ({
            items: prevState.items.concat(task),
            description: "",
            responsibleName:"",
            responsibleEmail: "",
            status: "",
            dueDate: this.state.dueDate,
            open: true
        }));
    }

    showError(msg){
        swal({
            title:"Ooops!",
            text: msg,
            icon: "error",
            button: false,
            timer: 2000
        });
    }

    handleSubmit(event){
        event.preventDefault();
        if( this.state.description==="" ||
            this.state.responsibleName==="" ||
            this.state.responsibleEmail==="" ||
            this.state.status==="" ||
            this.state.dueDate===null){
            this.showError("To add a new task you must fill out the form completely");
        }else{
            const newTask = {
                description: this.state.description,
                responsible: {
                    name: this.state.responsibleName,
                    email: this.state.responsibleEmail
                },
                status: this.state.status,
                dueDate: this.state.dueDate
            }
            var taskList = (localStorage.getItem("taskList")!=null)?JSON.parse(localStorage.getItem("taskList")):[]
            var taskListJSON = []
            for(var i=0; i<taskList.length; i++){
                taskListJSON.push(taskList[i]);
            }
            taskListJSON.push(newTask);
            localStorage.setItem("taskList", JSON.stringify(taskListJSON));           

            swal({
                title:"Good job!",
                text: "You have created a new task sucessfully!",
                icon: "success",
                timer: 2000,
                button: false,
            }).then(() => {
                this.handleClose();
            });

        }
    }

    render(){

        const styles = theme => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
        });
          
        const DialogTitle = withStyles(styles)(props => {
            const { children, classes, onClose } = props;
            return (
                <MuiDialogTitle disableTypography className={classes.root}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                    </IconButton>
                ) : null}
                </MuiDialogTitle>
            );
        });

        return(
            <div>
                <Menu />
                <CardList cardList={(localStorage.getItem("taskList")!=null) ? JSON.parse(localStorage.getItem("taskList")):[]}/>
                
                <Container>
                    <Button variant="outlined" color="secondary" onClick={this.handleClickOpen} className="addTaskButton"
                        tooltip="Add a task"
                        styles={{backgroundColor: "#212121", color: lightColors.white}}
                    >
                        <h1>+</h1>
                    </Button>
                    <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
                        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                            Adding a task
                        </DialogTitle>
                        <DialogContent dividers>
                            <form className="form" noValidate onSubmit={this.handleSubmit}>

                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    name="description"
                                    onChange = {this.handleDescriptionChange}
                                    autoFocus
                                />

                                <TextField variant="outlined" margin="normal" required fullWidth name="responsibleName"
                                    label="Responsible's name" type="text" id="respnsibleName"
                                    onChange = {this.handleChangeResponsibleName}
                                />

                                <TextField variant="outlined" margin="normal" required fullWidth name="responsibleEmail"
                                    label="Responsible's email" type="text" id="responsibleEmail"
                                    onChange = {this.handleChangeResponsibleEmail}
                                />

                                <br/>
                                <InputLabel htmlFor="status">Status</InputLabel>
                                <Select
                                    required
                                    fullWidth
                                    onChange={this.handleChangeStatus}
                                    name="status"
                                    id="status"
                                    value={this.state.status}
                                >
                                    <MenuItem value="Ready">Ready</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                </Select>

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="left">
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Date picker inline"
                                            value={this.state.dueDate}
                                            onChange={this.handleChangeDueDate}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>

                                <Button fullWidth variant="contained"
                                    color="secundary" className="submit">
                                    Add task
                                </Button>                       
                            </form>
                        </DialogContent>
                    </Dialog>
                </Container>
            </div>
        );
    }

}