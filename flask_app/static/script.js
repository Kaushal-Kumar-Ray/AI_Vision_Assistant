let video = document.getElementById("video");
let stream = null;
let counter = 0;


// START CAMERA (ROBUST VERSION)
async function startCamera(){

    try {

        // get available devices
        const devices =
            await navigator.mediaDevices.enumerateDevices();

        const cameras =
            devices.filter(d => d.kind === "videoinput");

        if(cameras.length === 0){
            alert("No camera found");
            return;
        }

        stream =
            await navigator.mediaDevices.getUserMedia({
                video:{
                    deviceId:
                        cameras[0].deviceId
                },
                audio:false
            });

        video.srcObject = stream;

    }
    catch(err){
        console.error(err);
        alert("Camera access failed.\nCheck browser permission.");
    }
}


// STOP CAMERA
function stopCamera(){

    if(stream){
        stream.getTracks().forEach(track=>{
            track.stop();
        });

        video.srcObject=null;
    }
}


// CAPTURE IMAGE
function capture(){

    if(!stream){
        alert("Start camera first");
        return;
    }

    const canvas=document.createElement("canvas");

    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    canvas.getContext("2d")
          .drawImage(video,0,0);

    canvas.toBlob(function(blob){

        let fd=new FormData();

        fd.append(
            "label",
            document.getElementById("label").value
        );

        fd.append("image",blob,"img.jpg");

        fetch("/capture",{
            method:"POST",
            body:fd
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.status==="saved"){
                counter++;
                document.getElementById(
                    "counter"
                ).innerText=
                "Captured: "+counter;
            }
        });

    },"image/jpeg");
}