import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { TextField, Button, Typography, Paper, jssPreset } from '@material-ui/core';

import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

// GET THE CURRENT ID

export default function Form ({currentId, setCurrentId}) {
    const [postData, setPostData] = useState({
        title : '', message : '', tags : '', selectedFile : ''
    });
    // ambil object posts sesaui id (currentId)
    const post = useSelector((state) => (currentId ? state.posts.find((message) => message._id === currentId) : null))
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if (post) setPostData(post);
    }, [post]);

    const handleSubmit = (e) => {
        console.log('[SUBMIT]. [CURRENT ID] : '+currentId);
        e.preventDefault();

        if (currentId === 0) { // set default '0'
            dispatch(createPost({...postData, name : user?.result?.name}));
        } else {
            dispatch(updatePost(currentId, {...postData, name : user?.result?.name}));
        }
        clear();
    }

    const clear = () => {
        setCurrentId(null);
        setPostData({creator : '', title : '', message : '', tags : '', selectedFile : ''});
    }

    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper className={classes.paper}>
            <form autoComplete="off" className={`${classes.root} ${classes.form}`} noValidate onSubmit={handleSubmit}>
                <Typography variant='h6'>{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
                <TextField 
                    name="title" 
                    variant='outlined' 
                    label='Title' 
                    fullWidth 
                    onChange={(e) => setPostData({ ...postData , title : e.target.value})} 
                    value={postData.title}/>
                <TextField 
                    name="message" 
                    variant='outlined' 
                    label='Message' 
                    fullWidth 
                    onChange={(e) => setPostData({ ...postData , message : e.target.value})} 
                    value={postData.message}/>
                <TextField 
                    name="tags" 
                    variant='outlined' 
                    label='Tags' 
                    fullWidth 
                    onChange={(e) => setPostData({ ...postData , tags : e.target.value.split(',')})} 
                    value={postData.tags}/>
                <div className={classes.fileInput}>
                    <FileBase
                        type="file"
                        multipe={false}
                        onDone={({base64}) => setPostData({...postData, selectedFile : base64})}
                    />
                </div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button className={classes.Clear} variant="contained" color="secondary" size="small" type="submit" fullWidth onClick={clear}>Cancel</Button>
            </form>
        </Paper>
    ); 
}