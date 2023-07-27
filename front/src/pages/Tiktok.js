import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


function Tiktok() {
    const [url, setUrl] = useState("");
    const [data, setData] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://167.99.195.35/api/tik", { url });
            
            if (response.status === 201) {
                setData(response.data)
                toast.success("Success!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000
                });
            } else {
                toast.error("Failed!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000
                });
            }
        } catch (error) {
            console.log(" Error From sending request", error)
            toast.error("Failed!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000
            });
            
        }
    };

    return (
       
        <Box 
    component="form" 
    onSubmit={handleSubmit} 
    sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '300px', 
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid grey',
        borderRadius: '5px',
        padding: '20px',
        bgcolor: 'background.paper',
    }}
>
    <Typography variant="h5" component="h2" align="center" gutterBottom>
        Upload TikTok URL
    </Typography>
    <TextField 
        label="URL"
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        margin="normal"
    />
    
    <Button variant="contained" type="submit">
        Submit
    </Button>

   {data ? (
    
    <>
    <p>{data.data.title}</p>
    <p>{data.username}</p>1
    </>
   ) : null}
   {console.log(data)}
    <ToastContainer />
</Box>

    );
}

export default Tiktok;
